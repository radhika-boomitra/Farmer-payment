import { Navbar, Hero } from "./components/UrvaraProject";
import { OfflineStatusIndicator } from "./components/OfflineStatusIndicator";
import { Toaster } from "sonner";

export default function App() {
  return (
    <div className="min-h-screen bg-[#fefefb] font-['Inter',sans-serif]">
      <Toaster position="bottom-center" expand={true} richColors />
      <Navbar />
      <main>
        <Hero />
      </main>
      
      <footer className="px-6 lg:px-20 py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-sm">© 2026 Boomitra. All rights reserved.</p>
        </div>
      </footer>
      <OfflineStatusIndicator />
    </div>
  );
}
