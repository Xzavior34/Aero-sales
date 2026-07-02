import React, { useState } from "react";
import { LandingPageData } from "../types";
import { DollarSign, TrendingUp, Sparkles, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

interface ConversionCalculatorProps {
  config: LandingPageData["calculator"];
  theme: string;
}

export function ConversionCalculator({ config, theme }: ConversionCalculatorProps) {
  const [brandName, setBrandName] = useState<string>("Aero Scale Partner");
  const [annualRevenue, setAnnualRevenue] = useState<number>(2500000);
  const [leakPercentage, setLeakPercentage] = useState<number>(0.40);
  
  // Lead submission states
  const [email, setEmail] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const scenarioTextMap: Record<number, string> = {
    0.40: "Completely Missing from Secondary Channels (40% Est. Leak)",
    0.30: "Authorized Wholesalers Controlling Listings (30% Est. Leak)",
    0.20: "Active but Thin Listings/Low Optimization (20% Est. Leak)"
  };

  const calculatedLeak = Math.round(annualRevenue * leakPercentage);

  const handleSubmitAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg("Please enter a corporate email address.");
      return;
    }
    
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/signups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: `[Audit Lead] ${brandName}`,
          email: email.trim(),
          roleId: "audit-request",
          experience: `Brand: ${brandName} | Est. Annual Revenue: $${annualRevenue.toLocaleString()} | Exposure Scenario: ${scenarioTextMap[leakPercentage]} | Calculated Annual Leak: $${calculatedLeak.toLocaleString()}/yr. Requested full teardown report.`
        })
      });

      if (!res.ok) {
        throw new Error("Unable to save your audit request.");
      }

      setSubmitSuccess(true);
      setEmail("");
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-1 sm:p-2 transition-all duration-300">
      {/* Upper header */}
      <div className="mb-8 border-b border-slate-100 pb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-[9px] tracking-widest font-mono font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
            DUE DILIGENCE ALGORITHM
          </span>
          <span className="flex items-center gap-1 text-[10px] text-amber-600 font-mono font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
            <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" /> Live Pipeline Leak Audit
          </span>
        </div>
        <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">
          Quantify Your Missing Sales Revenue
        </h3>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-2xl font-light">
          Most established brands lose between 20% and 40% of their prospective buyer pool to friction. 
          Use this mathematical due diligence interface to compute exactly how much capital is leaking to alternative options and see how Aero Sales Operations recaptures it.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Audit Parameters (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          <div className="bg-slate-50/60 border border-slate-200/60 rounded-2xl p-5 space-y-5">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              1. Enterprise Diagnostics
            </h4>

            {/* Input 1: Company Name */}
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Company / Brand Name
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. Aero Scale Partner"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-2xs"
              />
            </div>

            {/* Input 2: Annual Revenue Slider */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Estimated Annual Revenue (USD)</span>
                <span className="text-sm font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">${annualRevenue.toLocaleString()}</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min={200000}
                  max={10000000}
                  step={100000}
                  value={annualRevenue}
                  onChange={(e) => setAnnualRevenue(Number(e.target.value))}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-slate-200 accent-blue-600 focus:outline-none"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1.5 uppercase font-semibold">
                  <span>$200K</span>
                  <span>$5M MID-MARKET</span>
                  <span>$10M+ ENTERPRISE</span>
                </div>
              </div>
            </div>

            {/* Input 3: Scenario Selection */}
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Current Sales Pipeline Status
              </label>
              <select
                value={leakPercentage}
                onChange={(e) => setLeakPercentage(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500 transition-colors cursor-pointer shadow-2xs"
              >
                <option value={0.40}>No Sourced Remote Outreach (40% Est. Leak)</option>
                <option value={0.30}>Inconsistent Setters & Poor CRM Habits (30% Est. Leak)</option>
                <option value={0.20}>No Custom Audits & Poor Deal Nurturing (20% Est. Leak)</option>
              </select>
              <p className="text-[10px] text-slate-400 leading-relaxed pt-1">
                {leakPercentage === 0.40 && "⚠️ High Risk: Prospective buyers have no proactive touchpoints from your team, letting easy revenue slip to aggressive competitors."}
                {leakPercentage === 0.30 && "⚠️ Moderate Risk: Remote representatives lack structured oversight, resulting in stalled opportunities and empty calendars."}
                {leakPercentage === 0.20 && "⚠️ Minor Risk: Hard-earned leads are falling cold due to generic automated sequences instead of high-energy human follow-ups."}
              </p>
            </div>
          </div>

          {/* Operational Strategy Card */}
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 space-y-3 shadow-xs border border-slate-800">
            <h4 className="text-[10px] font-mono tracking-widest font-bold text-amber-400 uppercase flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              HOW WE RECAPTURE THIS LEAKAGE
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed font-sans font-light">
              <p>
                We do not believe in generic cold pitches. Our sourced representatives utilize these exact mathematical leaks to trigger real engagement.
              </p>
              <div className="grid grid-cols-2 gap-3.5 pt-1 border-t border-slate-800 text-[11px]">
                <div>
                  <span className="font-bold text-white block">1. Sourced Personnel</span>
                  Rigorously trained Remote Setters placed inside your Slack &amp; CRM.
                </div>
                <div>
                  <span className="font-bold text-white block">2. High-Yield CRM</span>
                  Custom pipelines, sequence building, and daily activity tracking.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calculations & Sourcing Action (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">
                ANNUAL REVENUE LEAK
              </span>
              <span className={`text-[8.5px] font-mono font-bold px-2 py-0.5 rounded-full uppercase border ${
                calculatedLeak >= 2000000 
                  ? "bg-rose-50 text-rose-700 border-rose-200" 
                  : calculatedLeak >= 1000000 
                    ? "bg-amber-50 text-amber-700 border-amber-200" 
                    : "bg-blue-50 text-blue-700 border-blue-200"
              }`}>
                {calculatedLeak >= 2000000 ? "CRITICAL RISK" : calculatedLeak >= 1000000 ? "MODERATE RISK" : "STABILIZABLE"}
              </span>
            </div>

            <div className="space-y-1">
              <div className={`text-4xl font-extrabold tracking-tight transition-colors duration-300 ${
                calculatedLeak >= 2000000 
                  ? "text-rose-600" 
                  : calculatedLeak >= 1000000 
                    ? "text-amber-500" 
                    : "text-blue-600"
              }`}>
                ${calculatedLeak.toLocaleString()}
                <span className="text-xs font-normal text-slate-500 block mt-0.5">Estimated Annual Loss</span>
              </div>
            </div>

            {/* Real-time visual gauge */}
            <div className="space-y-1.5 pt-1">
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    calculatedLeak >= 2000000 
                      ? "bg-rose-600" 
                      : calculatedLeak >= 1000000 
                        ? "bg-amber-500" 
                        : "bg-blue-600"
                  }`}
                  style={{ width: `${Math.min(100, (calculatedLeak / 4000000) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[8px] text-slate-400 font-mono">
                <span>$0 LOSS</span>
                <span>$4.0M EXPOSURE MAX</span>
              </div>
            </div>

            {/* Operational Impact Stats */}
            <div className="grid grid-cols-2 gap-3.5 bg-white border border-slate-200/80 rounded-xl p-3.5 text-left font-mono">
              <div>
                <span className="text-[8px] text-slate-400 uppercase font-bold block">Monthly Friction</span>
                <span className="text-xs font-bold text-slate-800">${Math.round(calculatedLeak / 12).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[8px] text-slate-400 uppercase font-bold block">Estimated Lost Deals</span>
                <span className="text-xs font-bold text-slate-800">~{Math.round(calculatedLeak / 30000)} / year</span>
              </div>
            </div>

            {/* Working Lead Capture Form (No fake button!) */}
            <div className="pt-4 border-t border-slate-200">
              {submitSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-slate-700 animate-fadeIn">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-slate-900 uppercase tracking-wide">Audit Requested!</p>
                    <p className="mt-1 leading-relaxed text-slate-600">
                      We have received your diagnostics request. An outbound operations specialist is compiling a custom, raw digital channel teardown report for <strong>{brandName}</strong>. We will reach out to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitSuccess(false)}
                      className="mt-3 text-[10px] font-mono text-emerald-700 font-bold uppercase hover:underline"
                    >
                      Calculate New Scenario
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitAudit} className="space-y-3.5">
                  <p className="text-[10px] text-slate-500 leading-snug">
                    Enter your corporate email below to schedule a live audit and receive a customized digital pipeline teardown report.
                  </p>
                  <div className="space-y-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter corporate email..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-2xs"
                      disabled={submitting}
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-slate-950 hover:bg-slate-800 text-white font-mono font-bold py-3 px-4 rounded-xl text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Scheduling Audit...
                        </>
                      ) : (
                        "Request Custom Audit"
                      )}
                    </button>
                  </div>
                  {errorMsg && (
                    <p className="text-[10px] text-red-600 font-mono flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" /> {errorMsg}
                    </p>
                  )}
                  <p className="text-[9px] text-slate-400 leading-normal text-center">
                    🔐 Triggering this form logs a verified CRM ticket. No mock inputs or marketing spam.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
