import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary";
import { initMonitoring } from "./lib/monitoring";
import { PwaProvider } from "./pwa/PwaProvider";
import { getPublicInfoRoute } from "./lib/publicRoutes";

initMonitoring();
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});
const PublicInfoPage = React.lazy(() => import("./pages/PublicInfoPage"));
const publicRoute = getPublicInfoRoute(window.location.pathname);
const root = ReactDOM.createRoot(document.getElementById("root")!);

if (publicRoute) {
  // Terms, Privacy, Cookies and Help are public pages: no sign-in, no app shell.
  root.render(
    <ErrorBoundary>
      <Suspense fallback={null}>
        <PublicInfoPage route={publicRoute} />
      </Suspense>
    </ErrorBoundary>,
  );
} else {
  root.render(
    <PwaProvider>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </QueryClientProvider>
    </PwaProvider>,
  );
}
