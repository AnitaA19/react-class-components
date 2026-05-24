import { beforeEach, describe, expect, it, vi } from "vitest";
import { createProduct } from "../test-utils/fixtures";
import { buildSelectedItemsCsv, downloadSelectedItemsCsv } from "./downloadCsv";

describe("downloadCsv", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("builds csv with headers and escaped values", () => {
    const csv = buildSelectedItemsCsv(
      [
        createProduct({
          id: 7,
          name: 'Phone, "Pro"',
          description: "Line\nbreak",
        }),
      ],
      "http://localhost:5173",
    );

    expect(csv).toContain("ID,Name,Description,Details URL");
    expect(csv).toContain('"Phone, ""Pro"""');
    expect(csv).toContain('"Line\nbreak"');
    expect(csv).toContain("http://localhost:5173/details?page=1&details=7");
  });

  it("downloads csv using native browser APIs", () => {
    const click = vi.fn();
    const link = {
      href: "",
      download: "",
      click,
    } as HTMLAnchorElement;

    const createElementSpy = vi
      .spyOn(document, "createElement")
      .mockReturnValue(link);
    const createObjectURLSpy = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:test");
    const revokeObjectURLSpy = vi.spyOn(URL, "revokeObjectURL");

    downloadSelectedItemsCsv([
      createProduct({ id: 1 }),
      createProduct({ id: 2, name: "Laptop" }),
    ]);

    expect(createElementSpy).toHaveBeenCalledWith("a");
    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(link.download).toBe("2_items.csv");
    expect(click).toHaveBeenCalled();
    expect(revokeObjectURLSpy).toHaveBeenCalledWith("blob:test");
  });

  it("does nothing when there are no selected items", () => {
    const createElementSpy = vi.spyOn(document, "createElement");

    downloadSelectedItemsCsv([]);

    expect(createElementSpy).not.toHaveBeenCalled();
  });
});
