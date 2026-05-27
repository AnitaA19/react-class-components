import { NavLink } from "react-router-dom";
import { useTheme } from "../context/useTheme";

const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="mb-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Product Search
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Search products and browse results page by page.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <fieldset className="flex items-center gap-2 rounded-md border border-slate-200 p-1 dark:border-slate-600">
            <legend className="sr-only">Theme</legend>
            <button
              type="button"
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                theme === "light"
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
              onClick={() => setTheme("light")}
              aria-pressed={theme === "light"}
            >
              Light
            </button>
            <button
              type="button"
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                theme === "dark"
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
              onClick={() => setTheme("dark")}
              aria-pressed={theme === "dark"}
            >
              Dark
            </button>
          </fieldset>
          <nav aria-label="Main navigation">
            <ul className="flex gap-2">
              <li>
                <NavLink
                  to="/?page=1"
                  className={({ isActive }) =>
                    `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
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
                        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`
                  }
                >
                  About
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="mt-4 h-px bg-slate-200 dark:bg-slate-700" />
    </header>
  );
};

export default Header;
