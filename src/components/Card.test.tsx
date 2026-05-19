import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
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
        isSelected={false}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByRole("heading", { name: "Phone" })).toBeInTheDocument();
    expect(
      screen.getByText("A smartphone with great camera"),
    ).toBeInTheDocument();
  });

  it("calls onSelect when clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <Card
        item={{
          id: 5,
          name: "Phone",
          description: "Description",
        }}
        isSelected={false}
        onSelect={onSelect}
      />,
    );

    await user.click(screen.getByRole("button"));
    expect(onSelect).toHaveBeenCalledWith(5);
  });

  it("calls onSelect when activated with the keyboard", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <Card
        item={{
          id: 5,
          name: "Phone",
          description: "Description",
        }}
        isSelected={false}
        onSelect={onSelect}
      />,
    );

    screen.getByRole("button").focus();
    await user.keyboard("{Enter}");

    expect(onSelect).toHaveBeenCalledWith(5);
  });
});
