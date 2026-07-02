import React, { useState, useEffect } from "react";
import { LandingPageData, AestheticTheme } from "./types";
import { TEMPLATES } from "./data/templates";
import { AestheticPreview } from "./components/AestheticPreview";
import { ConversionInsightsPanel } from "./components/ConversionInsightsPanel";
import { AdminConsole } from "./components/AdminConsole";
import { 
  Sparkles, 
  Send, 
  Loader2, 
  Settings, 
  Play, 
  Users, 
  Eye, 
  MousePointer, 
  CheckSquare, 
  Flame, 
  Award, 
  Layout, 
  Activity,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Shield
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Page states
  const [activePreset, setActivePreset] = useState<string>("aether");
  const [landingPageData, setLandingPageData] = useState<LandingPageData>(TEMPLATES.aether);
  const [selectedTheme, setSelectedTheme] = useState<AestheticTheme>("obsidian_noir");
  const [activeView, setActiveView] = useState<"showcase" | "heatmap" | "admin">("showcase");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Inputs
  const [productName, setProductName] = useState<string>("");
  const [productHook, setProductHook] = useState<string>("");
  const [targetAudience, setTargetAudience] = useState<string>("");
  const [conversionGoal, setConversionGoal] = useState<string>("Direct SaaS Subscription");

  // Traffic Simulator States
  const [simState, setSimState] = useState<"idle" | "running" | "completed">("idle");
  const [simVisitors, setSimVisitors] = useState<number>(0);
  const [simConversions, setSimConversions] = useState<number>(0);
  const [simClicks, setSimClicks] = useState<number>(0);

  // Sync preset selections with form inputs and themes
  useEffect(() => {
    if (TEMPLATES[activePreset]) {
      setLandingPageData(TEMPLATES[activePreset]);
      // Set appropriate theme defaults for presets
      if (activePreset === "aether") {
        setSelectedTheme("obsidian_noir");
      } else if (activePreset === "prism") {
        setSelectedTheme("emerald_glass");
      } else if (activePreset === "scribe") {
        setSelectedTheme("monochrome_luxury");
      }
    }
  }, [activePreset]);

  // Handle server-side Gemini generation
  const handleGenerateLandingPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      setErrorMessage("Please specify a product name to trigger the optimization engine.");
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/generate-landing-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          hook: productHook,
          targetAudience,
          conversionGoal,
          styleTheme: "light minimalist elegant white and blue"
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Server-side optimization failed");
      }

      const generatedData: LandingPageData = await response.json();
      setLandingPageData(generatedData);
      setActivePreset("custom");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An unexpected error occurred during copy compilation.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Run conversion funnel simulation
  const startSimulation = () => {
    if (simState === "running") return;
    setSimState("running");
    setSimVisitors(0);
    setSimConversions(0);
    setSimClicks(0);

    const targetVisitors = 5000;
    const clickRate = 0.125; // 12.5% interaction rate
    const conversionRate = (landingPageData.conversionInsights.predictedConversionRate || 4.2) / 100;

    const duration = 3000; // 3 seconds total
    const steps = 30;
    const intervalTime = duration / steps;
    let stepCount = 0;

    const interval = setInterval(() => {
      stepCount++;
      const currentProgress = stepCount / steps;
      const currentVisitors = Math.round(targetVisitors * currentProgress);
      
      setSimVisitors(currentVisitors);
      setSimClicks(Math.round(currentVisitors * clickRate));
      setSimConversions(Math.round(currentVisitors * clickRate * conversionRate * 8)); // Scaled up slightly for simulated display excitement

      if (stepCount >= steps) {
        clearInterval(interval);
        setSimState("completed");
      }
    }, intervalTime);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex flex-col lg:flex-row font-sans overflow-x-hidden">
      
      {/* LEFT COLUMN: Controls & Optimization Panels */}
      <aside className="w-full lg:w-[480px] shrink-0 border-r border-slate-200 bg-white flex flex-col h-screen overflow-y-auto p-6 space-y-8 scrollbar-thin shadow-xs">
        
        {/* Elite Brand Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center font-display font-black text-white text-sm shadow-sm">
              A
            </div>
            <div>
              <h1 className="text-xs font-display font-bold tracking-[0.2em] text-slate-900 uppercase">
                AERO SALES OPERATIONS
              </h1>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider font-bold">
                OUTBOUND PORTAL & ARCHITECT • V1.0
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-[9px] text-amber-700 font-mono font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
            ENGINE ACTIVE
          </span>
        </div>

        {/* Section 1: Template Presets Showcase */}
        <div className="space-y-3">
          <h2 className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
            <Layout className="w-3.5 h-3.5 text-slate-400" />
            Authority Preset templates
          </h2>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setActivePreset("aether")}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                activePreset === "aether"
                  ? "bg-amber-50 border-amber-200 text-amber-700 font-bold"
                  : "bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-100/50"
              }`}
            >
              <p className="text-[10px] font-bold font-mono">OUTBOUND</p>
              <span className="text-[8px] text-slate-400 uppercase tracking-widest font-mono">Pipeline</span>
            </button>
            <button
              onClick={() => setActivePreset("prism")}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                activePreset === "prism"
                  ? "bg-amber-50 border-amber-200 text-amber-700 font-bold"
                  : "bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-100/50"
              }`}
            >
              <p className="text-[10px] font-bold font-mono">TALENT</p>
              <span className="text-[8px] text-slate-400 uppercase tracking-widest font-mono">Sourced</span>
            </button>
            <button
              onClick={() => setActivePreset("scribe")}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                activePreset === "scribe"
                  ? "bg-amber-50 border-amber-200 text-amber-700 font-bold"
                  : "bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-100/50"
              }`}
            >
              <p className="text-[10px] font-bold font-mono">REVOPS</p>
              <span className="text-[8px] text-slate-400 uppercase tracking-widest font-mono">GHL Setup</span>
            </button>
          </div>
        </div>

        {/* Section 2: AI Optimization Generator Form */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <h3 className="text-xs font-mono font-bold text-slate-700 flex items-center gap-1.5 uppercase">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Aero Strategy Copilot
            </h3>
            <span className="text-[9px] font-mono text-slate-400">GEMINI POWERED</span>
          </div>

          <form onSubmit={handleGenerateLandingPage} className="space-y-4">
            {/* Input: Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                Product Name
              </label>
              <input
                type="text"
                placeholder="e.g. Vesper DB"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs text-slate-800 p-3 rounded-xl outline-none transition-all"
              />
            </div>

            {/* Input: Hook */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                Core Hook / Description
              </label>
              <textarea
                placeholder="e.g. Ultra-secure multi-region relational database engine designed for enterprise financial ledgers."
                value={productHook}
                onChange={(e) => setProductHook(e.target.value)}
                rows={2}
                className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs text-slate-800 p-3 rounded-xl outline-none transition-all resize-none"
              />
            </div>

            {/* Input: Target Audience */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                Target Audience
              </label>
              <input
                type="text"
                placeholder="e.g. FinTech CTOs & Chief Security Officers"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs text-slate-800 p-3 rounded-xl outline-none transition-all"
              />
            </div>

            {/* Aesthetic Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                Aesthetic UI Vibe
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTheme("obsidian_noir")}
                  className={`py-2 px-3 text-[10px] font-mono rounded-lg border text-left transition-all flex items-center justify-between cursor-pointer ${
                    selectedTheme === "obsidian_noir"
                      ? "border-blue-500 text-blue-700 bg-white font-bold"
                      : "border-slate-200 text-slate-500 bg-white hover:border-slate-300"
                  }`}
                >
                  Cobalt Corporate
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTheme("emerald_glass")}
                  className={`py-2 px-3 text-[10px] font-mono rounded-lg border text-left transition-all flex items-center justify-between cursor-pointer ${
                    selectedTheme === "emerald_glass"
                      ? "border-blue-500 text-blue-700 bg-white font-bold"
                      : "border-slate-200 text-slate-500 bg-white hover:border-slate-300"
                  }`}
                >
                  Indigo Minimal
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTheme("monochrome_luxury")}
                  className={`py-2 px-3 text-[10px] font-mono rounded-lg border text-left transition-all flex items-center justify-between cursor-pointer ${
                    selectedTheme === "monochrome_luxury"
                      ? "border-blue-500 text-blue-700 bg-white font-bold"
                      : "border-slate-200 text-slate-500 bg-white hover:border-slate-300"
                  }`}
                >
                  Classic Slate
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTheme("arctic_frost")}
                  className={`py-2 px-3 text-[10px] font-mono rounded-lg border text-left transition-all flex items-center justify-between cursor-pointer ${
                    selectedTheme === "arctic_frost"
                      ? "border-blue-500 text-blue-700 bg-white font-bold"
                      : "border-slate-200 text-slate-500 bg-white hover:border-slate-300"
                  }`}
                >
                  Stripe Ice
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-150 rounded-xl text-[10.5px] text-red-700 flex gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Trigger Button */}
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-mono font-bold text-xs uppercase flex items-center justify-center gap-1.5 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm transition-all"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  Generating Premium Architecture...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Compile High-Conversion Copy
                </>
              )}
            </button>
          </form>
        </div>

        {/* Section 3: Interactive Traffic Funnel Simulator */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <h3 className="text-xs font-mono font-bold text-slate-700 flex items-center gap-1.5 uppercase">
              <Activity className="w-4 h-4 text-slate-400 animate-pulse" />
              Traffic Funnel Simulator
            </h3>
            <button 
              onClick={startSimulation}
              disabled={simState === "running"}
              className="text-[9px] font-mono text-blue-700 font-bold bg-blue-50 border border-blue-100 px-2 py-1 rounded-lg hover:bg-blue-100 disabled:opacity-40 flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <Play className="w-2.5 h-2.5 fill-blue-600 text-blue-600" /> Run A/B Trial
            </button>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Simulate 5,000 real target visitors hitting this optimized layout to calculate predicted click-throughs and conversions.
          </p>

          <div className="space-y-3 font-mono text-xs">
            {/* Visitors Progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>1. RAW VISITOR FLOW</span>
                <span className="text-slate-700 font-semibold">{simVisitors.toLocaleString()} / 5,000</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full transition-all duration-100" 
                  style={{ width: `${(simVisitors / 5000) * 100}%` }}
                />
              </div>
            </div>

            {/* Interaction / Clicks Progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>2. HERO CTA CLICKS (12.5% CTR)</span>
                <span className="text-slate-700 font-semibold">{simClicks.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full transition-all duration-100" 
                  style={{ width: `${(simVisitors / 5000) * 100}%` }}
                />
              </div>
            </div>

            {/* Conversions / Checkout */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>3. SUCCESSFUL CHECKOUTS</span>
                <span className="text-blue-600 font-bold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-blue-600" />
                  {simConversions.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-700 h-full transition-all duration-100" 
                  style={{ width: `${(simVisitors / 5000) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Deep Insight Metrics Panel */}
        <ConversionInsightsPanel 
          insights={landingPageData.conversionInsights} 
          productName={landingPageData.productName} 
        />

      </aside>

      {/* RIGHT COLUMN: Interactive Live Showcase Device Frame */}
      <main className="flex-1 bg-[#F8FAFC] flex flex-col h-screen overflow-hidden p-6 lg:p-8">
        
        {/* Device HUD Bar */}
        <div className="flex justify-between items-center mb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            {/* View switcher buttons */}
            <button
              onClick={() => setActiveView("showcase")}
              className={`text-xs font-mono font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                activeView === "showcase" 
                  ? "bg-white text-blue-700 border border-blue-200" 
                  : "text-slate-500 hover:text-slate-800 bg-transparent border border-transparent"
              }`}
            >
              <Eye className="w-4 h-4 text-blue-600" /> Interactive Showcase
            </button>
            
            <button
              onClick={() => setActiveView("heatmap")}
              className={`text-xs font-mono font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                activeView === "heatmap" 
                  ? "bg-red-50 border border-red-200 text-red-700" 
                  : "text-slate-500 hover:text-slate-800 bg-transparent border border-transparent"
              }`}
            >
              <Flame className="w-4 h-4 text-red-500" /> Eye-Tracking Heatmap
            </button>

            <button
              onClick={() => setActiveView("admin")}
              className={`text-xs font-mono font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 relative cursor-pointer shadow-xs ${
                activeView === "admin" 
                  ? "bg-blue-50 border border-blue-200 text-blue-700" 
                  : "text-slate-500 hover:text-slate-800 bg-transparent border border-transparent"
              }`}
            >
              <Shield className="w-4 h-4 text-blue-600 animate-pulse" /> Admin Console
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-blue-600 border border-white" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-[10.5px] font-mono text-slate-500">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            Active Theme: <span className="text-slate-700 font-bold uppercase">{selectedTheme.replace("_", " ")}</span>
          </div>
        </div>

        {/* Display Wrapper */}
        <div className="flex-1 w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-y-auto overflow-x-hidden relative scrollbar-thin">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView === "admin" ? "admin-view" : `${activePreset}-${selectedTheme}-${activeView}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="min-h-full"
            >
              {activeView === "admin" ? (
                <AdminConsole />
              ) : (
                <AestheticPreview 
                  data={landingPageData} 
                  theme={selectedTheme} 
                  isHeatmapVisible={activeView === "heatmap"} 
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </main>

    </div>
  );
}
