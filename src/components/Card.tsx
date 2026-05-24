import type { ChangeEvent, KeyboardEvent, MouseEvent } from "react";
import type { ProductItem } from "../types";

interface CardProps {
  item: ProductItem;
  isChecked: boolean;
  isDetailsActive: boolean;
  onCheckboxChange: (item: ProductItem) => void;
  onOpenDetails: (id: number) => void;
}

const Card = ({
  item,
  isChecked,
  isDetailsActive,
  onCheckboxChange,
  onOpenDetails,
}: CardProps) => {
  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    onCheckboxChange(item);
  };

  const handleCheckboxClick = (event: MouseEvent) => {
    event.stopPropagation();
  };

  const handleCardClick = () => {
    onOpenDetails(item.id);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpenDetails(item.id);
    }
  };

  return (
    <article
      className={`h-full cursor-pointer rounded-lg border bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm dark:bg-slate-800 ${
        isChecked
          ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900"
          : isDetailsActive
            ? "border-slate-400 dark:border-slate-500"
            : "border-slate-200 dark:border-slate-700"
      }`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Open details for ${item.name}`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <label
          className="flex items-center gap-2"
          onClick={handleCheckboxClick}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            checked={isChecked}
            onChange={handleCheckboxChange}
            onClick={handleCheckboxClick}
            aria-label={`Select ${item.name}`}
          />
          <span className="sr-only">Select {item.name}</span>
        </label>
      </div>
      <h3 className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
        {item.name}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {item.description}
      </p>
    </article>
  );
};

export default Card;
