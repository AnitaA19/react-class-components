import { Component } from "react";
import CardList from "./CardList";
import Pagination from "./Pagination";
import type { ProductItem } from "../types";

interface MainSectionProps {
  items: ProductItem[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

class MainSection extends Component<MainSectionProps> {
  render() {
    const { items, isLoading, error, currentPage, totalPages, onPageChange } =
      this.props;
    const hasResults = items.length > 0;

    return (
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Results</h2>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
            {hasResults ? `${items.length} items` : "No items"}
          </span>
        </div>
        {isLoading ? (
          <div className="my-10 flex justify-center" aria-label="Loading">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
          </div>
        ) : null}
        {!isLoading && error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        {!isLoading && !error ? <CardList items={items} /> : null}
        {!isLoading && !error ? (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            isLoading={isLoading}
            onPageChange={onPageChange}
          />
        ) : null}
      </section>
    );
  }
}

export default MainSection;
