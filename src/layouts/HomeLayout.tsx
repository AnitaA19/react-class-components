import { Outlet, useLocation, useNavigate } from "react-router-dom";
import CrashTester from "../components/CrashTester";
import Header from "../components/Header";
import SearchSection from "../components/SearchSection";
import MainSection from "../components/MainSection";
import SelectionFlyout from "../components/SelectionFlyout";
import {
  selectSelectedCount,
  useSelectedItemsStore,
} from "../store/selectedItemsStore";
import type { ProductItem } from "../types";

interface HomeLayoutProps {
  searchInput: string;
  items: ProductItem[];
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  errorMessage: string | null;
  triggerCrash: boolean;
  onSearchInputChange: (value: string) => void;
  onSearchClick: () => void;
  onPageChange: (page: number) => void;
  onCheckboxChange: (item: ProductItem) => void;
  onOpenDetails: (id: number) => void;
  onCrashButtonClick: () => void;
}

const HomeLayout = ({
  searchInput,
  items,
  currentPage,
  totalPages,
  isLoading,
  errorMessage,
  triggerCrash,
  onSearchInputChange,
  onSearchClick,
  onPageChange,
  onCheckboxChange,
  onOpenDetails,
  onCrashButtonClick,
}: HomeLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDetailsOpen = location.pathname === "/details";
  const selectedCount = useSelectedItemsStore(selectSelectedCount);

  const detailsItemId = isDetailsOpen
    ? Number(new URLSearchParams(location.search).get("details"))
    : null;

  const handleMainPanelClick = () => {
    if (!isDetailsOpen) {
      return;
    }

    const params = new URLSearchParams(location.search);
    const page = params.get("page") ?? "1";
    navigate({ pathname: "/", search: `?page=${page}` });
  };

  return (
    <main
      className={`mx-auto min-h-screen w-full max-w-6xl px-4 py-8 ${selectedCount > 0 ? "pb-24" : ""}`}
    >
      {triggerCrash ? <CrashTester /> : null}
      <Header />
      <SearchSection
        value={searchInput}
        isLoading={isLoading}
        onSearchInputChange={onSearchInputChange}
        onSearchClick={onSearchClick}
      />
      <div
        className={`grid gap-4 ${isDetailsOpen ? "lg:grid-cols-[1fr_minmax(280px,360px)]" : ""}`}
      >
        <section
          className="min-w-0"
          onClick={handleMainPanelClick}
          onKeyDown={(event) => {
            if (event.key === "Escape" && isDetailsOpen) {
              handleMainPanelClick();
            }
          }}
          role={isDetailsOpen ? "button" : undefined}
          tabIndex={isDetailsOpen ? 0 : undefined}
          aria-label={isDetailsOpen ? "Close details panel" : undefined}
        >
          <MainSection
            items={items}
            isLoading={isLoading}
            error={errorMessage}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            onCheckboxChange={onCheckboxChange}
            onOpenDetails={onOpenDetails}
            detailsItemId={
              detailsItemId !== null &&
              Number.isFinite(detailsItemId) &&
              detailsItemId > 0
                ? detailsItemId
                : null
            }
          />
        </section>
        {isDetailsOpen ? (
          <div className="min-w-0" onClick={(event) => event.stopPropagation()}>
            <Outlet />
          </div>
        ) : null}
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          onClick={onCrashButtonClick}
        >
          Error Button
        </button>
      </div>
      <SelectionFlyout />
    </main>
  );
};

export default HomeLayout;
