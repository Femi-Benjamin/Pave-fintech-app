/**
 * Error monitoring (Sentry). Does nothing unless VITE_SENTRY_DSN is set, and the
 * SDK is loaded on demand so it never slows down the first page load.
 */
export function initMonitoring(): void {
  const dsn = import.meta.env?.VITE_SENTRY_DSN as string | undefined;
  if (!dsn) return;

  import("@sentry/react")
    .then((Sentry) => {
      Sentry.init({
        dsn,
        environment: import.meta.env.MODE,
        tracesSampleRate: 0,
        beforeSend(event) {
          // Never send credentials or request bodies to the monitoring service.
          if (event.request) {
            delete event.request.cookies;
            delete event.request.headers;
            delete event.request.data;
          }
          return event;
        },
      });
    })
    .catch(() => {
      /* monitoring must never break the app */
    });
}
