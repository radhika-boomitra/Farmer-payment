import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";
import confetti from "canvas-confetti";
import { getLastTransfer, saveLastTransfer, PROJECT_INFO } from "../../lib/offlineCache";

// Image imports
import imgBoomitraLogoPrimaryFullColor1 from "figma:asset/07c85663dba665e32cd122ea42197f4e31feb242.png";
import imgRotatingFarmers from "figma:asset/771f9a74273d624ff94d1bd092063722673382a8.png";
import imgRotatingFarmers1 from "figma:asset/211dbde7688c82c975da4b91838239ee80beb969.png";
import imgRotatingFarmers2 from "figma:asset/05714d44caa32a7c39faeff450b3a259fa5dda40.png";
import imgRectangle35 from "figma:asset/4866fd6d929190c879e75fe28dc8ccd64a0262dd.png";
import imgRavi from "../../imports/Ravi.jpg";
import imgSubikshaLogo from "../../imports/Subiksha_Logo.png";
import imgAnnapoorna from "../../imports/image.png";

const svgPaths = {
  // Loading animation paths
  p13f3c500: "M17 5V2C17 1.73478 16.8946 1.48043 16.7071 1.29289C16.5196 1.10536 16.2652 1 16 1H3C2.46957 1 1.96086 1.21071 1.58579 1.58579C1.21071 1.96086 1 2.46957 1 3C1 3.53043 1.21071 4.03914 1.58579 4.41421C1.96086 4.78929 2.46957 5 3 5H18C18.2652 5 18.5196 5.10536 18.7071 5.29289C18.8946 5.48043 19 5.73478 19 6V10M19 10H16C15.4696 10 14.9609 10.2107 14.5858 10.5858C14.2107 10.9609 14 11.4696 14 12C14 12.5304 14.2107 13.0391 14.5858 13.4142C14.9609 13.7893 15.4696 14 16 14H19C19.2652 14 19.5196 13.8946 19.7071 13.7071C19.8946 13.5196 20 13.2652 20 13V11C20 10.7348 19.8946 10.4804 19.7071 10.2929C19.5196 10.1054 19.2652 10 19 10Z",
  p15cf0c00: "M1 1V15C1 15.5304 1.21071 16.0391 1.58579 16.4142C1.96086 16.7893 2.46957 17 3 17H18C18.2652 17 18.5196 16.8946 18.7071 16.7071C18.8946 16.5196 19 16.2652 19 16V12",
  p16f03e0: "M0.6762 0.6762L6.42389 6.08579",
  p29651140: "M2.98798 29.8798C2.98798 22.7477 5.82122 15.9076 10.8644 10.8644C15.9076 5.82122 22.7477 2.98798 29.8798 2.98798C37.3977 3.01626 44.6136 5.94974 50.0188 11.175L56.7716 17.9279",
  p2d257580: "M8.63531 0.71961H3.23824C2.57026 0.71961 1.92964 0.984965 1.4573 1.4573C0.984965 1.92964 0.71961 2.57026 0.71961 3.23824C0.71961 3.90623 0.984965 4.54685 1.4573 5.01919C1.92964 5.49152 2.57026 5.75688 3.23824 5.75688H6.83629C7.50427 5.75688 8.1449 6.02223 8.61723 6.49457C9.08957 6.9669 9.35492 7.60753 9.35492 8.27551C9.35492 8.94349 9.08957 9.58412 8.61723 10.0565C8.1449 10.5288 7.50427 10.7941 6.83629 10.7941H0.71961",
  p31fe3a20: "M20 3.33333L33.3333 11.6667H6.66667L20 3.33333Z",
  p39eb9980: "M0.676198 7.43818C5.18441 7.43818 5.18441 0.676198 0.676198 0.676198",
  
  // Confirmed screen paths
  p19a01780: "M20 36.6667C29.2047 36.6667 36.6667 29.2047 36.6667 20C36.6667 10.7953 29.2047 3.33333 20 3.33333C10.7953 3.33333 3.33333 10.7953 3.33333 20C3.33333 29.2047 10.7953 36.6667 20 36.6667Z",
  p238d1500: "M23.25 31L28.4167 36.1667L38.75 25.8333",
  p24016580: "M31 56.8333C45.2674 56.8333 56.8333 45.2674 56.8333 31C56.8333 16.7326 45.2674 5.16667 31 5.16667C16.7326 5.16667 5.16667 16.7326 5.16667 31C5.16667 45.2674 16.7326 56.8333 31 56.8333Z",
  p24376300: "M15 20L18.3333 23.3333L25 16.6667",
};

function RemoveWhiteBg({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = data.data;
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];
        if (r > 220 && g > 220 && b > 220) d[i + 3] = 0;
      }
      ctx.putImageData(data, 0, 0);
    };
    img.src = src;
  }, [src]);
  return <canvas ref={canvasRef} aria-label={alt} className={className} />;
}

export function Navbar() {
  return (
    <nav className="sticky top-0 z-40 w-full bg-[#fefefb]/80 backdrop-blur-md border-b border-gray-100 px-6 lg:px-20 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="h-[26px] w-auto">
          <img
            src={imgBoomitraLogoPrimaryFullColor1}
            alt="Boomitra Logo"
            className="h-full object-contain"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-[120px] w-auto">
            <RemoveWhiteBg
              src={imgAnnapoorna}
              alt="Sri Sathya Sai Annapoorna Logo"
              className="h-full object-contain"
            />
          </div>
          <div className="h-[81px] w-auto">
            <img
              src={imgSubikshaLogo}
              alt="Subiksha Logo"
              className="h-full object-contain"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

function DollarIcon() {
  return (
    <div className="h-[17.271px] overflow-clip relative shrink-0 w-full">
      <div className="absolute bottom-[8.33%] left-1/2 right-1/2 top-[8.33%]">
        <div className="absolute inset-[-5%_-0.72px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.43922 15.8314">
            <path d="M0.71961 0.71961V15.1118" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.43922" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[20.83%] left-1/4 right-1/4 top-[20.83%]">
        <div className="absolute inset-[-7.14%_-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.0745 11.5138">
            <path d={svgPaths.p2d257580} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.43922" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function RupeeIcon() {
  return (
    <div className="h-[16.229px] overflow-clip relative shrink-0 w-full">
      <div className="absolute bottom-[87.5%] left-1/4 right-1/4 top-[12.5%]">
        <div className="absolute inset-[-0.68px_-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.46678 1.3524">
            <path d="M0.676198 0.676198H8.79058" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3524" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[66.67%] left-1/4 right-1/4 top-[33.33%]">
        <div className="absolute inset-[-0.68px_-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.46678 1.3524">
            <path d="M0.676198 0.676198H8.79058" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3524" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[12.5%] left-1/4 right-[39.58%] top-[54.17%]">
        <div className="absolute inset-[-12.5%_-11.76%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.10009 6.76199">
            <path d={svgPaths.p16f03e0} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3524" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[45.83%] left-1/4 right-[62.5%] top-[54.17%]">
        <div className="absolute inset-[-0.68px_-33.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.38099 1.3524">
            <path d="M0.676198 0.676198H2.70479" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3524" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_41.67%_45.83%_37.5%]">
        <div className="absolute inset-[-10%_-20%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.73356 8.11438">
            <path d={svgPaths.p39eb9980} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3524" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function CurrencyParticle({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ 
        x: 300, 
        opacity: [0, 1, 1, 0],
        backgroundColor: ["#facc15", "#facc15", "#10b981", "#10b981"]
      }}
      transition={{ 
        duration: 3, 
        repeat: Infinity, 
        delay: delay,
        ease: "linear",
        backgroundColor: {
          times: [0, 0.4, 0.6, 1],
          duration: 3,
          repeat: Infinity,
          delay: delay,
          ease: "linear"
        }
      }}
      className="absolute overflow-hidden rounded-full shadow-sm flex items-center justify-center size-[34px] border border-white/20"
    >
      <div className="size-[18px] relative flex items-center justify-center">
        <motion.div
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ 
            times: [0, 0.45, 0.55, 1],
            duration: 3, 
            repeat: Infinity, 
            delay: delay,
            ease: "linear" 
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <DollarIcon />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 1, 1] }}
          transition={{ 
            times: [0, 0.45, 0.55, 1],
            duration: 3, 
            repeat: Infinity, 
            delay: delay,
            ease: "linear" 
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <RupeeIcon />
        </motion.div>
      </div>
    </motion.div>
  );
}

function HighFidelityLoadingAnimation() {
  return (
    <div className="relative w-[840px] h-[256px] bg-white rounded-[24px] shadow-sm border border-[#f5f5f5] overflow-hidden">
      {/* Source Box */}
      <div className="absolute left-[32px] top-[32px] w-[180px] h-[192px] bg-white rounded-[24px] border-2 border-[#e5e5e5] shadow-sm flex flex-col items-center justify-center gap-4">
        <div className="bg-[#fafafa] w-[96px] h-[93.5px] rounded-[16px] border border-[#f5f5f5] flex items-center justify-center relative">
          <div className="w-[40px] h-[40px] relative">
            <svg className="size-full" fill="none" viewBox="0 0 40 40">
              <path d="M5 36.6667H35" stroke="#525252" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
              <path d="M10 30V18.3333" stroke="#525252" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
              <path d="M16.6667 30V18.3333" stroke="#525252" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
              <path d="M23.3333 30V18.3333" stroke="#525252" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
              <path d="M30 30V18.3333" stroke="#525252" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
              <path d={svgPaths.p31fe3a20} stroke="#525252" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
            </svg>
          </div>
        </div>
        <div className="text-center px-4">
          <p className="text-[#a1a1a1] text-[10px] font-bold uppercase tracking-widest">Source</p>
          <p className="text-[#262626] text-[12px] font-bold uppercase mt-1">Global Account (USD)</p>
        </div>
      </div>

      {/* Destination Box */}
      <div className="absolute left-[628px] top-[32px] w-[180px] h-[192px] bg-white rounded-[24px] border-2 border-[#e5e5e5] shadow-sm flex flex-col items-center justify-center gap-4">
        <div className="bg-[#fafafa] w-[96px] h-[93.5px] rounded-[16px] border border-[#f5f5f5] flex items-center justify-center relative">
          <div className="relative w-20 h-20 flex items-center justify-center">
             <div className="w-10 h-10 bg-white rounded-full shadow-md border border-[#f5f5f5] flex items-center justify-center relative z-10 p-2">
                <svg className="size-full" fill="none" viewBox="0 0 24 24">
                  <path d={svgPaths.p13f3c500} stroke="#009966" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  <path d={svgPaths.p15cf0c00} stroke="#009966" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
             </div>
          </div>
        </div>
        <div className="text-center px-4">
          <p className="text-[#a1a1a1] text-[10px] font-bold uppercase tracking-widest">Destination</p>
          <p className="text-[#262626] text-[12px] font-bold uppercase mt-1 whitespace-nowrap">Farmer Wallet (INR)</p>
        </div>
      </div>

      {/* Middle Animation Area */}
      <div className="absolute left-[212px] top-[124px] w-[416px] h-[8px] flex items-center justify-center">
        <div className="relative w-full h-1 bg-[#fafafa] rounded-full border border-[#f5f5f5]">
           <CurrencyParticle delay={0} />
           <CurrencyParticle delay={1} />
           <CurrencyParticle delay={2} />
        </div>
      </div>
    </div>
  );
}

function TickAnimationPhase({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    // Burst confetti from the center where the tick appears
    const end = Date.now() + 1000;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0.5, y: 0.4 },
        colors: ['#00A63E', '#87c45f', '#efffde']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 0.5, y: 0.4 },
        colors: ['#00A63E', '#87c45f', '#efffde']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    
    frame();

    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center"
    >
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 12, stiffness: 200 }}
        className="bg-[#efffde] w-48 h-48 rounded-full flex items-center justify-center shadow-xl mb-8"
      >
        <svg className="w-24 h-24" viewBox="0 0 62 62" fill="none">
          <motion.path 
            d={svgPaths.p24016580} 
            stroke="#00A63E" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="3.33333"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          <motion.path 
            d={svgPaths.p238d1500} 
            stroke="#00A63E" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="3.33333"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="text-[#00A63E] text-2xl font-bold font-['Figtree',sans-serif]"
      >
        Transfer Successful
      </motion.p>
    </motion.div>
  );
}

function PaymentLoadingScreen({ status, onClose }: { status: 'loading' | 'success', onClose: () => void }) {
  const [dots, setDots] = useState("");
  const [showTick, setShowTick] = useState(false);
  const [showFinalScreen, setShowFinalScreen] = useState(false);

  useEffect(() => {
    if (status === 'loading') {
      const interval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? "" : prev + ".");
      }, 500);
      return () => clearInterval(interval);
    } else if (status === 'success') {
      setShowTick(true);
    }
  }, [status]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-[#fefefb]"
    >
      <Navbar />

      <div className="flex-1 flex flex-col items-center relative overflow-y-auto">
        <AnimatePresence mode="wait">
          {!status || status === 'loading' ? (
            <motion.div
              key="loading-ui"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center gap-20"
            >
              <HighFidelityLoadingAnimation />
              <div className="flex flex-col items-center space-y-4">
                <h2 className="text-[#1d1d1f] text-3xl font-bold font-['Figtree',sans-serif]">
                  {`Processing Payment${dots}`}
                </h2>
              </div>
            </motion.div>
          ) : showTick && !showFinalScreen ? (
            <div className="flex-1 flex items-center justify-center">
              <TickAnimationPhase key="tick-phase" onComplete={() => setShowFinalScreen(true)} />
            </div>
          ) : (
            <motion.div 
              key="success-ui"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-[1200px] flex flex-col items-center text-center px-6 pt-16 pb-16 space-y-12"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-3">
                    <h1 className="text-[#1d1d1f]/80 text-4xl font-bold font-['Figtree',sans-serif] leading-tight">
                      Payment has been transferred to the farmers
                    </h1>
                    <div className="bg-[#efffde] w-10 h-10 rounded-full flex items-center justify-center shadow-sm shrink-0">
                      <Check className="w-5 h-5 text-[#00A63E] stroke-[4]" />
                    </div>
                  </div>
                  <p className="text-[#1d1d1f] text-xl font-['Inter',sans-serif] leading-relaxed max-w-4xl mx-auto">
                    Funds have been successfully credited to eligible farmers through direct bank transfer
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl px-4">
                {[imgRotatingFarmers2, imgRotatingFarmers, imgRotatingFarmers1, imgRectangle35].map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className="aspect-[252/321] rounded-[20px] overflow-hidden shadow-lg border-2 border-white"
                  >
                    <img src={img} className="w-full h-full object-cover" alt={`Farmer beneficiary ${i + 1}`} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function Hero() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'loading' | 'success'>('loading');
  const [lastTransfer, setLastTransfer] = useState(() => getLastTransfer());
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  const handleTransfer = async () => {
    setIsProcessing(true);
    setStatus('loading');

    const payload = {
      action: 'transfer_payment',
      project: PROJECT_INFO.name,
      timestamp: new Date().toISOString(),
      farmer_count: PROJECT_INFO.farmerCount,
    };

    try {
      let synced = false;

      if (navigator.onLine) {
        // Attempt webhook notification with a short timeout so offline/slow
        // networks never block the local transfer UX.
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        try {
          await fetch('https://workflow.boomitra.com/webhook/709e9400-0911-4a55-b195-d0f5503d9b21', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: controller.signal,
          });
          synced = true;
        } catch (err) {
          // Webhook is optional - log but don't fail the flow
          console.log('Webhook notification attempted:', err instanceof Error ? err.message : err);
        } finally {
          clearTimeout(timeoutId);
        }
      } else {
        console.log('Offline: webhook deferred; using local cache');
        toast.message('Offline Mode — transfer recorded locally');
      }

      // Wait for animation timing
      await new Promise(resolve => setTimeout(resolve, 5000));

      const cached = { ...payload, status: 'success' as const, synced };
      saveLastTransfer(cached);
      setLastTransfer(cached);

      setStatus('success');
      toast.success(
        synced
          ? 'Transfer completed successfully'
          : 'Transfer completed (saved offline — will sync when online)'
      );

    } catch (error) {
      console.error('Transfer error:', error);
      toast.error('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isProcessing && (
          <PaymentLoadingScreen 
            status={status} 
            onClose={() => setIsProcessing(false)} 
          />
        )}
      </AnimatePresence>

      <section className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center px-6 lg:px-20 py-12 overflow-hidden">
        <div className="max-w-7xl w-full flex flex-col lg:flex-row items-stretch justify-center gap-12 lg:gap-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex flex-col justify-between text-left py-4"
          >
            <div className="space-y-6">
              <div className="space-y-3">
                <h1 className="font-['Figtree',sans-serif] font-bold text-3xl lg:text-5xl text-[#004752] leading-tight">
                  {PROJECT_INFO.title}
                </h1>
                <h2 className="font-['Figtree',sans-serif] font-bold text-xl lg:text-2xl text-[#004752] leading-snug">
                  {PROJECT_INFO.subtitle}
                </h2>
                <p className="font-['Inter',sans-serif] text-base lg:text-lg text-[#1d1d1f] leading-relaxed" style={{fontStyle: "italic"}}>
                  {PROJECT_INFO.tagline}
                </p>
                {!isOnline && lastTransfer?.status === 'success' && (
                  <p className="font-['Inter',sans-serif] text-sm text-[#525252]">
                    Last transfer (cached): {new Date(lastTransfer.timestamp).toLocaleString()}
                  </p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isProcessing}
                onClick={handleTransfer}
                className="bg-[#87c45f] hover:bg-[#76b34f] text-[#fefefb] font-bold py-4 px-12 rounded-full text-xl transition-all shadow-lg shadow-[#87c45f]/20 disabled:opacity-50 w-fit min-w-[280px]"
              >
                Transfer payment
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 w-full max-w-[500px] flex flex-col"
          >
            <div className="relative flex-1 w-full rounded-[40px] overflow-hidden shadow-2xl bg-[#e5e7eb] min-h-[500px] lg:min-h-[600px]">
              <img
                src={imgRavi}
                alt="Project Feature"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
