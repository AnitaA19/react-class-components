import { Component } from "react";

class Header extends Component {
  render() {
    return (
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Product Search
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Search products and browse results page by page.
        </p>
        <div className="mt-4 h-px bg-slate-200" />
      </header>
    );
  }
}

export default Header;
