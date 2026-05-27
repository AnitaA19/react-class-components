import type { ProductItem } from "../types";

const escapeCsvValue = (value: string): string => {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

const buildDetailsUrl = (itemId: number, origin: string): string =>
  `${origin}/details?page=1&details=${itemId}`;

export const buildSelectedItemsCsv = (
  items: ProductItem[],
  origin: string,
): string => {
  const headers = ["ID", "Name", "Description", "Details URL"];
  const rows = items.map((item) =>
    [
      String(item.id),
      escapeCsvValue(item.name),
      escapeCsvValue(item.description),
      escapeCsvValue(buildDetailsUrl(item.id, origin)),
    ].join(","),
  );

  return [headers.join(","), ...rows].join("\n");
};

export const downloadSelectedItemsCsv = (items: ProductItem[]): void => {
  if (items.length === 0) {
    return;
  }

  const csv = buildSelectedItemsCsv(items, window.location.origin);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${items.length}_items.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
