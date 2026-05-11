import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Component } from "react";
import { describe, expect, it, vi } from "vitest";
import ErrorBoundary from "./ErrorBoundary";

class ThrowOnClick extends Component<object, { shouldThrow: boolean }> {
  state = { shouldThrow: false };

  private handleClick = () => {
    this.setState({ shouldThrow: true });
  };

  render() {
    if (this.state.shouldThrow) {
      throw new Error("boom");
    }

    return (
      <button type="button" onClick={this.handleClick}>
        Trigger child crash
      </button>
    );
  }
}

describe("ErrorBoundary", () => {
  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <p>Safe child</p>
      </ErrorBoundary>,
    );

    expect(screen.getByText("Safe child")).toBeInTheDocument();
  });

  it("shows fallback UI and logs when child throws", async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowOnClick />
      </ErrorBoundary>,
    );

    await user.click(
      screen.getByRole("button", { name: "Trigger child crash" }),
    );

    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
