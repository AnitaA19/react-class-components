import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Card from "./Card";

const item = {
  id: 5,
  name: "Phone",
  description: "A smartphone with great camera",
};

describe("Card", () => {
  it("renders product name and description", () => {
    render(
      <Card
        item={item}
        isChecked={false}
        isDetailsActive={false}
        onCheckboxChange={vi.fn()}
        onOpenDetails={vi.fn()}
      />,
    );

    expect(screen.getByRole("heading", { name: "Phone" })).toBeInTheDocument();
    expect(
      screen.getByText("A smartphone with great camera"),
    ).toBeInTheDocument();
  });

  it("calls onCheckboxChange when checkbox is toggled", async () => {
    const user = userEvent.setup();
    const onCheckboxChange = vi.fn();

    render(
      <Card
        item={item}
        isChecked={false}
        isDetailsActive={false}
        onCheckboxChange={onCheckboxChange}
        onOpenDetails={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("checkbox", { name: "Select Phone" }));
    expect(onCheckboxChange).toHaveBeenCalledWith(item);
    expect(onCheckboxChange).toHaveBeenCalledTimes(1);
  });

  it("calls onOpenDetails when the card is clicked", async () => {
    const user = userEvent.setup();
    const onOpenDetails = vi.fn();

    render(
      <Card
        item={item}
        isChecked={false}
        isDetailsActive={false}
        onCheckboxChange={vi.fn()}
        onOpenDetails={onOpenDetails}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Open details for Phone" }),
    );
    expect(onOpenDetails).toHaveBeenCalledWith(5);
  });

  it("opens details when activated with the keyboard", async () => {
    const user = userEvent.setup();
    const onOpenDetails = vi.fn();

    render(
      <Card
        item={item}
        isChecked={false}
        isDetailsActive={false}
        onCheckboxChange={vi.fn()}
        onOpenDetails={onOpenDetails}
      />,
    );

    screen.getByRole("button", { name: "Open details for Phone" }).focus();
    await user.keyboard("{Enter}");

    expect(onOpenDetails).toHaveBeenCalledWith(5);
  });
});
