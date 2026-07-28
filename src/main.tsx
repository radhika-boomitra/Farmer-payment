import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./app/App.tsx";
import "./styles/index.css";

registerSW({
  immediate: true,
  onRegisteredSW(swUrl, registration) {
    if (registration) {
      // Check for updates periodically while the tab is open
      setInterval(() => {
        registration.update().catch(() => {
          // Offline — ignore update failures
        });
      }, 60 * 60 * 1000);
    }
    console.log("[PWA] Service worker registered:", swUrl);
  },
  onOfflineReady() {
    console.log("[PWA] App ready to work offline");
  },
});

createRoot(document.getElementById("root")!).render(<App />);
