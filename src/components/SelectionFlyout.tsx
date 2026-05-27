import {
  selectSelectedCount,
  selectSelectedItems,
  useSelectedItemsStore,
} from "../store/selectedItemsStore";
import { downloadSelectedItemsCsv } from "../utils/downloadCsv";

const SelectionFlyout = () => {
  const selectedCount = useSelectedItemsStore(selectSelectedCount);
  const clearAll = useSelectedItemsStore((state) => state.clearAll);

  if (selectedCount === 0) {
    return null;
  }

  const handleDownload = () => {
    const selectedItems = selectSelectedItems(useSelectedItemsStore.getState());
    downloadSelectedItemsCsv(selectedItems);
  };

  return (
    <aside
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white px-4 py-3 shadow-[0_-4px_12px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:bg-slate-900"
      aria-label="Selected items summary"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
          {selectedCount} item{selectedCount === 1 ? "" : "s"} selected
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            onClick={clearAll}
          >
            Unselect all
          </button>
          <button
            type="button"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            onClick={handleDownload}
          >
            Download
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SelectionFlyout;
