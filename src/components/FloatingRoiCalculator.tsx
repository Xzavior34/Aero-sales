import React, { useState } from "react";
import { 
  Calculator, 
  X, 
  TrendingUp, 
  Sparkles, 
  DollarSign, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Briefcase, 
  ArrowRight,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FloatingRoiCalculatorProps {
  onNavigate?: (page: "home" | "roster" | "audit" | "admin" | "policies") => void;
  isInline?: boolean;
}

export function FloatingRoiCalculator({ onNavigate, isInline = false }: FloatingRoiCalculatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Core Parameters
  const [leads, setLeads] = useState<number>(500);
  const [dealSize, setDealSize] = useState<number>(5000);
  
  // Advanced Calibration Defaults
  const [currentBookingRate, setCurrentBookingRate] = useState<number>(3); // 3%
  const [currentShowRate, setCurrentShowRate] = useState<number>(60); // 60%
  const [currentCloseRate, setCurrentCloseRate] = useState<number>(10); // 10%

  const [aeroBookingRate, setAeroBookingRate] = useState<number>(6); // 6%
  const [aeroShowRate, setAeroShowRate] = useState<number>(75); // 75%
  const [aeroCloseRate, setAeroCloseRate] = useState<number>(20); // 20%

  // Lead Submission
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Calculations
  const currentMeetingsBooked = leads * (currentBookingRate / 100);
  const currentMeetingsHeld = currentMeetingsBooked * (currentShowRate / 100);
  const currentClosedDeals = currentMeetingsHeld * (currentCloseRate / 100);
  const currentMonthlyRevenue = currentClosedDeals * dealSize;

  const aeroMeetingsBooked = leads * (aeroBookingRate / 100);
  const aeroMeetingsHeld = aeroMeetingsBooked * (aeroShowRate / 100);
  const aeroClosedDeals = aeroMeetingsHeld * (aeroCloseRate / 100);
  const aeroMonthlyRevenue = aeroClosedDeals * dealSize;

  const monthlyLift = Math.max(0, aeroMonthlyRevenue - currentMonthlyRevenue);
  const annualLift = monthlyLift * 12;
  const meetingsLift = Math.max(0, aeroMeetingsHeld - currentMeetingsHeld);
  const closedDealsLift = Math.max(0, aeroClosedDeals - currentClosedDeals);

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !fullName.trim()) {
      setErrorMsg("Please provide your full name and corporate email.");
      return;
    }
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/signups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          roleId: "roi-calculator-lead",
          experience: `ROI Calculator Lead Submission:
- Monthly Leads: ${leads}
- Avg Deal Value: $${dealSize.toLocaleString()}
- Baseline System Output: ${currentMeetingsHeld.toFixed(1)} held meetings, ${currentClosedDeals.toFixed(1)} closed deals, $${Math.round(currentMonthlyRevenue).toLocaleString()}/mo
- Aero Sourced Output: ${aeroMeetingsHeld.toFixed(1)} held meetings, ${aeroClosedDeals.toFixed(1)} closed deals, $${Math.round(aeroMonthlyRevenue).toLocaleString()}/mo
- Estimated Monthly Revenue Lift: +$${Math.round(monthlyLift).toLocaleString()}/mo
- Estimated Annual Revenue Lift: +$${Math.round(annualLift).toLocaleString()}/yr
- Additional Held Meetings: +${meetingsLift.toFixed(1)}/mo`
        })
      });

      if (!response.ok) {
        throw new Error("Unable to submit metrics. Please try again.");
      }

      setIsSuccess(true);
      setEmail("");
      setFullName("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit lead data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isInline) {
    return (
      <div
        id="roi-expanded-panel-inline"
        className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden flex flex-col font-sans w-full"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400">
              <TrendingUp className="w-4.5 h-4.5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono font-black text-amber-400 uppercase tracking-widest bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                  VALUE MODEL
                </span>
                <span className="text-[9px] text-emerald-400 font-mono font-bold flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" /> EST. REVENUE LIFT
                </span>
              </div>
              <h3 className="text-sm font-bold tracking-tight text-white mt-1">Aero Outbound ROI Lift Calculator</h3>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          <p className="text-[11.5px] text-slate-500 leading-relaxed font-light">
            Compute the exact monthly and annualized revenue delta recaptured when you switch from static forms to Aero&apos;s sifting appointment setters & high-close remote closers.
          </p>

          {/* Main Leads Slider */}
          <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <span>Leads per Month</span>
                <Info className="w-3 h-3 text-slate-400" />
              </label>
              <div className="flex items-center gap-2">
                <input 
                  type="number"
                  min="50"
                  max="10000"
                  value={leads}
                  onChange={(e) => setLeads(Math.max(1, Number(e.target.value)))}
                  className="w-16 px-1.5 py-0.5 border border-slate-200 text-center font-mono text-xs font-bold rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Leads</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                value={leads}
                onChange={(e) => setLeads(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600 focus:outline-none"
              />
              <div className="flex justify-between text-[9px] font-mono font-bold text-slate-400">
                <span>50 LEADS</span>
                <span>1,000</span>
                <span>2,500</span>
                <span>5,000+</span>
              </div>
            </div>
          </div>

          {/* Primary Metric results board */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-2xl text-center space-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-12 h-12 bg-amber-500/5 rounded-bl-full pointer-events-none" />
              <span className="text-[9px] font-mono font-extrabold text-amber-800 uppercase tracking-wider block">EST. MONTHLY LIFT</span>
              <p className="text-xl sm:text-2xl font-mono font-black text-slate-900 tracking-tight">
                +${Math.round(monthlyLift).toLocaleString()}
              </p>
              <span className="text-[8.5px] font-mono text-slate-400 block">
                +{closedDealsLift.toFixed(1)} Closed Deals /mo
              </span>
            </div>

            <div className="bg-slate-900 text-white p-4 rounded-2xl text-center space-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-12 h-12 bg-amber-500/10 rounded-bl-full pointer-events-none" />
              <span className="text-[9px] font-mono font-extrabold text-amber-400 uppercase tracking-wider block">EST. ANNUAL REVENUE LIFT</span>
              <p className="text-xl sm:text-2xl font-mono font-black text-amber-400 tracking-tight">
                +${Math.round(annualLift).toLocaleString()}
              </p>
              <span className="text-[8.5px] font-mono text-slate-300 block">
                +{meetingsLift.toFixed(0)} Held Meetings /mo
              </span>
            </div>
          </div>

          {/* Collapsible Advanced Parameters */}
          <div className="border border-slate-150 rounded-2xl overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full px-4 py-3 bg-slate-50/80 hover:bg-slate-50 flex justify-between items-center text-left transition-colors cursor-pointer border-b border-slate-150"
            >
              <span className="text-[10px] font-mono font-extrabold text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                Advanced Calibration Parameters
              </span>
              {showAdvanced ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>

            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-4 text-xs divide-y divide-slate-100">
                    {/* Deal Size */}
                    <div className="space-y-2 pt-1">
                      <div className="flex justify-between font-mono text-[10px] font-bold text-slate-500">
                        <span>AVG CONTRACT VALUE / DEAL SIZE</span>
                        <span className="text-amber-600 font-extrabold">${dealSize.toLocaleString()}</span>
                      </div>
                      <input
                        type="range"
                        min="1000"
                        max="30000"
                        step="500"
                        value={dealSize}
                        onChange={(e) => setDealSize(Number(e.target.value))}
                        className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-700"
                      />
                    </div>

                    {/* Close Rate Tuning */}
                    <div className="space-y-3 pt-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <span className="text-[8.5px] font-mono text-slate-400 uppercase font-bold block">CURRENT CLOSING %</span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={currentCloseRate}
                              onChange={(e) => setCurrentCloseRate(Math.min(100, Math.max(1, Number(e.target.value))))}
                              className="w-12 p-1 font-mono text-center font-bold border border-slate-200 rounded text-slate-700"
                            />
                            <span className="text-[10px] text-slate-400 font-mono">%</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[8.5px] font-mono text-slate-400 uppercase font-bold block">AERO CLOSER CLOSE %</span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={aeroCloseRate}
                              onChange={(e) => setAeroCloseRate(Math.min(100, Math.max(1, Number(e.target.value))))}
                              className="w-12 p-1 font-mono text-center font-bold border border-slate-200 rounded text-amber-600 bg-amber-50/50"
                            />
                            <span className="text-[10px] text-slate-400 font-mono">%</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-[9.5px] text-slate-400 leading-tight italic">
                        Aero Remote Closers typically deliver a stable 18% - 25% close rate due to continuous script audits and automated buyer nurturing.
                      </p>
                    </div>

                    {/* Advanced Setter Funnel */}
                    <div className="space-y-3 pt-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[8.5px] font-mono text-slate-400 uppercase font-bold block">SETTER BOOKING RATE</span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              step="0.5"
                              min="0.5"
                              max="30"
                              value={aeroBookingRate}
                              onChange={(e) => setAeroBookingRate(Number(e.target.value))}
                              className="w-12 p-1 font-mono text-center font-bold border border-slate-200 rounded text-slate-700"
                            />
                            <span className="text-[10px] text-slate-400 font-mono">%</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[8.5px] font-mono text-slate-400 uppercase font-bold block">SETTER SHOW-UP RATE</span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={aeroShowRate}
                              onChange={(e) => setAeroShowRate(Math.min(100, Math.max(1, Number(e.target.value))))}
                              className="w-12 p-1 font-mono text-center font-bold border border-slate-200 rounded text-slate-700"
                            />
                            <span className="text-[10px] text-slate-400 font-mono">%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Live Comparison Breakdown */}
          <div className="bg-slate-900 text-slate-200 p-4.5 rounded-2xl font-mono text-[10px] space-y-2.5 shadow-sm">
            <p className="text-amber-400 font-extrabold border-b border-slate-800 pb-1.5 uppercase tracking-wider text-[8.5px]">
              Pipeline Efficiency Breakdown ({leads} Leads)
            </p>
            <div className="flex justify-between">
              <span className="text-slate-400">Baseline Appointments Booked:</span>
              <span className="text-slate-200">{Math.round(currentMeetingsBooked)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Baseline Meetings Held:</span>
              <span className="text-slate-200">{Math.round(currentMeetingsHeld)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Baseline Monthly Revenue:</span>
              <span className="text-slate-300 font-bold">${Math.round(currentMonthlyRevenue).toLocaleString()}</span>
            </div>
            <div className="border-t border-slate-800 my-1 pt-1.5 flex justify-between text-amber-300 font-bold">
              <span>Aero Optimised Revenue:</span>
              <span>${Math.round(aeroMonthlyRevenue).toLocaleString()} /mo</span>
            </div>
            <p className="text-[8px] text-slate-500 font-sans italic leading-tight">
              *Our calculations assume baseline metrics of {currentBookingRate}% booking rate, {currentShowRate}% show-up rate, and {currentCloseRate}% close rate. Aero outbound representatives double these numbers.
            </p>
          </div>

          {/* Lead Capture form within card */}
          <div className="border-t border-slate-100 pt-5 space-y-3">
            <div className="text-center space-y-1">
              <span className="text-[8px] font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                SECURE YOUR PIPELINE LIFT
              </span>
              <h4 className="text-[12px] font-bold text-slate-800">Lock In Sourced Representative Search</h4>
              <p className="text-[10px] text-slate-400 font-light leading-snug">
                Submit these computed pipeline target metrics to trigger a prioritized talent search with Aero Sales Operations.
              </p>
            </div>

            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-emerald-50 border border-emerald-150 rounded-2xl text-center text-xs text-emerald-800 space-y-2"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-sm">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <p className="font-bold">Operational Ticket Generated!</p>
                <p className="text-[10px] text-slate-500 font-light leading-relaxed">
                  Aero&apos;s managing partner has queued your {leads}-lead diagnostic. We will contact you at your corporate address.
                </p>
                {onNavigate && (
                  <button
                    onClick={() => onNavigate("admin")}
                    className="mt-2 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[9.5px] font-bold uppercase rounded-xl transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1"
                  >
                    View inside Admin Console &rarr;
                  </button>
                )}
              </motion.div>
            ) : (
              <form onSubmit={handleSubmitLead} className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 text-[11px] font-mono px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 outline-none focus:bg-white focus:border-amber-500 transition-colors"
                    disabled={isSubmitting}
                  />
                  <input
                    type="email"
                    required
                    placeholder="Corporate Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 text-[11px] font-mono px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 outline-none focus:bg-white focus:border-amber-500 transition-colors"
                    disabled={isSubmitting}
                  />
                </div>

                {errorMsg && (
                  <p className="text-[9px] font-mono text-red-500 text-center">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white hover:text-amber-400 text-[10px] font-mono font-extrabold uppercase rounded-xl transition-all cursor-pointer shadow-md hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-1"
                >
                  {isSubmitting ? "Generating Ticket..." : "Deploy Elite Representative"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Nav Hint */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 shrink-0">
          <span className="font-mono">VERIFIED FORMULA V3.9</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Floating Pill Trigger */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          id="roi-float-trigger"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 font-mono text-[11px] font-extrabold uppercase px-4.5 py-3.5 rounded-full shadow-2xl border border-slate-700/60 transition-all cursor-pointer group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          layoutId="roi-card-layout"
        >
          <div className="relative flex items-center justify-center">
            <Calculator className="w-4 h-4 text-amber-500 animate-pulse group-hover:rotate-12 transition-transform duration-200" />
            <span className="absolute -top-1.5 -right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="absolute -top-1.5 -right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <span>Calculate ROI Lift</span>
          <span className="bg-amber-500/15 text-amber-400 border border-amber-500/20 text-[9px] px-1.5 py-0.5 rounded-md font-sans">
            +${Math.round(annualLift / 1000)}k/yr
          </span>
        </motion.button>
      </div>

      {/* Expanded ROI Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-2xs z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-6 pointer-events-none">
            <motion.div
              id="roi-expanded-panel"
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 150, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-white border border-slate-200/90 w-full sm:w-[460px] max-h-[90vh] sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-3xl overflow-y-auto relative pointer-events-auto flex flex-col font-sans"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white rounded-t-3xl sm:rounded-t-[23px] shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400">
                    <TrendingUp className="w-4.5 h-4.5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono font-black text-amber-400 uppercase tracking-widest bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                        VALUE MODEL
                      </span>
                      <span className="text-[9px] text-emerald-400 font-mono font-bold flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" /> EST. REVENUE LIFT
                      </span>
                    </div>
                    <h3 className="text-sm font-bold tracking-tight text-white mt-1">Aero Outbound ROI Lift Calculator</h3>
                  </div>
                </div>
                <button
                  id="close-roi-calculator"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-5 overflow-y-auto flex-1 scrollbar-thin">
                <p className="text-[11.5px] text-slate-500 leading-relaxed font-light">
                  Compute the exact monthly and annualized revenue delta recaptured when you switch from static forms to Aero&apos;s sifting appointment setters & high-close remote closers.
                </p>

                {/* Main Leads Slider */}
                <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <span>Leads per Month</span>
                      <Info className="w-3 h-3 text-slate-400" title="Total inbound/outbound leads generated" />
                    </label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number"
                        min="50"
                        max="10000"
                        value={leads}
                        onChange={(e) => setLeads(Math.max(1, Number(e.target.value)))}
                        className="w-16 px-1.5 py-0.5 border border-slate-200 text-center font-mono text-xs font-bold rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                      />
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Leads</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <input
                      type="range"
                      min="50"
                      max="5000"
                      step="50"
                      value={leads}
                      onChange={(e) => setLeads(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600 focus:outline-none"
                    />
                    <div className="flex justify-between text-[9px] font-mono font-bold text-slate-400">
                      <span>50 LEADS</span>
                      <span>1,000</span>
                      <span>2,500</span>
                      <span>5,000+</span>
                    </div>
                  </div>
                </div>

                {/* Primary Metric results board */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-2xl text-center space-y-1 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-12 h-12 bg-amber-500/5 rounded-bl-full pointer-events-none" />
                    <span className="text-[9px] font-mono font-extrabold text-amber-800 uppercase tracking-wider block">EST. MONTHLY LIFT</span>
                    <p className="text-xl sm:text-2xl font-mono font-black text-slate-900 tracking-tight">
                      +${Math.round(monthlyLift).toLocaleString()}
                    </p>
                    <span className="text-[8.5px] font-mono text-slate-400 block">
                      +{closedDealsLift.toFixed(1)} Closed Deals /mo
                    </span>
                  </div>

                  <div className="bg-slate-900 text-white p-4 rounded-2xl text-center space-y-1 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-12 h-12 bg-amber-500/10 rounded-bl-full pointer-events-none" />
                    <span className="text-[9px] font-mono font-extrabold text-amber-400 uppercase tracking-wider block">EST. ANNUAL REVENUE LIFT</span>
                    <p className="text-xl sm:text-2xl font-mono font-black text-amber-400 tracking-tight">
                      +${Math.round(annualLift).toLocaleString()}
                    </p>
                    <span className="text-[8.5px] font-mono text-slate-300 block">
                      +{meetingsLift.toFixed(0)} Held Meetings /mo
                    </span>
                  </div>
                </div>

                {/* Collapsible Advanced Parameters */}
                <div className="border border-slate-150 rounded-2xl overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full px-4 py-3 bg-slate-50/80 hover:bg-slate-50 flex justify-between items-center text-left transition-colors cursor-pointer border-b border-slate-150"
                  >
                    <span className="text-[10px] font-mono font-extrabold text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                      Advanced Calibration Parameters
                    </span>
                    {showAdvanced ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </button>

                  <AnimatePresence>
                    {showAdvanced && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 space-y-4 text-xs divide-y divide-slate-100">
                          {/* Deal Size */}
                          <div className="space-y-2 pt-1">
                            <div className="flex justify-between font-mono text-[10px] font-bold text-slate-500">
                              <span>AVG CONTRACT VALUE / DEAL SIZE</span>
                              <span className="text-amber-600 font-extrabold">${dealSize.toLocaleString()}</span>
                            </div>
                            <input
                              type="range"
                              min="1000"
                              max="30000"
                              step="500"
                              value={dealSize}
                              onChange={(e) => setDealSize(Number(e.target.value))}
                              className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-700"
                            />
                          </div>

                          {/* Close Rate Tuning */}
                          <div className="space-y-3 pt-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <span className="text-[8.5px] font-mono text-slate-400 uppercase font-bold block">CURRENT CLOSING %</span>
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={currentCloseRate}
                                    onChange={(e) => setCurrentCloseRate(Math.min(100, Math.max(1, Number(e.target.value))))}
                                    className="w-12 p-1 font-mono text-center font-bold border border-slate-200 rounded text-slate-700"
                                  />
                                  <span className="text-[10px] text-slate-400 font-mono">%</span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[8.5px] font-mono text-slate-400 uppercase font-bold block">AERO CLOSER CLOSE %</span>
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={aeroCloseRate}
                                    onChange={(e) => setAeroCloseRate(Math.min(100, Math.max(1, Number(e.target.value))))}
                                    className="w-12 p-1 font-mono text-center font-bold border border-slate-200 rounded text-amber-600 bg-amber-50/50"
                                  />
                                  <span className="text-[10px] text-slate-400 font-mono">%</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-[9.5px] text-slate-400 leading-tight italic">
                              Aero Remote Closers typically deliver a stable 18% - 25% close rate due to continuous script audits and automated buyer nurturing.
                            </p>
                          </div>

                          {/* Advanced Setter Funnel */}
                          <div className="space-y-3 pt-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <span className="text-[8.5px] font-mono text-slate-400 uppercase font-bold block">SETTER BOOKING RATE</span>
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    step="0.5"
                                    min="0.5"
                                    max="30"
                                    value={aeroBookingRate}
                                    onChange={(e) => setAeroBookingRate(Number(e.target.value))}
                                    className="w-12 p-1 font-mono text-center font-bold border border-slate-200 rounded text-slate-700"
                                  />
                                  <span className="text-[10px] text-slate-400 font-mono">%</span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[8.5px] font-mono text-slate-400 uppercase font-bold block">SETTER SHOW-UP RATE</span>
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={aeroShowRate}
                                    onChange={(e) => setAeroShowRate(Math.min(100, Math.max(1, Number(e.target.value))))}
                                    className="w-12 p-1 font-mono text-center font-bold border border-slate-200 rounded text-slate-700"
                                  />
                                  <span className="text-[10px] text-slate-400 font-mono">%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Live Comparison Breakdown */}
                <div className="bg-slate-900 text-slate-200 p-4.5 rounded-2xl font-mono text-[10px] space-y-2.5 shadow-sm">
                  <p className="text-amber-400 font-extrabold border-b border-slate-800 pb-1.5 uppercase tracking-wider text-[8.5px]">
                    Pipeline Efficiency Breakdown ({leads} Leads)
                  </p>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Baseline Appointments Booked:</span>
                    <span className="text-slate-200">{Math.round(currentMeetingsBooked)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Baseline Meetings Held:</span>
                    <span className="text-slate-200">{Math.round(currentMeetingsHeld)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Baseline Monthly Revenue:</span>
                    <span className="text-slate-300 font-bold">${Math.round(currentMonthlyRevenue).toLocaleString()}</span>
                  </div>
                  <div className="border-t border-slate-800 my-1 pt-1.5 flex justify-between text-amber-300 font-bold">
                    <span>Aero Optimised Revenue:</span>
                    <span>${Math.round(aeroMonthlyRevenue).toLocaleString()} /mo</span>
                  </div>
                  <p className="text-[8px] text-slate-500 font-sans italic leading-tight">
                    *Our calculations assume baseline metrics of {currentBookingRate}% booking rate, {currentShowRate}% show-up rate, and {currentCloseRate}% close rate. Aero outbound representatives double these numbers.
                  </p>
                </div>

                {/* Lead Capture form within card */}
                <div className="border-t border-slate-100 pt-5 space-y-3">
                  <div className="text-center space-y-1">
                    <span className="text-[8px] font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                      SECURE YOUR PIPELINE LIFT
                    </span>
                    <h4 className="text-[12px] font-bold text-slate-800">Lock In Sourced Representative Search</h4>
                    <p className="text-[10px] text-slate-400 font-light leading-snug">
                      Submit these computed pipeline target metrics to trigger a prioritized talent search with Aero Sales Operations.
                    </p>
                  </div>

                  {isSuccess ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-emerald-50 border border-emerald-150 rounded-2xl text-center text-xs text-emerald-800 space-y-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-sm">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                      <p className="font-bold">Operational Ticket Generated!</p>
                      <p className="text-[10px] text-slate-500 font-light leading-relaxed">
                        Aero&apos;s managing partner has queued your {leads}-lead diagnostic. We will contact you at your corporate address.
                      </p>
                      {onNavigate && (
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            onNavigate("admin");
                          }}
                          className="mt-2 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[9.5px] font-bold uppercase rounded-xl transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1"
                        >
                          View inside Admin Console &rarr;
                        </button>
                      )}
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmitLead} className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-slate-50 text-[11px] font-mono px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 outline-none focus:bg-white focus:border-amber-500 transition-colors"
                          disabled={isSubmitting}
                        />
                        <input
                          type="email"
                          required
                          placeholder="Corporate Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-slate-50 text-[11px] font-mono px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 outline-none focus:bg-white focus:border-amber-500 transition-colors"
                          disabled={isSubmitting}
                        />
                      </div>

                      {errorMsg && (
                        <p className="text-[9px] font-mono text-red-500 text-center">{errorMsg}</p>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white hover:text-amber-400 text-[10px] font-mono font-extrabold uppercase rounded-xl transition-all cursor-pointer shadow-md hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-1"
                      >
                        {isSubmitting ? "Generating Ticket..." : "Deploy Elite Representative"}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Bottom Nav Hint */}
              <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 shrink-0">
                <span className="font-mono">VERIFIED FORMULA V3.9</span>
                {onNavigate && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onNavigate("audit");
                    }}
                    className="text-amber-700 hover:text-amber-800 font-mono font-bold uppercase tracking-wider underline cursor-pointer"
                  >
                    Launch Full Sandbox Tool
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
