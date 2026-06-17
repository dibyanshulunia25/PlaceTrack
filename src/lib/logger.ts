type LogContext = Record<string, any>;

export const Logger = {
  error: (error: Error | string, context?: LogContext) => {
    console.error("[ERROR]", error, context ? JSON.stringify(context) : "");
  },

  warning: (message: string, context?: LogContext) => {
    console.warn("[WARN]", message, context ? JSON.stringify(context) : "");
  },

  info: (message: string, context?: LogContext) => {
    console.info("[INFO]", message, context ? JSON.stringify(context) : "");
  },
};
