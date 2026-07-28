import { useEffect, useState } from "react";

/**
 * Small connection-status badge. Does not alter page layout —
 * fixed overlay in the corner.
 */
export function OfflineStatusIndicator() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const sync = () => setIsOnline(navigator.onLine);

    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    document.addEventListener("visibilitychange", sync);
    // Catch cases where connectivity changes without a reliable event
    const intervalId = window.setInterval(sync, 2000);

    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
      document.removeEventListener("visibilitychange", sync);
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-[60] flex items-center gap-2 rounded-full border border-gray-200 bg-[#fefefb]/95 px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-sm"
    >
      <span
        className={`inline-block size-2 shrink-0 rounded-full ${
          isOnline ? "bg-emerald-500" : "bg-amber-600"
        }`}
        aria-hidden="true"
      />
      <span className={isOnline ? "text-[#004752]" : "text-amber-800"}>
        {isOnline ? "Connected" : "Offline Mode"}
      </span>
    </div>
  );
}
