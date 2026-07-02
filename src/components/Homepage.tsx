import React, { useState } from "react";
import { LandingPageData } from "../types";
import { TEMPLATES } from "../data/templates";
import { 
  TrendingUp, 
  Users, 
  Cpu, 
  Star, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  CheckCircle,
  HelpCircle,
  Clock,
  Plus,
  Minus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HomepageProps {
  onNavigate: (page: "home" | "roster" | "audit" | "admin" | "policies") => void;
}

export function Homepage({ onNavigate }: HomepageProps) {
  const data = TEMPLATES.aether; // Aero Sales Operations copy
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Email state for CTA
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCtaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg("Please enter your corporate email.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Please enter a valid corporate email.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/signups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: "[Homepage Lead]",
          email: email.trim(),
          roleId: "cta-lead",
          experience: "Requested exploration and contact regarding Aero Sales Operations outbound systems from the homepage."
        })
      });

      if (!res.ok) throw new Error("Could not register interest.");

      setSuccess(true);
      setEmail("");
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 text-center space-y-8 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
        
        <div className="inline-flex justify-center">
          <span className="text-[10px] font-mono tracking-widest uppercase font-bold px-4 py-1.5 rounded-full border bg-amber-50 text-amber-800 border-amber-100">
            {data.hero.badge}
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.08] text-slate-900">
          We Engineer High-Performing <br />
          <span className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 bg-clip-text text-transparent">Outbound Sales Pipelines</span>.
        </h1>

        <p className="text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed text-slate-500 font-light">
          Aero Sales Operations recruits, trains, and integrates elite teams of dedicated remote appointment setters and expert closers inside your company. Stop leaking multi-million dollar deals.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <button 
            onClick={() => onNavigate("audit")}
            className="text-xs font-mono font-bold px-8 py-4 rounded-xl uppercase transition-all duration-200 bg-amber-600 text-white hover:bg-amber-700 shadow-md hover:-translate-y-0.5 cursor-pointer w-full sm:w-auto"
          >
            Schedule Pipeline Audit
          </button>
          <button 
            onClick={() => onNavigate("roster")}
            className="text-xs font-mono font-bold px-8 py-4 rounded-xl uppercase transition-all duration-200 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-xs hover:-translate-y-0.5 cursor-pointer w-full sm:w-auto"
          >
            Apply to Join Our Roster
          </button>
        </div>
      </section>

      {/* Corporate Metrics Banner */}
      <section className="bg-white border-y border-slate-200/80 shadow-xs py-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="text-center sm:text-left space-y-1 sm:border-r border-slate-100 pr-4">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">{data.metrics.label1}</p>
            <p className="text-3xl font-mono font-extrabold text-slate-900">{data.metrics.value1}</p>
          </div>
          <div className="text-center sm:text-left space-y-1 sm:border-r border-slate-100 pr-4">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">{data.metrics.label2}</p>
            <p className="text-3xl font-mono font-extrabold text-amber-600">{data.metrics.value2}</p>
          </div>
          <div className="text-center sm:text-left space-y-1">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">{data.metrics.label3}</p>
            <p className="text-3xl font-mono font-extrabold text-slate-900">{data.metrics.value3}</p>
          </div>
        </div>
      </section>

      {/* Social Trust Badges */}
      <section className="py-12 text-center space-y-4 max-w-6xl mx-auto px-6">
        <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">
          INTEGRATING WITH LEADING SYSTEMS & WORKSPACES
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4 opacity-40 hover:opacity-60 transition-opacity duration-300 text-slate-600">
          <span className="text-xs font-semibold font-mono tracking-wider select-none">▲ GOHIGHLEVEL</span>
          <span className="text-xs font-semibold font-mono tracking-wider select-none">❖ HUB SPOT</span>
          <span className="text-xs font-semibold font-mono tracking-wider select-none">⬡ SALESFORCE</span>
          <span className="text-xs font-semibold font-mono tracking-wider select-none">■ ZAPIER</span>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[9px] font-mono tracking-widest font-bold text-amber-600 uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
            OUR CORE COMPETENCY
          </span>
          <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-slate-900">
            A Turnkey Solution to Plug Your Revenue Gaps.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-light">
            We don&apos;t just consult. We actively source elite Remote representatives, customize GoHighLevel pipeline automations, and co-manage outbound results daily.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-8 rounded-3xl border bg-white border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{data.features[0].title}</h3>
            <p className="text-xs leading-relaxed text-slate-500 font-light">
              {data.features[0].description}
            </p>
            <button 
              onClick={() => onNavigate("roster")}
              className="text-[10px] font-mono text-amber-600 font-bold uppercase tracking-wider flex items-center gap-1 hover:underline"
            >
              Browse Open Positions <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-3xl border bg-white border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{data.features[1].title}</h3>
            <p className="text-xs leading-relaxed text-slate-500 font-light">
              {data.features[1].description}
            </p>
            <button 
              onClick={() => onNavigate("audit")}
              className="text-[10px] font-mono text-amber-600 font-bold uppercase tracking-wider flex items-center gap-1 hover:underline"
            >
              Analyze Your Pipeline Leak <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-3xl border bg-white border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{data.features[2].title}</h3>
            <p className="text-xs leading-relaxed text-slate-500 font-light">
              {data.features[2].description}
            </p>
            <button 
              onClick={() => onNavigate("roster")}
              className="text-[10px] font-mono text-amber-600 font-bold uppercase tracking-wider flex items-center gap-1 hover:underline"
            >
              Explore Active Placements <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Immersive CTA Callouts */}
      <section className="bg-slate-900 text-white py-16 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-4 text-center md:text-left">
            <span className="text-[9px] font-mono text-amber-400 font-bold uppercase tracking-widest bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20">
              ACTIVATE THE LEAK AUDIT TOOL
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold">
              What Is Your Brand&apos;s Estimated Outbound Leakage?
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl font-light">
              Use our live simulation model to compute estimated annual loss based on your DTC category, annual recurring revenue, and Listing optimization score.
            </p>
          </div>
          <div className="md:col-span-4 flex justify-center md:justify-end">
            <button 
              onClick={() => onNavigate("audit")}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono font-bold uppercase text-xs px-8 py-4 rounded-xl tracking-wider transition-all shadow-md hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
            >
              Launch Sandbox Tool <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Case Study Testimonial */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="p-8 sm:p-12 rounded-3xl border bg-white border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-[9px] font-mono text-slate-400 ml-2 font-bold uppercase tracking-widest">VERIFIED SUCCESS RATIO</span>
          </div>

          <blockquote className="text-sm sm:text-lg italic leading-relaxed text-slate-700 font-light">
            &ldquo;{data.testimonial.quote}&rdquo;
          </blockquote>

          <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-xs bg-slate-100 text-blue-600 border border-slate-200">
              {data.testimonial.avatarInitials}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{data.testimonial.author}</p>
              <p className="text-[10px] text-slate-400 font-mono uppercase font-semibold">
                {data.testimonial.role}, <span className="text-slate-700">{data.testimonial.company}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-6 pb-20 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[9px] font-mono tracking-widest font-bold text-slate-400 uppercase">
            OBJECTION-BUSTING REASONS
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
            Frequently Answered Inquiries
          </h2>
        </div>

        <div className="border-t border-slate-200 divide-y divide-slate-200">
          {data.faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div key={index} className="py-4">
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full flex justify-between items-center text-left text-xs sm:text-sm font-display font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer py-2"
                >
                  <span>{faq.question}</span>
                  {isOpen ? <Minus className="w-4 h-4 text-slate-400" /> : <Plus className="w-4 h-4 text-slate-400" />}
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs leading-relaxed mt-2.5 text-slate-500 font-light pl-1">
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

      {/* Final Action Gate */}
      <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <div className="py-16 px-6 sm:px-12 rounded-3xl border-2 border-dashed border-slate-200 bg-white shadow-xs flex flex-col items-center justify-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
            {data.ctaSection.headline}
          </h2>
          <p className="text-xs sm:text-sm max-w-lg mx-auto leading-relaxed text-slate-500 font-light">
            {data.ctaSection.subheadline}
          </p>
          
          {success ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2 max-w-md text-left text-xs text-slate-700 animate-fadeIn">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold text-slate-900 uppercase tracking-wide">Audit Requested!</p>
                <p className="mt-1 leading-relaxed text-slate-600">
                  Our Sr. Closers are compiling your custom leak teardown report. We will reach out to you within 24 hours.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCtaSubmit} className="w-full max-w-md space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your corporate email address" 
                  className="text-xs font-mono px-4 py-3.5 rounded-xl outline-none border w-full text-center sm:text-left bg-slate-50 border-slate-200 focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-800"
                  disabled={submitting}
                />
                <button 
                  type="submit"
                  disabled={submitting}
                  className="text-xs font-mono font-bold px-6 py-3.5 rounded-xl uppercase shrink-0 transition-all cursor-pointer bg-slate-900 hover:bg-slate-800 text-white shadow-md w-full sm:w-auto"
                >
                  {submitting ? "Submitting..." : data.ctaSection.buttonText}
                </button>
              </div>
              {errorMsg && <p className="text-[10px] text-red-600 font-mono text-left">{errorMsg}</p>}
              <p className="text-[10px] text-slate-400 font-mono">
                🔐 Submitting triggers a live operational ticket in our secure client pipeline database.
              </p>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}
