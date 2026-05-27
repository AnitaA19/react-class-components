import CardList from "./CardList";
import Pagination from "./Pagination";
import type { ProductItem } from "../types";

interface MainSectionProps {
  items: ProductItem[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  detailsItemId: number | null;
  onPageChange: (page: number) => void;
  onCheckboxChange: (item: ProductItem) => void;
  onOpenDetails: (id: number) => void;
}

const MainSection = ({
  items,
  isLoading,
  error,
  currentPage,
  totalPages,
  detailsItemId,
  onPageChange,
  onCheckboxChange,
  onOpenDetails,
}: MainSectionProps) => {
  const hasResults = items.length > 0;
  const showContent = !isLoading;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Results
        </h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-200">
          {hasResults ? `${items.length} items` : "No items"}
        </span>
      </div>
      {isLoading ? (
        <div className="my-10 flex justify-center" aria-label="Loading">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900 dark:border-slate-600 dark:border-t-slate-100" />
        </div>
      ) : null}
      {showContent && error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {error}
        </p>
      ) : null}
      {showContent && !error ? (
        <CardList
          items={items}
          detailsItemId={detailsItemId}
          onCheckboxChange={onCheckboxChange}
          onOpenDetails={onOpenDetails}
        />
      ) : null}
      {showContent && !error ? (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          isLoading={isLoading}
          onPageChange={onPageChange}
        />
      ) : null}
    </section>
  );
};

export default MainSection;
