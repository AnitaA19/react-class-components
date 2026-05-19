import type { ProductItem } from "../types";
import Card from "./Card";

interface CardListProps {
  items: ProductItem[];
  selectedItemId: number | null;
  onItemSelect: (id: number) => void;
}

const CardList = ({ items, selectedItemId, onItemSelect }: CardListProps) => {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
        <p className="text-sm text-slate-700">No products found</p>
        <p className="mt-1 text-xs text-slate-500">
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
          isSelected={selectedItemId === item.id}
          onSelect={onItemSelect}
        />
      ))}
    </div>
  );
};

export default CardList;
