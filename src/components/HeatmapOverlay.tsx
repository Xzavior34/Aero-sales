import { useState } from "react";
import { Eye, Flame, Info, Percent, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HeatmapOverlayProps {
  isVisible: boolean;
}

interface Hotspot {
  id: string;
  top: string;
  left: string;
  width: string;
  height: string;
  intensity: "high" | "medium" | "low";
  gazePercentage: number;
  label: string;
  explanation: string;
  croRule: string;
}

export function HeatmapOverlay({ isVisible }: HeatmapOverlayProps) {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  if (!isVisible) return null;

  const hotspots: Hotspot[] = [
    {
      id: "hero-text",
      top: "14%",
      left: "15%",
      width: "70%",
      height: "12%",
      intensity: "high",
      gazePercentage: 98,
      label: "Hero Copy Focal Point",
      explanation: "Users read this text in the first 2.1 seconds of entry. Personalization and clear framing must be resolved above-the-fold.",
      croRule: "Hero headlines must answer: 'What is this?', 'Who is this for?', and 'What can I achieve in 15 seconds?' without forcing a scroll."
    },
    {
      id: "hero-cta",
      top: "27%",
      left: "30%",
      width: "40%",
      height: "6%",
      intensity: "high",
      gazePercentage: 91,
      label: "Primary Conversion Callout",
      explanation: "A high-contrast CTA placed above-the-fold yields up to an 87% gaze index, especially when isolated by ample margin white space.",
      croRule: "Use micro-copy below the CTA (e.g., 'Zero setup fees' or 'No card required') to mitigate last-mile buyer anxiety."
    },
    {
      id: "trust-logos",
      top: "40%",
      left: "10%",
      width: "80%",
      height: "8%",
      intensity: "medium",
      gazePercentage: 74,
      label: "Authority Anchor (Logos)",
      explanation: "Brand logo bars build rapid instant trust. The eye sweeps across logos immediately after assessing the hero value proposition.",
      croRule: "Keep trust logos high contrast but low color saturation to retain luxury aesthetic while anchoring institutional authority."
    },
    {
      id: "calculator",
      top: "58%",
      left: "20%",
      width: "60%",
      height: "16%",
      intensity: "medium",
      gazePercentage: 81,
      label: "Value Demonstration Engine",
      explanation: "Interactive elements increase active user scroll dwell time by an average of 42 seconds, which dramatically drops initial bounce rates.",
      croRule: "By letting users compute their own personalized cost-versus-return calculations, they convert theoretical value into hard proof."
    },
    {
      id: "testimonial",
      top: "76%",
      left: "15%",
      width: "70%",
      height: "10%",
      intensity: "medium",
      gazePercentage: 68,
      label: "Social Proof Affirmation",
      explanation: "High-ticket purchases are heavily validated via peers. Highlighting specific corporate logos and title metrics drives conversions.",
      croRule: "Always bold the highest-impact sentence of the quote. Busy visitors skim testimonials and will only digest the bold text."
    },
    {
      id: "bottom-cta",
      top: "88%",
      left: "25%",
      width: "50%",
      height: "8%",
      intensity: "high",
      gazePercentage: 89,
      label: "Final Transaction Gateway",
      explanation: "After addressing objections in the FAQ, the bottom CTA catches warm buyers who have fully scrolled the page value metrics.",
      croRule: "The copy here should be decisive and state exactly what the immediate benefit of clicking the button is (e.g., 'Deploy Free Cluster')."
    }
  ];

  const getIntensityStyles = (intensity: Hotspot["intensity"]) => {
    switch (intensity) {
      case "high":
        return "bg-red-500/20 border-red-500/60 shadow-[0_0_30px_rgba(239,68,68,0.4)] animate-pulse";
      case "medium":
        return "bg-amber-500/15 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.3)]";
      case "low":
        return "bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]";
    }
  };

  return (
    <div className="absolute inset-0 z-40 bg-slate-950/70 backdrop-blur-[1px] pointer-events-auto rounded-3xl overflow-hidden font-sans">
      {/* HUD Header */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-50 glassmorphic p-3 rounded-xl">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-red-500 animate-pulse" />
          <span className="text-xs font-mono font-medium text-slate-100 tracking-wider">
            AB/GAZE INTERACTIVE OPTIMIZATION HUD
          </span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> High Attention (90%+)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Medium (60%+)
          </div>
        </div>
      </div>

      {/* Hotspots Container */}
      <div className="absolute inset-0 pt-16 pb-4">
        {hotspots.map((spot) => (
          <button
            key={spot.id}
            onClick={() => setSelectedHotspot(spot)}
            style={{
              top: spot.top,
              left: spot.left,
              width: spot.width,
              height: spot.height,
            }}
            className={`absolute rounded-xl border flex flex-col justify-center items-center group cursor-pointer transition-all duration-300 ${getIntensityStyles(
              spot.intensity
            )}`}
          >
            {/* Visual Center Indicator */}
            <div className={`w-3 h-3 rounded-full flex items-center justify-center transition-all group-hover:scale-125 ${
              spot.intensity === "high" ? "bg-red-500" : "bg-amber-500"
            }`}>
              <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-inherit opacity-75"></span>
            </div>
            
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 text-slate-100 text-[10px] px-2 py-0.5 rounded-md mt-2 font-mono border border-slate-700">
              {spot.gazePercentage}% Gaze
            </span>
          </button>
        ))}
      </div>

      {/* Sidebar Detail Card */}
      <AnimatePresence>
        {selectedHotspot ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-4 top-20 bottom-4 w-80 glassmorphic p-5 rounded-xl z-50 flex flex-col justify-between border-l border-white/10"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                  HOTSPOT INSIGHT
                </span>
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="text-xs font-mono text-slate-400 hover:text-slate-100 px-2 py-1 bg-slate-900 rounded"
                >
                  Close
                </button>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-semibold text-slate-100">{selectedHotspot.label}</h4>
              </div>

              <div className="flex items-center gap-1.5 mb-4">
                <Percent className="w-3.5 h-3.5 text-red-400" />
                <span className="text-xl font-mono font-bold text-red-400">{selectedHotspot.gazePercentage}%</span>
                <span className="text-xs text-slate-400 font-mono">Attention Index</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {selectedHotspot.explanation}
              </p>

              <div className="p-3 bg-emerald-950/20 rounded-lg border border-emerald-500/20">
                <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-mono font-bold mb-1 uppercase">
                  <Sparkles className="w-3 h-3" />
                  PRO CRO RULE
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {selectedHotspot.croRule}
                </p>
              </div>
            </div>

            <div className="text-[9px] text-slate-500 font-mono flex items-center gap-1.5">
              <Info className="w-3 h-3" /> Click other hot zones to inspect copy architecture rules.
            </div>
          </motion.div>
        ) : (
          <div className="absolute right-4 bottom-4 glassmorphic px-4 py-3 rounded-lg z-50 text-[11px] text-slate-300 pointer-events-none flex items-center gap-2 max-w-[280px]">
            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Click any high-attention hotspot overlay to view copywriting rules & conversion strategy.</span>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
