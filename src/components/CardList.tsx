import type { ProductItem } from "../types";
import { useSelectedItemsStore } from "../store/selectedItemsStore";
import Card from "./Card";

interface CardListProps {
  items: ProductItem[];
  detailsItemId: number | null;
  onCheckboxChange: (item: ProductItem) => void;
  onOpenDetails: (id: number) => void;
}

const CardList = ({
  items,
  detailsItemId,
  onCheckboxChange,
  onOpenDetails,
}: CardListProps) => {
  const itemsById = useSelectedItemsStore((state) => state.itemsById);

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center dark:border-slate-600 dark:bg-slate-800/50">
        <p className="text-sm text-slate-700 dark:text-slate-200">
          No products found
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Try another keyword or clear the search input.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card
          key={item.id}
          item={item}
          isChecked={Boolean(itemsById[item.id])}
          isDetailsActive={detailsItemId === item.id}
          onCheckboxChange={onCheckboxChange}
          onOpenDetails={onOpenDetails}
        />
      ))}
    </div>
  );
};

export default CardList;
