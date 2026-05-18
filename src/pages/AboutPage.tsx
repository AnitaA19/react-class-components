import { Link } from "react-router-dom";
import Header from "../components/Header";

const AboutPage = () => (
  <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-8">
    <Header />
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">About</h2>
      <p className="mt-4 text-sm leading-7 text-slate-600">
        Product Search is a learning project built with React, TypeScript, and
        Vite. It demonstrates search, pagination, routing, and a master-detail
        layout.
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-semibold text-slate-900">Author</h3>
        <p className="mt-2 text-sm text-slate-600">Anita Balasanyan</p>
        <p className="mt-1 text-sm text-slate-500">
          RS School student — React course
        </p>
      </div>
      <p className="mt-6 text-sm text-slate-600">
        Learn more on the{" "}
        <a
          href="https://rs.school/react"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-blue-600 underline-offset-2 hover:underline"
        >
          RS School React course
        </a>{" "}
        page.
      </p>
      <Link
        to="/?page=1"
        className="mt-6 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
      >
        Back to search
      </Link>
    </section>
  </main>
);

export default AboutPage;
