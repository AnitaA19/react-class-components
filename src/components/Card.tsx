import type { KeyboardEvent, MouseEvent } from "react";
import type { ProductItem } from "../types";

interface CardProps {
  item: ProductItem;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

const Card = ({ item, isSelected, onSelect }: CardProps) => {
  const handleSelect = () => {
    onSelect(item.id);
  };

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
    handleSelect();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.stopPropagation();
      handleSelect();
    }
  };

  return (
    <article
      className={`h-full cursor-pointer rounded-lg border bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm ${
        isSelected ? "border-blue-500 ring-2 ring-blue-200" : "border-slate-200"
      }`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
    >
      <h3 className="truncate text-base font-semibold text-slate-900">
        {item.name}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {item.description}
      </p>
    </article>
  );
};

export default Card;
