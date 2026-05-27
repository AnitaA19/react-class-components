import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import HomeLayout from "../layouts/HomeLayout";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useSelectedItemsStore } from "../store/selectedItemsStore";
import { fetchProducts, PAGE_SIZE } from "../services/productApi";
import type { ProductItem } from "../types";

const SEARCH_STORAGE_KEY = "search-app-last-term";

const parsePage = (value: string | null): number => {
  const page = Number(value);
  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }

  return Math.floor(page);
};

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [savedTerm, setSavedTerm] = useLocalStorage(SEARCH_STORAGE_KEY);
  const toggleItem = useSelectedItemsStore((state) => state.toggleItem);

  const currentPage = parsePage(searchParams.get("page"));

  const [searchInput, setSearchInput] = useState(savedTerm);
  const [lastSubmittedTerm, setLastSubmittedTerm] = useState(savedTerm);
  const [items, setItems] = useState<ProductItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [triggerCrash, setTriggerCrash] = useState(false);

  const loadItems = useCallback(async (term: string, page: number) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetchProducts(term, page);
      const pages = Math.max(1, Math.ceil(response.total / PAGE_SIZE));

      setItems(response.items);
      setTotalPages(pages);

      if (page > pages) {
        return pages;
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something unexpected happened while loading.";
      setErrorMessage(message);
      setItems([]);
    } finally {
      setIsLoading(false);
    }

    return page;
  }, []);

  useEffect(() => {
    if (!searchParams.get("page")) {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1");
      setSearchParams(params, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    let isCancelled = false;

    const run = async () => {
      const resolvedPage = await loadItems(lastSubmittedTerm, currentPage);
      if (!isCancelled && resolvedPage && resolvedPage !== currentPage) {
        const params = new URLSearchParams(searchParams);
        params.set("page", String(resolvedPage));
        setSearchParams(params, { replace: true });
      }
    };

    void run();

    return () => {
      isCancelled = true;
    };
  }, [
    currentPage,
    lastSubmittedTerm,
    loadItems,
    searchParams,
    setSearchParams,
  ]);

  const resetPageInUrl = useCallback(
    (closeDetails = false) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1");

      if (closeDetails) {
        params.delete("details");
      }

      const search = `?${params.toString()}`;

      if (closeDetails && location.pathname === "/details") {
        navigate({ pathname: "/", search });
        return;
      }

      setSearchParams(params, { replace: true });
    },
    [location.pathname, navigate, searchParams, setSearchParams],
  );

  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
    resetPageInUrl(true);
  };

  const handleSearchClick = () => {
    const trimmedTerm = searchInput.trim();

    if (trimmedTerm === lastSubmittedTerm) {
      return;
    }

    setSavedTerm(trimmedTerm);
    setSearchInput(trimmedTerm);
    setLastSubmittedTerm(trimmedTerm);
    resetPageInUrl(true);
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === currentPage) {
      return;
    }

    const params = new URLSearchParams(searchParams);
    params.set("page", String(nextPage));

    if (location.pathname === "/details") {
      navigate({
        pathname: "/details",
        search: `?${params.toString()}`,
      });
      return;
    }

    setSearchParams(params);
  };

  const handleCheckboxChange = (item: ProductItem) => {
    toggleItem(item);
  };

  const handleOpenDetails = (id: number) => {
    navigate({
      pathname: "/details",
      search: `?page=${currentPage}&details=${id}`,
    });
  };

  const handleCrashButtonClick = () => {
    setTriggerCrash(true);
  };

  return (
    <HomeLayout
      searchInput={searchInput}
      items={items}
      currentPage={currentPage}
      totalPages={totalPages}
      isLoading={isLoading}
      errorMessage={errorMessage}
      triggerCrash={triggerCrash}
      onSearchInputChange={handleSearchInputChange}
      onSearchClick={handleSearchClick}
      onPageChange={handlePageChange}
      onCheckboxChange={handleCheckboxChange}
      onOpenDetails={handleOpenDetails}
      onCrashButtonClick={handleCrashButtonClick}
    />
  );
};

export default HomePage;
