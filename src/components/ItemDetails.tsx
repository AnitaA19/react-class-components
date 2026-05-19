import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { ProductItem } from "../types";
import { fetchProductById } from "../services/productApi";

const ItemDetails = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const detailsId = Number(searchParams.get("details"));
  const page = searchParams.get("page") ?? "1";

  const isValidId = Number.isFinite(detailsId) && detailsId > 0;
  const [item, setItem] = useState<ProductItem | null>(null);
  const [isLoading, setIsLoading] = useState(isValidId);
  const [error, setError] = useState<string | null>(
    isValidId ? null : "Invalid product id.",
  );

  useEffect(() => {
    if (!isValidId) {
      return;
    }

    let isCancelled = false;

    const loadDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const product = await fetchProductById(detailsId);
        if (!isCancelled) {
          setItem(product);
        }
      } catch (loadError) {
        if (!isCancelled) {
          const message =
            loadError instanceof Error
              ? loadError.message
              : "Something unexpected happened while loading.";
          setError(message);
          setItem(null);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadDetails();

    return () => {
      isCancelled = true;
    };
  }, [detailsId, isValidId]);

  const handleClose = () => {
    navigate({ pathname: "/", search: `?page=${page}` });
  };

  return (
    <aside
      className="flex h-full min-h-[320px] w-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:min-w-[280px] lg:max-w-sm"
      aria-label="Item details"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">Details</h2>
        <button
          type="button"
          className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-sm text-slate-700 transition-colors hover:bg-slate-50"
          onClick={handleClose}
          aria-label="Close details"
        >
          Close
        </button>
      </div>
      {isLoading ? (
        <div
          className="my-10 flex flex-1 justify-center"
          aria-label="Loading details"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
        </div>
      ) : null}
      {!isLoading && error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      {!isLoading && !error && item ? (
        <article className="flex-1">
          <h3 className="text-xl font-semibold text-slate-900">{item.name}</h3>
          <p className="mt-1 text-xs text-slate-500">ID: {item.id}</p>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            {item.description}
          </p>
        </article>
      ) : null}
    </aside>
  );
};

export default ItemDetails;
