import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLocation } from "react-router-dom";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { fetchProductById, fetchProducts } from "./services/productApi";
import {
  isItemSelected,
  useSelectedItemsStore,
} from "./store/selectedItemsStore";
import { createProduct } from "./test-utils/fixtures";
import { renderWithProviders } from "./test-utils";
import * as downloadCsv from "./utils/downloadCsv";

vi.mock("./services/productApi", () => ({
  PAGE_SIZE: 12,
  fetchProducts: vi.fn(),
  fetchProductById: vi.fn(),
}));

const mockedFetchProducts = vi.mocked(fetchProducts);
const mockedFetchProductById = vi.mocked(fetchProductById);

const LocationProbe = () => {
  const { pathname, search } = useLocation();
  return <span data-testid="router-location">{`${pathname}${search}`}</span>;
};

const renderApp = (route = "/?page=1") =>
  renderWithProviders(
    <>
      <LocationProbe />
      <App />
    </>,
    { route },
  );

describe("App", () => {
  beforeEach(() => {
    mockedFetchProducts.mockReset();
    mockedFetchProductById.mockReset();
    localStorage.clear();
  });

  it("loads initial data using saved localStorage term", async () => {
    localStorage.setItem("search-app-last-term", "phone");
    mockedFetchProducts.mockResolvedValue({
      items: [createProduct()],
      total: 1,
    });

    renderApp("/?page=1");

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

    renderApp("/?page=1");

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

    renderApp("/?page=1");

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

    renderApp("/?page=1");

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(mockedFetchProducts).toHaveBeenLastCalledWith("", 2);
      expect(screen.getByTestId("router-location")).toHaveTextContent(
        "/?page=2",
      );
      expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
    });
  });

  it("resets page to 1 in the URL when the search input changes", async () => {
    const user = userEvent.setup();
    mockedFetchProducts.mockResolvedValue({
      items: [createProduct()],
      total: 30,
    });

    renderApp("/?page=2");

    await waitFor(() => {
      expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
    });

    const input = screen.getByLabelText("Search term");
    await user.type(input, "a");

    await waitFor(() => {
      expect(screen.getByTestId("router-location")).toHaveTextContent(
        "/?page=1",
      );
    });
  });

  it("opens item details when the card is clicked outside the checkbox", async () => {
    const user = userEvent.setup();
    const product = createProduct();
    mockedFetchProducts.mockResolvedValue({
      items: [product],
      total: 1,
    });
    mockedFetchProductById.mockResolvedValue(product);

    renderApp("/?page=1");

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Phone" }),
      ).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole("button", { name: "Open details for Phone" }),
    );

    const detailsPanel = await screen.findByLabelText("Item details");

    await waitFor(() => {
      expect(screen.getByTestId("router-location")).toHaveTextContent(
        "/details?page=1&details=1",
      );
    });

    expect(
      within(detailsPanel).getByRole("heading", { name: "Phone" }),
    ).toBeInTheDocument();
    expect(mockedFetchProductById).toHaveBeenCalledWith(1);
  });

  it("selects items with the checkbox without opening details", async () => {
    const user = userEvent.setup();
    const product = createProduct();
    mockedFetchProducts.mockResolvedValue({
      items: [product],
      total: 1,
    });

    renderApp("/?page=1");

    await waitFor(() => {
      expect(
        screen.getByRole("checkbox", { name: "Select Phone" }),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole("checkbox", { name: "Select Phone" }));

    expect(isItemSelected(useSelectedItemsStore.getState().itemsById, 1)).toBe(
      true,
    );
    expect(screen.getByTestId("router-location")).toHaveTextContent("/?page=1");
    expect(screen.queryByLabelText("Item details")).not.toBeInTheDocument();
    expect(screen.getByText("1 item selected")).toBeInTheDocument();
  });

  it("keeps checkbox selections when navigating to another page", async () => {
    const user = userEvent.setup();
    mockedFetchProducts
      .mockResolvedValueOnce({
        items: [createProduct({ id: 1, name: "Phone" })],
        total: 24,
      })
      .mockResolvedValueOnce({
        items: [createProduct({ id: 13, name: "Tablet" })],
        total: 24,
      });

    renderApp("/?page=1");

    await waitFor(() => {
      expect(
        screen.getByRole("checkbox", { name: "Select Phone" }),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole("checkbox", { name: "Select Phone" }));
    await user.click(screen.getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(
        screen.getByRole("checkbox", { name: "Select Tablet" }),
      ).toBeInTheDocument();
    });

    expect(isItemSelected(useSelectedItemsStore.getState().itemsById, 1)).toBe(
      true,
    );
    expect(screen.getByText("1 item selected")).toBeInTheDocument();
  });

  it("persists selected items when navigating to About and back", async () => {
    const user = userEvent.setup();
    mockedFetchProducts.mockResolvedValue({
      items: [createProduct()],
      total: 1,
    });

    renderApp("/?page=1");

    await waitFor(() => {
      expect(
        screen.getByRole("checkbox", { name: "Select Phone" }),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole("checkbox", { name: "Select Phone" }));
    await user.click(screen.getByRole("link", { name: "About" }));
    expect(screen.getByText("1 item selected")).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Back to search" }));

    await waitFor(() => {
      expect(
        screen.getByRole("checkbox", { name: "Select Phone" }),
      ).toBeChecked();
    });
  });

  it("clears selections and downloads csv from the flyout", async () => {
    const user = userEvent.setup();
    const downloadSpy = vi
      .spyOn(downloadCsv, "downloadSelectedItemsCsv")
      .mockImplementation(() => {});
    mockedFetchProducts.mockResolvedValue({
      items: [createProduct()],
      total: 1,
    });

    renderApp("/?page=1");

    await waitFor(() => {
      expect(
        screen.getByRole("checkbox", { name: "Select Phone" }),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole("checkbox", { name: "Select Phone" }));
    await user.click(screen.getByRole("button", { name: "Download" }));

    expect(downloadSpy).toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Unselect all" }));
    expect(
      screen.queryByLabelText("Selected items summary"),
    ).not.toBeInTheDocument();

    downloadSpy.mockRestore();
  });

  it("switches application theme from the header", async () => {
    const user = userEvent.setup();
    mockedFetchProducts.mockResolvedValue({ items: [], total: 0 });

    renderApp("/?page=1");

    await user.click(screen.getByRole("button", { name: "Dark" }));

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("closes the details panel when the main results panel is clicked", async () => {
    const user = userEvent.setup();
    const product = createProduct();
    mockedFetchProducts.mockResolvedValue({
      items: [product],
      total: 1,
    });
    mockedFetchProductById.mockResolvedValue(product);

    renderApp("/details?page=1&details=1");

    await waitFor(() => {
      expect(screen.getByLabelText("Item details")).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole("button", { name: "Close details panel" }),
    );

    await waitFor(() => {
      expect(screen.getByTestId("router-location")).toHaveTextContent(
        "/?page=1",
      );
      expect(screen.queryByLabelText("Item details")).not.toBeInTheDocument();
    });
  });

  it("ignores pagination clicks for the current page", async () => {
    const user = userEvent.setup();
    mockedFetchProducts.mockResolvedValue({
      items: [createProduct()],
      total: 30,
    });

    renderApp("/?page=1");

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

    renderApp("/?page=1");

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
      { route: "/?page=1" },
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

  it("renders about page from navigation link", async () => {
    const user = userEvent.setup();
    mockedFetchProducts.mockResolvedValue({ items: [], total: 0 });

    renderApp("/?page=1");

    await user.click(screen.getByRole("link", { name: "About" }));

    expect(screen.getByRole("heading", { name: "About" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "RS School React course" }),
    ).toHaveAttribute("href", "https://rs.school/react");
  });

  it("renders 404 page for unknown routes", () => {
    mockedFetchProducts.mockResolvedValue({ items: [], total: 0 });

    renderWithProviders(<App />, { route: "/unknown-route" });

    expect(screen.getByText("Page not found")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute(
      "href",
      "/?page=1",
    );
  });
});
