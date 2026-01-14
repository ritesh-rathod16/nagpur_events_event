"use client";

import { useEffect } from "react";

export default function UnhandledRejectionNormalizer() {
  useEffect(() => {
    function handler(ev: PromiseRejectionEvent) {
      try {
        const reason = ev.reason;
        if (!reason) return;

        if (reason instanceof Event) {
          // Prevent the raw Event from being treated as the rejection reason by
          // the framework (which stringifies it to "[object Event]"). Instead,
          // replace it with a descriptive Error and re-throw asynchronously so
          // dev-overlay and any other listeners see a helpful message.
          ev.preventDefault();
          const targetTag = (reason as any).target?.tagName;
          const msg = `Unhandled promise rejection: Event(${reason.type})${targetTag ? ` on ${targetTag}` : ""}`;
          const err = new Error(msg);
          // Rethrow asynchronously to surface as an unhandled error
          setTimeout(() => {
            throw err;
          }, 0);
        } else if (typeof reason === "object" && !(reason instanceof Error)) {
          // Non-Error objects can be hard to read; convert to a stringified form.
          ev.preventDefault();
          let info = "";
          try {
            info = JSON.stringify(reason);
          } catch (e) {
            info = String(reason);
          }
          const err = new Error(`Unhandled promise rejection: ${info}`);
          setTimeout(() => {
            throw err;
          }, 0);
        }
      } catch (e) {
        // Ignore any errors in the normalizer itself to avoid recursion
        // and allow the original handlers to run.
      }
    }

    window.addEventListener("unhandledrejection", handler, true);
    return () => window.removeEventListener("unhandledrejection", handler, true);
  }, []);

  return null;
}
