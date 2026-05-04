import { Component } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

class Pagination extends Component<PaginationProps> {
  private handlePrevious = () => {
    this.props.onPageChange(this.props.currentPage - 1);
  };

  private handleNext = () => {
    this.props.onPageChange(this.props.currentPage + 1);
  };

  render() {
    const { currentPage, totalPages, isLoading } = this.props;

    if (totalPages <= 1) {
      return null;
    }

    return (
      <nav
        className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
        aria-label="Pagination"
      >
        <button
          type="button"
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={currentPage === 1 || isLoading}
          onClick={this.handlePrevious}
        >
          Previous
        </button>
        <span className="text-sm font-medium text-slate-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={currentPage === totalPages || isLoading}
          onClick={this.handleNext}
        >
          Next
        </button>
      </nav>
    );
  }
}

export default Pagination;
