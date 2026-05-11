import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { fetchProducts } from "./services/productApi";
import { createProduct } from "./test-utils/fixtures";
import { renderWithProviders } from "./test-utils";

vi.mock("./services/productApi", () => ({
  PAGE_SIZE: 12,
  fetchProducts: vi.fn(),
}));

const mockedFetchProducts = vi.mocked(fetchProducts);

describe("App", () => {
  beforeEach(() => {
    mockedFetchProducts.mockReset();
    localStorage.clear();
  });

  it("loads initial data using saved localStorage term", async () => {
    localStorage.setItem("search-app-last-term", "phone");
    mockedFetchProducts.mockResolvedValue({
      items: [createProduct()],
      total: 1,
    });

    renderWithProviders(<App />);

    await waitFor(() => {
      expect(mockedFetchProducts).toHaveBeenCalledWith("phone", 1);
    });

    expect(screen.getByDisplayValue("phone")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Phone" })).toBeInTheDocument();
  });

  it("searches with trimmed term and saves it to localStorage", async () => {
    const user = userEvent.setup();
    mockedFetchProducts.mockResolvedValue({
      items: [
        createProduct({
          id: 2,
          name: "Laptop",
          description: "Laptop description",
        }),
      ],
      total: 1,
    });

    renderWithProviders(<App />);

    await waitFor(() => {
      expect(mockedFetchProducts).toHaveBeenCalledWith("", 1);
    });

    const input = screen.getByLabelText("Search term");
    await user.clear(input);
    await user.type(input, "  laptop  ");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(mockedFetchProducts).toHaveBeenLastCalledWith("laptop", 1);
    });
    expect(localStorage.getItem("search-app-last-term")).toBe("laptop");
  });

  it("does not run a duplicate search for unchanged term", async () => {
    const user = userEvent.setup();
    mockedFetchProducts.mockResolvedValue({
      items: [],
      total: 0,
    });

    renderWithProviders(<App />);

    await waitFor(() => {
      expect(mockedFetchProducts).toHaveBeenCalledTimes(1);
    });

    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(mockedFetchProducts).toHaveBeenCalledTimes(1);
  });

  it("handles pagination click by requesting another page", async () => {
    const user = userEvent.setup();
    mockedFetchProducts
      .mockResolvedValueOnce({
        items: [{ id: 1, name: "Phone", description: "Phone description" }],
        total: 30,
      })
      .mockResolvedValueOnce({
        items: [{ id: 3, name: "Tablet", description: "Tablet description" }],
        total: 30,
      });

    renderWithProviders(<App />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(mockedFetchProducts).toHaveBeenLastCalledWith("", 2);
    });
  });

  it("ignores pagination clicks for the current page", async () => {
    const user = userEvent.setup();
    mockedFetchProducts.mockResolvedValue({
      items: [createProduct()],
      total: 30,
    });

    renderWithProviders(<App />);

    await waitFor(() => {
      expect(mockedFetchProducts).toHaveBeenCalledTimes(1);
    });

    const previous = screen.getByRole("button", { name: "Previous" });
    expect(previous).toBeDisabled();

    await user.click(previous);
    expect(mockedFetchProducts).toHaveBeenCalledTimes(1);
  });

  it("shows error message when API request fails", async () => {
    mockedFetchProducts.mockRejectedValue(new Error("API failed"));

    renderWithProviders(<App />);

    expect(await screen.findByText("API failed")).toBeInTheDocument();
  });

  it("triggers error boundary fallback after clicking error button", async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockedFetchProducts.mockResolvedValue({
      items: [],
      total: 0,
    });

    renderWithProviders(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>,
    );

    await waitFor(() => {
      expect(mockedFetchProducts).toHaveBeenCalled();
    });

    await user.click(screen.getByRole("button", { name: "Error Button" }));

    expect(
      await screen.findByText("Something went wrong."),
    ).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
