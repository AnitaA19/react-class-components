import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ItemDetails from "./ItemDetails";
import { fetchProductById } from "../services/productApi";
import { createProduct } from "../test-utils/fixtures";

vi.mock("../services/productApi", () => ({
  fetchProductById: vi.fn(),
}));

const mockedFetchProductById = vi.mocked(fetchProductById);

const renderDetails = (route = "/details?page=1&details=1") =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/details" element={<ItemDetails />} />
        <Route path="/" element={<p>Home</p>} />
      </Routes>
    </MemoryRouter>,
  );

describe("ItemDetails", () => {
  beforeEach(() => {
    mockedFetchProductById.mockReset();
  });

  it("shows loading indicator while fetching details", () => {
    mockedFetchProductById.mockImplementation(
      () => new Promise(() => undefined),
    );

    renderDetails();

    expect(screen.getByLabelText("Loading details")).toBeInTheDocument();
  });

  it("renders product details after loading", async () => {
    mockedFetchProductById.mockResolvedValue(createProduct());

    renderDetails();

    expect(
      await screen.findByRole("heading", { name: "Phone" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/ID: 1/)).toBeInTheDocument();
  });

  it("navigates home when close is clicked", async () => {
    const user = userEvent.setup();
    mockedFetchProductById.mockResolvedValue(createProduct());

    renderDetails();

    await screen.findByRole("heading", { name: "Phone" });
    await user.click(screen.getByRole("button", { name: "Close details" }));

    await waitFor(() => {
      expect(screen.getByText("Home")).toBeInTheDocument();
    });
  });
});
