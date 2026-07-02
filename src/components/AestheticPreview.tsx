import { useState } from "react";
import { LandingPageData, AestheticTheme } from "../types";
import { ConversionCalculator } from "./ConversionCalculator";
import { HeatmapOverlay } from "./HeatmapOverlay";
import { PilotRolesBoard } from "./PilotRolesBoard";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AestheticPreviewProps {
  data: LandingPageData;
  theme: AestheticTheme;
  isHeatmapVisible: boolean;
  onSignupComplete?: () => void;
}

export function AestheticPreview({ data, theme, isHeatmapVisible, onSignupComplete }: AestheticPreviewProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Always force premium light styling as per user guidelines
  const isLight = true;

  // Dynamic Icon Renderer
  const renderIcon = (name: string) => {
    const IconComponent = (Icons as any)[name] || Icons.HelpCircle;
    return (
      <IconComponent className="w-5 h-5 text-amber-600" />
    );
  };

  // Theme-specific styles (rebuilt as premium light themes)
  const getThemeStyles = () => {
    switch (theme) {
      case "obsidian_noir": // Rendered as "Amber Classic"
        return {
          bg: "bg-[#F8FAFC] text-slate-800",
          accentText: "text-amber-600",
          cardBg: "bg-white border-slate-200/80 shadow-xs",
          buttonPrimary: "bg-amber-600 text-white hover:bg-amber-700 shadow-sm",
          buttonSecondary: "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200",
          badgeBg: "bg-amber-50 text-amber-800 border-amber-100",
          lineColor: "border-slate-200"
        };
      case "emerald_glass": // Rendered as "Gold Minimalist"
        return {
          bg: "bg-[#FCFCFD] text-slate-800",
          accentText: "text-amber-700",
          cardBg: "bg-white border-amber-100/70 shadow-xs",
          buttonPrimary: "bg-amber-700 text-white hover:bg-amber-800 shadow-sm",
          buttonSecondary: "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200",
          badgeBg: "bg-amber-50 text-amber-700 border-amber-100",
          lineColor: "border-amber-100"
        };
      case "monochrome_luxury": // Rendered as "Classic Slate"
        return {
          bg: "bg-[#FAF9F6] text-slate-800",
          accentText: "text-slate-950",
          cardBg: "bg-white border-slate-200 shadow-sm",
          buttonPrimary: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm",
          buttonSecondary: "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200",
          badgeBg: "bg-slate-100 text-slate-700 border-slate-200",
          lineColor: "border-slate-200"
        };
      case "arctic_frost": // Rendered as "Amber Ice"
        return {
          bg: "bg-[#EDF2F7] text-slate-800",
          accentText: "text-amber-600",
          cardBg: "bg-white/90 border-slate-200/60 shadow-xs backdrop-blur-md",
          buttonPrimary: "bg-amber-600 text-white hover:bg-amber-500 shadow-sm",
          buttonSecondary: "bg-white text-slate-800 hover:bg-slate-50 border border-slate-200",
          badgeBg: "bg-amber-50 text-amber-600 border-amber-100",
          lineColor: "border-slate-200"
        };
    }
  };

  const currentStyles = getThemeStyles();

  return (
    <div className={`relative w-full min-h-screen py-16 px-4 md:px-12 transition-all duration-500 rounded-3xl overflow-hidden ${currentStyles.bg}`}>
      
      {/* Dynamic light subtle ambient glow matching the theme */}
      <div className="absolute top-10 left-1/4 w-[350px] h-[350px] rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

      {/* Heatmap Layer */}
      <HeatmapOverlay isVisible={isHeatmapVisible} />

      <div className="max-w-4xl mx-auto space-y-24 relative z-10">
        
        {/* Floating Navigation Header */}
        <header className="flex justify-between items-center py-4 border-b border-transparent">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center font-mono font-bold text-xs bg-amber-600 text-white">
              {data.productName ? data.productName.charAt(0) : "A"}
            </div>
            <span className="text-xs tracking-widest font-display font-semibold text-slate-900 uppercase">
              {data.productName || "SaaS Engine"}
            </span>
          </div>
          
          <nav className="hidden sm:flex items-center gap-6 text-[10.5px] font-mono tracking-wider text-slate-500 uppercase">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#calculator" className="hover:text-slate-900 transition-colors">Yield Engine</a>
            <a href="#proof" className="hover:text-slate-900 transition-colors">Case Study</a>
          </nav>

          <button className={`text-[10px] font-mono font-bold uppercase px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${currentStyles.buttonPrimary}`}>
            Join Private Pilot
          </button>
        </header>

        {/* Hero Section */}
        <section className="text-center pt-10 pb-6 space-y-6">
          {data.hero.badge && (
            <div className="inline-flex justify-center">
              <span className={`text-[9px] font-mono tracking-widest uppercase font-bold px-3 py-1 rounded-full border ${currentStyles.badgeBg}`}>
                {data.hero.badge}
              </span>
            </div>
          )}

          <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight max-w-2xl mx-auto leading-[1.1] text-slate-900">
            {data.hero.headline || "A beautiful high-performance experience."}
          </h1>

          <p className="text-sm sm:text-base max-w-xl mx-auto leading-relaxed text-slate-500 font-light">
            {data.hero.subheadline || "Personalize and test conversion hooks seamlessly."}
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3.5 pt-4">
            <button className={`text-xs font-mono font-bold px-6 py-3 rounded-xl uppercase transition-all duration-200 w-full sm:w-auto cursor-pointer ${currentStyles.buttonPrimary}`}>
              {data.hero.ctaPrimary || "Deploy Instance"}
            </button>
            <button className={`text-xs font-mono font-bold px-6 py-3 rounded-xl uppercase transition-all duration-200 w-full sm:w-auto cursor-pointer ${currentStyles.buttonSecondary}`}>
              {data.hero.ctaSecondary || "Whitepaper"}
            </button>
          </div>
        </section>

        {/* High-End Technical Metrics Row */}
        <section className={`grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-y ${currentStyles.lineColor}`}>
          <div className="text-center sm:text-left space-y-1">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{data.metrics.label1}</p>
            <p className="text-2xl font-mono font-bold text-slate-900">{data.metrics.value1}</p>
          </div>
          <div className="text-center sm:text-left space-y-1">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{data.metrics.label2}</p>
            <p className="text-2xl font-mono font-bold text-slate-900">{data.metrics.value2}</p>
          </div>
          <div className="text-center sm:text-left space-y-1">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{data.metrics.label3}</p>
            <p className="text-2xl font-mono font-bold text-slate-900">{data.metrics.value3}</p>
          </div>
        </section>

        {/* Trust Logos (Institutional Social Proof) */}
        <section className="text-center space-y-4">
          <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
            ENGINEERED FOR THE WORLD&apos;S FINEST TECHNOLOGY TEAMS
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4 opacity-40 hover:opacity-60 transition-opacity duration-300 py-2 text-slate-600">
            <span className="text-xs font-semibold font-mono tracking-wider select-none">▲ VERCEL</span>
            <span className="text-xs font-semibold font-mono tracking-wider select-none">❖ NETLIFY</span>
            <span className="text-xs font-semibold font-mono tracking-wider select-none">⬡ SUPABASE</span>
            <span className="text-xs font-semibold font-mono tracking-wider select-none">■ RETOOL</span>
          </div>
        </section>

        {/* Bento Grid Features Section */}
        <section id="features" className="space-y-6">
          <div className="text-center">
            <span className="text-[9px] font-mono tracking-widest font-bold text-slate-400 uppercase">
              Core Technical Architecture
            </span>
            <h2 className="text-2xl font-display font-semibold mt-1 text-slate-900">
              Built for high-stakes digital deployments.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {data.features.map((feature) => (
              <div 
                key={feature.title} 
                className={`p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 ${currentStyles.cardBg}`}
              >
                <div className="mb-4">
                  {renderIcon(feature.icon)}
                </div>
                <h3 className="text-sm font-display font-semibold mb-2 text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Dynamic ROI Calculator Sandbox */}
        <section id="calculator" className="space-y-4">
          <div className="text-center mb-4">
            <span className="text-[9px] font-mono tracking-widest font-bold text-slate-400 uppercase">
              Financial Transparency Sandbox
            </span>
            <h2 className="text-2xl font-display font-semibold mt-1 text-slate-900">
              Calculate your corporate return on value.
            </h2>
          </div>
          <ConversionCalculator config={data.calculator} theme={theme} />
        </section>

        {/* Peer social proof case-study testimonial */}
        <section id="proof" className={`p-8 rounded-3xl border ${currentStyles.cardBg}`}>
          <div className="flex items-center gap-1.5 mb-4">
            <Icons.Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <Icons.Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <Icons.Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <Icons.Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <Icons.Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-[9px] font-mono text-slate-400 ml-1">VERIFIED AGENCY STUDY</span>
          </div>

          <blockquote className="text-sm sm:text-base leading-relaxed italic mb-6 text-slate-700">
            &ldquo;{data.testimonial.quote}&rdquo;
          </blockquote>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs bg-slate-100 text-blue-600 border border-slate-200">
              {data.testimonial.avatarInitials}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900">
                {data.testimonial.author}
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                {data.testimonial.role}, <span className="font-semibold">{data.testimonial.company}</span>
              </p>
            </div>
          </div>
        </section>

        {/* Active Open Careers & Pilot Roles Section */}
        <PilotRolesBoard 
          theme={theme} 
          isLight={isLight} 
          currentStyles={currentStyles} 
          onSignupComplete={onSignupComplete} 
        />

        {/* Objection-Busting FAQ section */}
        <section className="space-y-6">
          <div className="text-center">
            <span className="text-[9px] font-mono tracking-widest font-bold text-slate-400 uppercase">
              Addressing Objections & Frictions
            </span>
            <h2 className="text-2xl font-display font-semibold mt-1 text-slate-900">
              Frequently Answered Inquiries
            </h2>
          </div>

          <div className={`border-t ${currentStyles.lineColor} divide-y ${currentStyles.lineColor}`}>
            {data.faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="py-4">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex justify-between items-center text-left text-xs font-display font-medium text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <Icons.Minus className="w-3.5 h-3.5" /> : <Icons.Plus className="w-3.5 h-3.5" />}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-[11px] leading-relaxed mt-2.5 text-slate-500">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* Final CTA Gate */}
        <section className="text-center py-12 px-6 rounded-3xl border border-dashed flex flex-col justify-center items-center bg-slate-50 border-slate-200">
          <h2 className="text-2xl font-display font-bold tracking-tight mb-2 text-slate-900">
            {data.ctaSection.headline}
          </h2>
          <p className="text-xs max-w-md mx-auto mb-6 leading-relaxed text-slate-500">
            {data.ctaSection.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm justify-center">
            <input 
              type="email" 
              placeholder="Enter secure business email" 
              className="text-xs font-mono px-4 py-3 rounded-xl outline-none border w-full text-center sm:text-left bg-white border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800"
            />
            <button className={`text-xs font-mono font-bold px-5 py-3 rounded-xl uppercase shrink-0 transition-all cursor-pointer ${currentStyles.buttonPrimary}`}>
              {data.ctaSection.buttonText}
            </button>
          </div>
          <p className="text-[9px] text-slate-400 font-mono mt-3">
            🔐 Secured by cryptographic client protocol. No tracking databases.
          </p>
        </section>

        {/* Footer */}
        <footer className={`flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 font-mono pt-8 border-t ${currentStyles.lineColor}`}>
          <p>© {new Date().getFullYear()} {data.productName || "SaaS Engine"} Inc. All software architecture certified.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <a href="#" className="hover:text-slate-900">Privacy Protocol</a>
            <a href="#" className="hover:text-slate-900">SLA Architecture</a>
          </div>
        </footer>

      </div>
    </div>
  );
}
