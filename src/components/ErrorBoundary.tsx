import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      "Application error caught by ErrorBoundary:",
      error,
      errorInfo,
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-4">
          <section className="w-full border border-rose-200 bg-rose-50 p-6 text-rose-800">
            <h2 className="text-2xl font-semibold">Something went wrong.</h2>
            <p className="mt-2 text-sm">
              Please refresh the page and try again.
            </p>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
