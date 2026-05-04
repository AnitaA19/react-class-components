import { Component } from "react";
import type { ProductItem } from "../types";

interface CardProps {
  item: ProductItem;
}

class Card extends Component<CardProps> {
  render() {
    const { item } = this.props;

    return (
      <article className="h-full rounded-lg border border-slate-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm">
        <h3 className="truncate text-base font-semibold text-slate-900">
          {item.name}
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {item.description}
        </p>
      </article>
    );
  }
}

export default Card;
