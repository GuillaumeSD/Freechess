import * as Sentry from "@sentry/nextjs";

if (
  process.env.NEXT_PUBLIC_SENTRY_DSN &&
  document.location.hostname !== "localhost"
) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: "production",
    integrations: [
      Sentry.replayIntegration({
        maskAllText: false,
        maskAllInputs: false,
        blockAllMedia: false,
      }),
    ],
    tracesSampleRate: 1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    debug: false,
    initialScope: {
      extra: {
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory:
          "deviceMemory" in navigator &&
          typeof navigator.deviceMemory === "number"
            ? navigator.deviceMemory
            : "unknown",
      },
    },
    ignoreErrors: [
      "AbortError: The user aborted a request.",
      "Failed to fetch",
      "Fetch is aborted",
    ],
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
