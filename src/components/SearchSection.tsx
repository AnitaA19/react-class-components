import { Component, type ChangeEvent, type FormEvent } from "react";

interface SearchSectionProps {
  value: string;
  isLoading: boolean;
  onSearchInputChange: (value: string) => void;
  onSearchClick: () => void;
}

class SearchSection extends Component<SearchSectionProps> {
  private handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.props.onSearchInputChange(event.target.value);
  };

  private handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.onSearchClick();
  };

  render() {
    const { value, isLoading } = this.props;

    return (
      <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <label
          htmlFor="search-input"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Search term
        </label>
        <form
          className="grid gap-3 md:grid-cols-[1fr_auto]"
          onSubmit={this.handleSubmit}
        >
          <input
            id="search-input"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500"
            type="text"
            placeholder="Try: phone, laptop, perfume..."
            value={value}
            onChange={this.handleInputChange}
          />
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </form>
      </section>
    );
  }
}

export default SearchSection;
