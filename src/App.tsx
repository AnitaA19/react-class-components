import { Component } from "react";
import type { ProductItem } from "./types";
import CrashTester from "./components/CrashTester";
import Header from "./components/Header";
import SearchSection from "./components/SearchSection";
import MainSection from "./components/MainSection";
import { fetchProducts, PAGE_SIZE } from "./services/productApi";

interface AppState {
  searchInput: string;
  lastSubmittedTerm: string;
  items: ProductItem[];
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  errorMessage: string | null;
  triggerCrash: boolean;
}

const SEARCH_STORAGE_KEY = "search-app-last-term";

class App extends Component<object, AppState> {
  state: AppState = {
    searchInput: "",
    lastSubmittedTerm: "",
    items: [],
    currentPage: 1,
    totalPages: 1,
    isLoading: false,
    errorMessage: null,
    triggerCrash: false,
  };

  componentDidMount() {
    const savedTerm = localStorage.getItem(SEARCH_STORAGE_KEY) ?? "";
    this.setState(
      {
        searchInput: savedTerm,
        lastSubmittedTerm: savedTerm,
      },
      () => {
        void this.loadItems(savedTerm, 1);
      },
    );
  }

  private loadItems = async (term: string, page: number) => {
    this.setState({ isLoading: true, errorMessage: null });

    try {
      const response = await fetchProducts(term, page);
      const totalPages = Math.max(1, Math.ceil(response.total / PAGE_SIZE));

      this.setState({
        items: response.items,
        currentPage: page,
        totalPages,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something unexpected happened while loading.";
      this.setState({ errorMessage: message, items: [] });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  private handleSearchInputChange = (value: string) => {
    this.setState({ searchInput: value });
  };

  private handleSearchClick = () => {
    const trimmedTerm = this.state.searchInput.trim();

    if (trimmedTerm === this.state.lastSubmittedTerm) {
      return;
    }

    localStorage.setItem(SEARCH_STORAGE_KEY, trimmedTerm);
    this.setState(
      {
        searchInput: trimmedTerm,
        lastSubmittedTerm: trimmedTerm,
      },
      () => {
        void this.loadItems(trimmedTerm, 1);
      },
    );
  };

  private handlePageChange = (nextPage: number) => {
    const { totalPages, lastSubmittedTerm, currentPage } = this.state;
    if (nextPage < 1 || nextPage > totalPages || nextPage === currentPage) {
      return;
    }

    void this.loadItems(lastSubmittedTerm, nextPage);
  };

  private handleCrashButtonClick = () => {
    this.setState({ triggerCrash: true });
  };

  render() {
    const {
      searchInput,
      items,
      currentPage,
      totalPages,
      isLoading,
      errorMessage,
      triggerCrash,
    } = this.state;

    return (
      <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-8">
        {triggerCrash ? <CrashTester /> : null}
        <Header />
        <SearchSection
          value={searchInput}
          isLoading={isLoading}
          onSearchInputChange={this.handleSearchInputChange}
          onSearchClick={this.handleSearchClick}
        />
        <MainSection
          items={items}
          isLoading={isLoading}
          error={errorMessage}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={this.handlePageChange}
        />
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
            onClick={this.handleCrashButtonClick}
          >
            Error Button
          </button>
        </div>
      </main>
    );
  }
}

export default App;
