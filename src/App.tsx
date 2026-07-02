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
  const [comparisonData, setComparisonData] = useState<LandingPageData | null>(null);
  const [isShowingComparison, setIsShowingComparison] = useState<boolean>(false);
  const [selectedTheme, setSelectedTheme] = useState<AestheticTheme>("obsidian_noir");
  const [activeView, setActiveView] = useState<"showcase" | "heatmap">("showcase");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Inputs
  const [productName, setProductName] = useState<string>("");
  const [productHook, setProductHook] = useState<string>("");
  const [targetAudience, setTargetAudience] = useState<string>("");
  const [conversionGoal, setConversionGoal] = useState<string>("Direct SaaS Subscription");

  // Input Validation helpers
  const isProductNameTooShort = productName.length > 0 && productName.length < 3;
  const isProductHookTooShort = productHook.length > 0 && productHook.length < 12;
  const isTargetAudienceTooShort = targetAudience.length > 0 && targetAudience.length < 5;
  const isFormInvalid = isProductNameTooShort || isProductHookTooShort || isTargetAudienceTooShort || !productName.trim();

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
      setComparisonData(landingPageData);
      setLandingPageData(generatedData);
      setIsShowingComparison(false);
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
            )}            {currentPage === "sandbox" && (
              <div className="w-full flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden bg-slate-50">
                
                {/* Sandbox Control Column */}
                <aside className="w-full lg:w-[460px] shrink-0 border-r border-slate-200 bg-white flex flex-col h-full overflow-y-auto p-6 space-y-6 scrollbar-thin shadow-xs">
                  
                  {/* Sandbox Banner */}
                  <div className="bg-slate-950 text-white p-5 rounded-2xl space-y-1.5 border border-slate-800">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-mono font-bold tracking-widest text-amber-400 uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        INTERACTIVE LAB
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">V2.1 SECURE</span>
                    </div>
                    <p className="text-sm font-black font-display text-slate-100">Aero Pipeline Optimizer Sandbox</p>
                    <p className="text-[10px] text-slate-300 leading-normal font-light">
                      Review, audit, and simulate custom outbound formats. Use our integrated Gemini instance to compile high-performing copywriting for any niche on the fly.
                    </p>
                  </div>

                  {/* Section 1: Template Presets */}
                  <div className="space-y-3 border-t border-slate-100 pt-5">
                    <div className="flex justify-between items-center">
                      <h2 className="text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
                        <Layout className="w-3.5 h-3.5 text-slate-400" />
                        STEP 1: SELECT PRESET BLUEPRINT
                      </h2>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal font-light">
                      Choose an initial blueprint configured for outbound campaigns, high-earning worker recruitment, or RevOps services.
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setActivePreset("aether")}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          activePreset === "aether"
                            ? "bg-amber-50 border-amber-200 text-amber-700 font-bold"
                            : "bg-slate-50 border-slate-150 text-slate-500 hover:border-slate-200 hover:bg-slate-100/50"
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
                            : "bg-slate-50 border-slate-150 text-slate-500 hover:border-slate-200 hover:bg-slate-100/50"
                        }`}
                      >
                        <p className="text-[9px] font-bold font-mono">RECRUITING</p>
                        <span className="text-[7.5px] text-slate-400 uppercase tracking-widest font-mono">Prism</span>
                      </button>
                      <button
                        onClick={() => setActivePreset("scribe")}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          activePreset === "scribe"
                            ? "bg-amber-50 border-amber-200 text-amber-700 font-bold"
                            : "bg-slate-50 border-slate-150 text-slate-500 hover:border-slate-200 hover:bg-slate-100/50"
                        }`}
                      >
                        <p className="text-[9px] font-bold font-mono">REVOPS</p>
                        <span className="text-[7.5px] text-slate-400 uppercase tracking-widest font-mono">Scribe</span>
                      </button>
                    </div>
                  </div>

                  {/* Section 2: Gemini Copilot Generator */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-2xs">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                      <h3 className="text-[11px] font-mono font-bold text-slate-700 flex items-center gap-1.5 uppercase">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                        STEP 2: CUSTOM AI COPYWRITER
                      </h3>
                      <span className="text-[8px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">GEMINI PRO</span>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-relaxed font-light">
                      Draft elite copywriting and structured metrics automatically. Enter your SaaS parameters and let Gemini optimize the hook.
                    </p>

                    <form onSubmit={handleGenerateLandingPage} className="space-y-3.5 pt-1">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                          Product Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Vesper DB"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          className={`w-full bg-white border text-xs text-slate-800 p-2.5 rounded-xl outline-none transition-all shadow-3xs ${
                            isProductNameTooShort 
                              ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/10" 
                              : "border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          }`}
                        />
                        {isProductNameTooShort ? (
                          <p className="text-[9px] text-rose-500 font-mono flex items-center gap-1 animate-fadeIn">
                            <AlertTriangle className="w-2.5 h-2.5" /> character count too low ({productName.length}/3)
                          </p>
                        ) : (
                          <p className="text-[8.5px] text-slate-400 font-mono">
                            Minimum 3 characters required.
                          </p>
                        )}
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
                          className={`w-full bg-white border text-xs text-slate-800 p-2.5 rounded-xl outline-none transition-all resize-none font-light leading-relaxed shadow-3xs ${
                            isProductHookTooShort 
                              ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/10" 
                              : "border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          }`}
                        />
                        {isProductHookTooShort ? (
                          <p className="text-[9px] text-rose-500 font-mono flex items-center gap-1 animate-fadeIn">
                            <AlertTriangle className="w-2.5 h-2.5" /> character count too low ({productHook.length}/12)
                          </p>
                        ) : (
                          <p className="text-[8.5px] text-slate-400 font-mono">
                            Minimum 12 characters. Help Gemini capture your product's edge.
                          </p>
                        )}
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
                          className={`w-full bg-white border text-xs text-slate-800 p-2.5 rounded-xl outline-none transition-all font-light shadow-3xs ${
                            isTargetAudienceTooShort 
                              ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/10" 
                              : "border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          }`}
                        />
                        {isTargetAudienceTooShort ? (
                          <p className="text-[9px] text-rose-500 font-mono flex items-center gap-1 animate-fadeIn">
                            <AlertTriangle className="w-2.5 h-2.5" /> character count too low ({targetAudience.length}/5)
                          </p>
                        ) : (
                          <p className="text-[8.5px] text-slate-400 font-mono">
                            Minimum 5 characters. E.g. Outbound marketing directors.
                          </p>
                        )}
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
                        disabled={isGenerating || isFormInvalid}
                        className="w-full py-2.5 rounded-xl bg-slate-950 text-white font-mono font-bold text-[10px] uppercase flex items-center justify-center gap-1.5 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs transition-all"
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
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-4 shadow-2xs">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                      <h3 className="text-[11px] font-mono font-bold text-slate-700 flex items-center gap-1.5 uppercase">
                        <Activity className="w-3.5 h-3.5 text-slate-400 animate-pulse" />
                        STEP 3: BEHAVIORAL FUNNEL SIMULATOR
                      </h3>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-normal font-light">
                      Simulate 5,000 corporate prospects hitting your structured blueprint copy on key digital channels. Audit click actions and final form signups in real-time.
                    </p>

                    {/* Simulation Dashboard Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="bg-white border border-slate-150 rounded-xl p-3 shadow-3xs font-mono text-left">
                        <span className="text-[8px] text-slate-400 uppercase font-bold block">TRAFFIC SAMPLE</span>
                        <span className="text-sm font-black text-slate-800">{simVisitors.toLocaleString()}</span>
                        <span className="text-[8px] text-slate-400 block mt-0.5">visitors</span>
                      </div>
                      <div className="bg-white border border-slate-150 rounded-xl p-3 shadow-3xs font-mono text-left">
                        <span className="text-[8px] text-slate-400 uppercase font-bold block">INTERACTIONS</span>
                        <span className="text-sm font-black text-blue-600">{simClicks.toLocaleString()}</span>
                        <span className="text-[8px] text-slate-400 block mt-0.5">clicks (12.5% CTR)</span>
                      </div>
                      <div className="bg-white border border-slate-150 rounded-xl p-3 shadow-3xs font-mono text-left">
                        <span className="text-[8px] text-slate-400 uppercase font-bold block">CONVERSIONS</span>
                        <span className="text-sm font-black text-emerald-600">{simConversions.toLocaleString()}</span>
                        <span className="text-[8px] text-slate-400 block mt-0.5">{landingPageData.conversionInsights.predictedConversionRate}% Est CR</span>
                      </div>
                      <div className="bg-white border border-slate-150 rounded-xl p-3 shadow-3xs font-mono text-left">
                        <span className="text-[8px] text-slate-400 uppercase font-bold block">SIMULATED LTV YIELD</span>
                        <span className="text-sm font-black text-amber-600">${(simConversions * 150).toLocaleString()}</span>
                        <span className="text-[8px] text-slate-400 block mt-0.5">@ $150 unit value</span>
                      </div>
                    </div>

                    {/* SVG Radial Progress Gauge for Conversion Confidence */}
                    {(() => {
                      const conversionRateVal = landingPageData.conversionInsights.predictedConversionRate || 4.2;
                      const progressFraction = simVisitors / 5000;
                      const peakConfidence = Math.min(99, Math.round(75 + conversionRateVal * 4.5));
                      const currentConfidence = simState === "idle" ? 0 : Math.round(peakConfidence * progressFraction);
                      return (
                        <div className="flex items-center gap-4 bg-white border border-slate-150 p-3 rounded-xl shadow-3xs">
                          {/* SVG Radial Gauge */}
                          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                              {/* Background Circle */}
                              <circle
                                cx="28"
                                cy="28"
                                r="22"
                                className="stroke-slate-100"
                                strokeWidth="4"
                                fill="transparent"
                              />
                              {/* Animated Foreground Circle */}
                              <motion.circle
                                cx="28"
                                cy="28"
                                r="22"
                                className="stroke-blue-600"
                                strokeWidth="4"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 22}
                                animate={{ strokeDashoffset: (2 * Math.PI * 22) * (1 - currentConfidence / 100) }}
                                transition={{ duration: 0.1, ease: "easeOut" }}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center font-mono">
                              <span className="text-[11px] font-black text-slate-800">{currentConfidence}%</span>
                            </div>
                          </div>

                          <div className="flex-grow space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">CONFIDENCE SCORE</span>
                              <span className="text-[8px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                {simState === "idle" ? "READY" : simState === "running" ? "STABILIZING" : "HIGH ACCURACY"}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-light leading-snug">
                              {simState === "idle" && "Initiate real-time stream simulation to compute confidence metrics."}
                              {simState === "running" && `Telemetry active: ${simVisitors.toLocaleString()} user samples.`}
                              {simState === "completed" && "Predictability confidence analysis finalized."}
                            </p>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Progress bars & Action */}
                    <div className="space-y-3 font-mono text-[10.5px] pt-1">
                      <div className="flex justify-between items-center text-[9px] text-slate-500 bg-white border border-slate-150 p-2.5 rounded-xl">
                        <span className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${simState === "running" ? "bg-amber-500 animate-ping" : simState === "completed" ? "bg-emerald-500" : "bg-slate-300"}`} />
                          {simState === "idle" && "Ready to trigger"}
                          {simState === "running" && "Streaming traffic..."}
                          {simState === "completed" && "Simulation finalized"}
                        </span>
                        
                        <button 
                          onClick={startSimulation}
                          disabled={simState === "running"}
                          className="text-[9px] font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg disabled:opacity-40 flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                        >
                          <Play className="w-2.5 h-2.5 fill-white text-white" /> Run Simulation
                        </button>
                      </div>

                      {simState === "running" && (
                        <div className="space-y-1">
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-full transition-all duration-100" style={{ width: `${(simVisitors / 5000) * 100}%` }} />
                          </div>
                          <div className="text-[8px] text-slate-400 text-right">Progress: {Math.round((simVisitors / 5000) * 100)}%</div>
                        </div>
                      )}
                    </div>

                    {/* Visceral Checkmark Success Feedback Banner */}
                    <AnimatePresence>
                      {simState === "completed" && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3 text-xs text-emerald-800"
                        >
                          <div className="bg-emerald-500 text-white rounded-full p-1.5 shadow-sm flex items-center justify-center shrink-0 mt-0.5">
                            <motion.svg
                              className="w-4 h-4 text-white stroke-current"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={3.5}
                            >
                              <motion.path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                              />
                            </motion.svg>
                          </div>
                          <div>
                            <p className="font-extrabold text-[10px] tracking-wider uppercase text-emerald-950">Simulation Successful</p>
                            <p className="text-[11.5px] leading-relaxed font-light text-emerald-700 mt-0.5">
                              Telemetry successfully logged 5,000 requests. Form actions finalized with <strong className="font-semibold text-emerald-900">{landingPageData.conversionInsights.predictedConversionRate}% conversion predictability</strong>.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Side-by-Side Comparison Module */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-2xs">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                      <h3 className="text-[11px] font-mono font-bold text-slate-700 flex items-center gap-1.5 uppercase">
                        <Layers className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                        STEP 3.5: SNAPSHOT A/B COMPARE
                      </h3>
                      {comparisonData && (
                        <span className="text-[8px] font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
                          SNAP ACTIVE
                        </span>
                      )}
                    </div>
                    
                    <p className="text-[10px] text-slate-400 leading-normal font-light">
                      Snapshot current copywriting to run A/B copy experiments or toggle between your baseline blueprint and Gemini-generated output.
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setComparisonData(landingPageData);
                          setIsShowingComparison(false);
                        }}
                        className="flex-1 py-2 text-[9px] font-mono font-bold uppercase rounded-xl border border-slate-250 bg-white text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        📸 Take Snapshot
                      </button>

                      {comparisonData && (
                        <button
                          onClick={() => setIsShowingComparison(!isShowingComparison)}
                          className={`flex-1 py-2 text-[9px] font-mono font-bold uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            isShowingComparison 
                              ? "bg-blue-600 text-white shadow-xs border border-blue-500" 
                              : "bg-slate-900 text-white shadow-xs"
                          }`}
                        >
                          {isShowingComparison ? "👉 View Optimized" : "👈 View Snapshot"}
                        </button>
                      )}
                    </div>

                    {comparisonData && (
                      <div className="text-[9px] bg-amber-50 border border-amber-100/60 p-2.5 rounded-xl font-mono text-slate-600 leading-relaxed">
                        {isShowingComparison ? (
                          <span className="text-amber-700 font-bold">⚠️ Displaying Snapshot:</span>
                        ) : (
                          <span className="text-blue-700 font-bold">✨ Displaying Active Copy:</span>
                        )}{" "}
                        {isShowingComparison ? comparisonData.productName : landingPageData.productName}
                      </div>
                    )}
                  </div>

                  {/* Section 4: Deep Conversion Insights Teardown */}
                  <div className="border-t border-slate-100 pt-5">
                    <h2 className="text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase flex items-center gap-1.5 mb-3">
                      STEP 4: COGNITIVE PERSUASION ANALYSIS
                    </h2>
                    <ConversionInsightsPanel 
                      insights={isShowingComparison && comparisonData ? comparisonData.conversionInsights : landingPageData.conversionInsights} 
                      productName={isShowingComparison && comparisonData ? comparisonData.productName : landingPageData.productName} 
                    />
                  </div>

                </aside>

                {/* Sandbox Visual Showcase Preview */}
                <main className="flex-1 bg-slate-100 flex flex-col h-full overflow-hidden p-6 relative">
                  
                  {/* View Toggle Bar */}
                  <div className="flex justify-between items-center mb-4 shrink-0 bg-white/80 p-2 rounded-2xl border border-slate-200/50 backdrop-blur-md">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setActiveView("showcase")}
                        className={`text-[10px] font-mono font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                          activeView === "showcase" 
                            ? "bg-slate-900 text-white" 
                            : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" /> Live Copy Showcase
                      </button>
                      
                      <button
                        onClick={() => setActiveView("heatmap")}
                        className={`text-[10px] font-mono font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                          activeView === "heatmap" 
                            ? "bg-rose-600 text-white" 
                            : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                        }`}
                      >
                        <Flame className="w-3.5 h-3.5" /> Heatmap Diagnostic
                      </button>
                    </div>

                    <div className="flex items-center gap-1 text-[9px] font-mono text-slate-400 px-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping mr-1" />
                      Dynamic Preview
                    </div>
                  </div>

                  {/* Informative Heatmap Explanation Banner */}
                  {activeView === "heatmap" && (
                    <div className="mb-4 bg-rose-50 border border-rose-100 rounded-xl p-3 text-xs text-rose-800 flex items-start gap-2.5 shadow-3xs animate-fadeIn shrink-0">
                      <Flame className="w-4 h-4 text-rose-500 shrink-0 mt-0.5 animate-pulse" />
                      <div>
                        <span className="font-bold uppercase tracking-wider block text-[9.5px] mb-0.5">Heatmap Diagnostic Enabled</span>
                        <p className="font-light text-[11px] leading-relaxed">
                          Warm crimson zones highlight high-dwell areas where prospective buyers pay the absolute most visual attention (focused on product hook headlines and interactive calculators). Designed to verify optical alignment.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Aesthetic Preview Canvas Wrapper */}
                  <div className="flex-1 w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-y-auto overflow-x-hidden relative scrollbar-thin">
                    <AestheticPreview 
                      data={isShowingComparison && comparisonData ? comparisonData : landingPageData} 
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
