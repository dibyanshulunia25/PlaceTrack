import * as Sentry from "@sentry/nextjs";

type LogContext = Record<string, any>;

export const Logger = {
  error: (error: Error | string, context?: LogContext) => {
    console.error("[ERROR]", error, context ? JSON.stringify(context) : "");
    
    if (typeof error === "string") {
      Sentry.captureMessage(error, {
        level: "error",
        extra: context,
      });
    } else {
      Sentry.captureException(error, {
        extra: context,
      });
    }
  },

  warning: (message: string, context?: LogContext) => {
    console.warn("[WARN]", message, context ? JSON.stringify(context) : "");
    Sentry.captureMessage(message, {
      level: "warning",
      extra: context,
    });
  },

  info: (message: string, context?: LogContext) => {
    console.info("[INFO]", message, context ? JSON.stringify(context) : "");
    Sentry.captureMessage(message, {
      level: "info",
      extra: context,
    });
  },
};
