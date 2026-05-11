import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Card from "./Card";

describe("Card", () => {
  it("renders product name and description", () => {
    render(
      <Card
        item={{
          id: 1,
          name: "Phone",
          description: "A smartphone with great camera",
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: "Phone" })).toBeInTheDocument();
    expect(screen.getByText("A smartphone with great camera")).toBeInTheDocument();
  });
});
