import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-4 py-8">
    <section className="w-full rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h1 className="text-6xl font-semibold text-slate-900">404</h1>
      <p className="mt-4 text-lg text-slate-700">Page not found</p>
      <p className="mt-2 text-sm text-slate-500">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/?page=1"
        className="mt-6 inline-block rounded-md bg-slate-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
      >
        Back to home
      </Link>
    </section>
  </main>
);

export default NotFoundPage;
