import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useLocalStorage } from "./useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("reads the initial value from localStorage", () => {
    localStorage.setItem("test-key", "saved");

    const { result } = renderHook(() => useLocalStorage("test-key"));

    expect(result.current[0]).toBe("saved");
  });

  it("writes updated values to localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("test-key"));

    act(() => {
      result.current[1]("updated");
    });

    expect(result.current[0]).toBe("updated");
    expect(localStorage.getItem("test-key")).toBe("updated");
  });
});
