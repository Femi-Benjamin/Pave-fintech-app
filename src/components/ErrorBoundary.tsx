import React from "react";

type State = { hasError: boolean };

/** Catches render crashes so one bad screen never blanks the whole app. */
export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Keep details in the console only; never show them to the user.
    console.error("Unhandled UI error:", error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FF] p-6">
        <div className="max-w-sm w-full rounded-2xl bg-white p-8 text-center shadow-sm border border-[#F1F3FB]">
          <h1 className="text-lg font-bold text-[#0D0F1C]">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Don't worry, your money and account are safe. Please reload the
            page to continue.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 w-full rounded-xl bg-[#2D3EF2] py-3 text-sm font-semibold text-white cursor-pointer"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}
