import { NavLink } from "react-router-dom";

const Header = () => (
  <header className="mb-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Product Search
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Search products and browse results page by page.
        </p>
      </div>
      <nav aria-label="Main navigation">
        <ul className="flex gap-2">
          <li>
            <NavLink
              to="/?page=1"
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
              end
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              About
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
    <div className="mt-4 h-px bg-slate-200" />
  </header>
);

export default Header;
