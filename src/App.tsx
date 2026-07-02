import React, { useState, useEffect } from "react";
import { LandingPageData, AestheticTheme } from "./types";
import { TEMPLATES } from "./data/templates";
import { AestheticPreview } from "./components/AestheticPreview";
import { ConversionInsightsPanel } from "./components/ConversionInsightsPanel";
import { AdminConsole } from "./components/AdminConsole";
import { Homepage } from "./components/Homepage";
import { PoliciesPage } from "./components/PoliciesPage";
import { PilotRolesBoard } from "./components/PilotRolesBoard";
import { ConversionCalculator } from "./components/ConversionCalculator";
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
  Shield,
  Menu,
  X as CloseIcon,
  ShieldCheck,
  Calculator,
  Briefcase,
  Layers
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<"home" | "roster" | "audit" | "sandbox" | "admin" | "policies">(() => {
    const path = window.location.pathname.replace(/^\/|\/$/g, "");
    if (path === "admin") return "admin";
    if (path === "roster") return "roster";
    if (path === "audit") return "audit";
    if (path === "sandbox") return "sandbox";
    if (path === "policies") return "policies";
    return "home";
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Synchronize browser back/forward buttons with active state
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\/|\/$/g, "");
      if (path === "admin") setCurrentPage("admin");
      else if (path === "roster") setCurrentPage("roster");
      else if (path === "audit") setCurrentPage("audit");
      else if (path === "sandbox") setCurrentPage("sandbox");
      else if (path === "policies") setCurrentPage("policies");
      else setCurrentPage("home");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Automatically close mobile navigation menu when a user clicks an external link or performs smooth scroll navigation
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // 1. Check if clicked element is an external link or has an anchor link that triggers smooth scroll
      const anchor = target.closest("a");
      if (anchor) {
        const href = anchor.getAttribute("href") || "";
        const isExternal = href.startsWith("http") || href.startsWith("https") || anchor.target === "_blank";
        const isSmoothScroll = href.startsWith("#") || anchor.classList.contains("smooth-scroll");
        
        if (isExternal || isSmoothScroll) {
          setMobileMenuOpen(false);
          return;
        }
      }

      // 2. Check if clicked element is a button or other element triggering smooth scroll or navigation action
      const button = target.closest("button");
      if (button) {
        const onClickText = button.outerHTML || "";
        const triggersScroll = onClickText.includes("scrollTo") || onClickText.includes("scrollIntoView") || button.classList.contains("smooth-scroll");
        if (triggersScroll) {
          setMobileMenuOpen(false);
        }
      }
    };

    // 3. Listen to scroll events on window to detect smooth scroll navigation or manual scrolling
    let initialScrollY = window.scrollY;
    const handleGlobalScroll = () => {
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - initialScrollY) > 8) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleGlobalClick, { capture: true });
    window.addEventListener("scroll", handleGlobalScroll, { passive: true });

    return () => {
      document.removeEventListener("click", handleGlobalClick, { capture: true });
      window.removeEventListener("scroll", handleGlobalScroll);
    };
  }, [mobileMenuOpen]);

  // Playground / Sandbox states
  const [activePreset, setActivePreset] = useState<string>("aether");
  const [landingPageData, setLandingPageData] = useState<LandingPageData>(TEMPLATES.aether);
  const [selectedTheme, setSelectedTheme] = useState<AestheticTheme>("obsidian_noir");
  const [activeView, setActiveView] = useState<"showcase" | "heatmap">("showcase");
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

  const handleNavigate = (page: typeof currentPage) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.history.pushState(null, "", page === "home" ? "/" : "/" + page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col justify-between">
      
      {/* 1. Header / Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo & Identity */}
          <div 
            onClick={() => handleNavigate("home")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <img 
              src="/logo.svg" 
              alt="Aero Sales & Co. Logo" 
              className="w-8 h-8 rounded-lg shadow-xs transition-transform group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="text-xs font-display font-black tracking-[0.2em] text-slate-900 uppercase">
                AERO SALES OPERATIONS
              </h1>
              <p className="text-[8px] text-slate-400 font-mono tracking-wider font-bold">
                OUTBOUND REVOLUTION • EST. 2026
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => handleNavigate("home")}
              className={`text-xs font-mono font-bold tracking-wider transition-colors cursor-pointer ${currentPage === "home" ? "text-amber-600" : "text-slate-500 hover:text-slate-950"}`}
            >
              HOME
            </button>
            <button 
              onClick={() => handleNavigate("roster")}
              className={`text-xs font-mono font-bold tracking-wider transition-colors cursor-pointer ${currentPage === "roster" ? "text-amber-600" : "text-slate-500 hover:text-slate-950"}`}
            >
              SOURCED ROSTER
            </button>
            <button 
              onClick={() => handleNavigate("audit")}
              className={`text-xs font-mono font-bold tracking-wider transition-colors cursor-pointer ${currentPage === "audit" ? "text-amber-600" : "text-slate-500 hover:text-slate-950"}`}
            >
              PIPELINE AUDIT
            </button>
            <button 
              onClick={() => handleNavigate("sandbox")}
              className={`text-xs font-mono font-bold tracking-wider transition-colors cursor-pointer ${currentPage === "sandbox" ? "text-amber-600" : "text-slate-500 hover:text-slate-950"}`}
            >
              AI SANDBOX
            </button>
            {currentPage === "admin" && (
              <button 
                onClick={() => handleNavigate("admin")}
                className={`text-xs font-mono font-bold tracking-wider transition-colors cursor-pointer ${currentPage === "admin" ? "text-amber-600" : "text-slate-500 hover:text-slate-950"}`}
              >
                SYSTEM ADMIN
              </button>
            )}
            <button 
              onClick={() => handleNavigate("policies")}
              className={`text-xs font-mono font-bold tracking-wider transition-colors cursor-pointer ${currentPage === "policies" ? "text-amber-600" : "text-slate-500 hover:text-slate-950"}`}
            >
              POLICIES
            </button>
          </nav>

          {/* Action CTA Button */}
          <div className="hidden md:block">
            <button 
              onClick={() => handleNavigate("audit")}
              className="text-[10px] font-mono font-extrabold bg-slate-900 hover:bg-slate-800 text-white px-4.5 py-2.5 rounded-xl uppercase transition-all tracking-wider cursor-pointer shadow-xs"
            >
              Schedule Audit
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-700 hover:text-slate-950 focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-4 shadow-md overflow-hidden"
            >
              <button 
                onClick={() => handleNavigate("home")}
                className="block text-xs font-mono font-bold w-full text-left py-1 text-slate-600 hover:text-slate-950"
              >
                HOME
              </button>
              <button 
                onClick={() => handleNavigate("roster")}
                className="block text-xs font-mono font-bold w-full text-left py-1 text-slate-600 hover:text-slate-950"
              >
                SOURCED ROSTER
              </button>
              <button 
                onClick={() => handleNavigate("audit")}
                className="block text-xs font-mono font-bold w-full text-left py-1 text-slate-600 hover:text-slate-950"
              >
                PIPELINE AUDIT
              </button>
              <button 
                onClick={() => handleNavigate("sandbox")}
                className="block text-xs font-mono font-bold w-full text-left py-1 text-slate-600 hover:text-slate-950"
              >
                AI SANDBOX
              </button>
              {currentPage === "admin" && (
                <button 
                  onClick={() => handleNavigate("admin")}
                  className="block text-xs font-mono font-bold w-full text-left py-1 text-slate-600 hover:text-slate-950"
                >
                  SYSTEM ADMIN
                </button>
              )}
              <button 
                onClick={() => handleNavigate("policies")}
                className="block text-xs font-mono font-bold w-full text-left py-1 text-slate-600 hover:text-slate-950"
              >
                POLICIES
              </button>
              
              {/* External and Smooth Scroll Links for demonstrative self-explanatory UX */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">DEMO & UTILITIES</span>
                
                <a 
                  href="https://google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-xs font-mono font-bold w-full text-left py-1 text-blue-600 hover:text-blue-800 flex items-center gap-1.5"
                >
                  EXTERNAL GOOGLE DOCS ↗ <span className="text-[9px] font-light text-slate-400">(Closes Menu)</span>
                </a>

                <button 
                  onClick={() => {
                    document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="block text-xs font-mono font-bold w-full text-left py-1 text-amber-600 hover:text-amber-800 flex items-center gap-1.5 smooth-scroll"
                >
                  SMOOTH SCROLL TO FOOTER ↓ <span className="text-[9px] font-light text-slate-400">(Closes Menu)</span>
                </button>
              </div>

              <button 
                onClick={() => handleNavigate("audit")}
                className="w-full text-xs font-mono font-bold text-center py-3 bg-slate-900 text-white rounded-xl uppercase block"
              >
                Schedule Audit
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. Main Page Render */}
      <main className="flex-1 w-full bg-[#F8FAFC]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {currentPage === "home" && (
              <Homepage onNavigate={handleNavigate} />
            )}

            {currentPage === "roster" && (
              <div className="max-w-5xl mx-auto px-6 py-12">
                <PilotRolesBoard 
                  theme={selectedTheme} 
                  isLight={true} 
                  currentStyles={{}} 
                  onSignupComplete={() => {}}
                />
              </div>
            )}

            {currentPage === "audit" && (
              <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="text-center space-y-3 mb-10">
                  <span className="text-[9px] font-mono tracking-widest font-bold text-amber-600 uppercase inline-flex items-center gap-1.5 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-100 shadow-xs">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Interactive Leak Audit
                  </span>
                  <h1 className="text-3xl font-display font-bold text-slate-900">
                    Enterprise Revenue Leak Auditor
                  </h1>
                  <p className="text-xs text-slate-500 max-w-lg mx-auto font-light leading-relaxed">
                    Compute mathematical brand leakages based on ARR, traffic, conversion, and listing optimization score. Request an official executive diagnostic document from our Sr. Closers.
                  </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs">
                  <ConversionCalculator config={landingPageData.calculator} theme={selectedTheme} />
                </div>
              </div>
            )}

            {currentPage === "sandbox" && (
              <div className="w-full flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
                
                {/* Sandbox Control Column */}
                <aside className="w-full lg:w-[460px] shrink-0 border-r border-slate-200 bg-white flex flex-col h-full overflow-y-auto p-6 space-y-6 scrollbar-thin shadow-xs">
                  
                  {/* Sandbox Banner */}
                  <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-mono font-bold tracking-widest text-amber-400 uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        INTERACTIVE LAB
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">V2.0 STABLE</span>
                    </div>
                    <p className="text-xs font-bold font-display">Aero Pipeline Optimizer Sandbox</p>
                    <p className="text-[9px] text-slate-300 leading-normal font-light">
                      Simulate visual and copy adjustments to high-converting formats. Use Gemini to optimize for other niches dynamically.
                    </p>
                  </div>

                  {/* Section 1: Template Presets */}
                  <div className="space-y-2.5">
                    <h2 className="text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
                      <Layout className="w-3.5 h-3.5 text-slate-400" />
                      Select Sandbox Presets
                    </h2>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setActivePreset("aether")}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          activePreset === "aether"
                            ? "bg-amber-50 border-amber-200 text-amber-700 font-bold"
                            : "bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-100/50"
                        }`}
                      >
                        <p className="text-[9px] font-bold font-mono">OUTBOUND</p>
                        <span className="text-[7.5px] text-slate-400 uppercase tracking-widest font-mono">Aether</span>
                      </button>
                      <button
                        onClick={() => setActivePreset("prism")}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          activePreset === "prism"
                            ? "bg-amber-50 border-amber-200 text-amber-700 font-bold"
                            : "bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-100/50"
                        }`}
                      >
                        <p className="text-[9px] font-bold font-mono">TALENT</p>
                        <span className="text-[7.5px] text-slate-400 uppercase tracking-widest font-mono">Prism</span>
                      </button>
                      <button
                        onClick={() => setActivePreset("scribe")}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          activePreset === "scribe"
                            ? "bg-amber-50 border-amber-200 text-amber-700 font-bold"
                            : "bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-100/50"
                        }`}
                      >
                        <p className="text-[9px] font-bold font-mono">REVOPS</p>
                        <span className="text-[7.5px] text-slate-400 uppercase tracking-widest font-mono">Scribe</span>
                      </button>
                    </div>
                  </div>

                  {/* Section 2: Gemini Copilot Generator */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-sm">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                      <h3 className="text-[11px] font-mono font-bold text-slate-700 flex items-center gap-1.5 uppercase">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                        AI Copy Generator
                      </h3>
                      <span className="text-[8px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">GEMINI PRO</span>
                    </div>

                    <form onSubmit={handleGenerateLandingPage} className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                          Product Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Vesper DB"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs text-slate-800 p-2.5 rounded-xl outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                          Hook / Core Value Prop
                        </label>
                        <textarea
                          placeholder="e.g. Ultra-secure multi-region relational database engine designed for enterprise financial ledgers."
                          value={productHook}
                          onChange={(e) => setProductHook(e.target.value)}
                          rows={2}
                          className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs text-slate-800 p-2.5 rounded-xl outline-none transition-all resize-none font-light leading-relaxed"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                          Target Audience
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. FinTech CTOs & Chief Security Officers"
                          value={targetAudience}
                          onChange={(e) => setTargetAudience(e.target.value)}
                          className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs text-slate-800 p-2.5 rounded-xl outline-none transition-all font-light"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                          Interactive Vibe
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { id: "obsidian_noir", label: "Cobalt Noir", bg: "bg-blue-600" },
                            { id: "emerald_glass", label: "Emerald Mint", bg: "bg-indigo-500" },
                            { id: "monochrome_luxury", label: "Classic Slate", bg: "bg-slate-800" },
                            { id: "arctic_frost", label: "Stripe Ice", bg: "bg-cyan-400" }
                          ].map(t => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setSelectedTheme(t.id as AestheticTheme)}
                              className={`py-1.5 px-2.5 text-[9px] font-mono rounded-lg border text-left transition-all flex items-center justify-between cursor-pointer ${
                                selectedTheme === t.id
                                  ? "border-blue-500 text-blue-700 bg-white font-bold"
                                  : "border-slate-200 text-slate-500 bg-white hover:border-slate-300"
                              }`}
                            >
                              {t.label}
                              <span className={`w-2 h-2 rounded-full ${t.bg}`} />
                            </button>
                          ))}
                        </div>
                      </div>

                      {errorMessage && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-[10px] text-red-700 flex gap-1.5">
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                          <span>{errorMessage}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isGenerating}
                        className="w-full py-2.5 rounded-xl bg-slate-950 text-white font-mono font-bold text-[10px] uppercase flex items-center justify-center gap-1.5 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs transition-all"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                            Optimizing with Gemini...
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            Compile Copy Options
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  {/* Section 3: Traffic Funnel Simulator */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-sm">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                      <h3 className="text-[11px] font-mono font-bold text-slate-700 flex items-center gap-1.5 uppercase">
                        <Activity className="w-3.5 h-3.5 text-slate-400 animate-pulse" />
                        Funnel Simulation
                      </h3>
                      <button 
                        onClick={startSimulation}
                        disabled={simState === "running"}
                        className="text-[8px] font-mono text-blue-700 font-bold bg-blue-50 border border-blue-100 px-2 py-1 rounded-lg hover:bg-blue-100 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-2.5 h-2.5 fill-blue-600 text-blue-600" /> Run simulation
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-500 leading-normal font-light">
                      Simulate 5,000 real target visitors hitting this template structure to audit conversions.
                    </p>

                    <div className="space-y-2 font-mono text-[10.5px]">
                      {/* Visitors */}
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[8.5px] text-slate-400 font-bold">
                          <span>1. SIMULATED VISITORS</span>
                          <span className="text-slate-700">{simVisitors.toLocaleString()} / 5,000</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                          <div className="bg-slate-900 h-full transition-all duration-100" style={{ width: `${(simVisitors / 5000) * 100}%` }} />
                        </div>
                      </div>

                      {/* Conversions */}
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[8.5px] text-slate-400 font-bold">
                          <span>2. REVENUE SIGNUPS ({landingPageData.conversionInsights.predictedConversionRate}% Est)</span>
                          <span className="text-amber-600 font-bold flex items-center gap-0.5">
                            <TrendingUp className="w-3 h-3" />
                            {simConversions.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full transition-all duration-100" style={{ width: `${(simVisitors / 5000) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Deep Conversion Insights Teardown */}
                  <ConversionInsightsPanel 
                    insights={landingPageData.conversionInsights} 
                    productName={landingPageData.productName} 
                  />

                </aside>

                {/* Sandbox Visual Showcase Preview */}
                <main className="flex-1 bg-slate-100 flex flex-col h-full overflow-hidden p-6 relative">
                  
                  {/* View Toggle Bar */}
                  <div className="flex justify-between items-center mb-4 shrink-0 bg-white/80 p-1.5 rounded-2xl border border-slate-200/50 backdrop-blur-md">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setActiveView("showcase")}
                        className={`text-[10px] font-mono font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                          activeView === "showcase" 
                            ? "bg-slate-900 text-white" 
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" /> Normal Layout
                      </button>
                      
                      <button
                        onClick={() => setActiveView("heatmap")}
                        className={`text-[10px] font-mono font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                          activeView === "heatmap" 
                            ? "bg-red-600 text-white" 
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        <Flame className="w-3.5 h-3.5" /> Heatmap Overlay
                      </button>
                    </div>

                    <div className="flex items-center gap-1 text-[9px] font-mono text-slate-400 px-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping mr-1" />
                      Dynamic Preview
                    </div>
                  </div>

                  {/* Aesthetic Preview Canvas Wrapper */}
                  <div className="flex-1 w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-y-auto overflow-x-hidden relative scrollbar-thin">
                    <AestheticPreview 
                      data={landingPageData} 
                      theme={selectedTheme} 
                      isHeatmapVisible={activeView === "heatmap"} 
                    />
                  </div>

                </main>

              </div>
            )}

            {currentPage === "admin" && (
              <div className="max-w-6xl mx-auto px-6 py-12">
                <AdminConsole onRoleAdded={() => {}} />
              </div>
            )}

            {currentPage === "policies" && (
              <div className="max-w-4xl mx-auto px-6 py-12">
                <PoliciesPage />
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Global Footer */}
      <footer id="footer" className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 shrink-0">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
            <img 
              src="/logo.svg" 
              alt="Aero Sales & Co. Logo" 
              className="w-8 h-8 rounded-lg shadow-xs"
              referrerPolicy="no-referrer"
            />
              <span className="text-sm font-display font-black tracking-widest text-white uppercase">
                AERO SALES OPERATIONS
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500 font-light max-w-sm">
              We construct, optimize, and co-manage B2B outbound operational loops. Elite Sourced representation paired with advanced GoHighLevel automation infrastructure.
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <p className="text-[10px] font-mono text-white tracking-widest font-bold uppercase">RESOURCES</p>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNavigate("roster")} className="hover:text-amber-500 transition-colors text-left font-light">
                  Remote Setter Roster
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate("audit")} className="hover:text-amber-500 transition-colors text-left font-light">
                  Revenue Leak Calculator
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate("sandbox")} className="hover:text-amber-500 transition-colors text-left font-light">
                  AI Copy Simulator
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <p className="text-[10px] font-mono text-white tracking-widest font-bold uppercase">SECURITY & POLICIES</p>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNavigate("policies")} className="hover:text-amber-500 transition-colors text-left font-light flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Relational Database Policies
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate("policies")} className="hover:text-amber-500 transition-colors text-left font-light">
                  Talent Sourcing Compliance
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate("policies")} className="hover:text-amber-500 transition-colors text-left font-light">
                  GDPR Pipeline Deletion Protocol
                </button>
              </li>
            </ul>
          </div>

        </div>

        <div className="max-w-6xl mx-auto px-6 mt-12 pt-8 border-t border-slate-900/80 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-600 font-mono gap-4">
          <span>© {new Date().getFullYear()} Aero Sales Operations. Engineered in high-conversion workspace. All rights reserved.</span>
          <span className="flex items-center gap-1 bg-slate-900/60 px-3 py-1 rounded-full border border-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> SECURE SSL ENCRYPTED
          </span>
        </div>
      </footer>

    </div>
  );
}
