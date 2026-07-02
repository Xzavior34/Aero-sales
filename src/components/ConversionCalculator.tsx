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
    <div className="p-6 sm:p-8 rounded-3xl border transition-all duration-300 bg-white border-slate-200 shadow-sm space-y-6">
      {/* Title & Badge */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[9px] tracking-widest font-mono font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-100">
            DUE DILIGENCE SIMULATION
          </span>
          <span className="flex items-center gap-1 text-[10px] text-amber-600 font-mono font-bold">
            <Sparkles className="w-3 h-3" /> Live Market Audit
          </span>
        </div>
        <h3 className="text-xl font-display font-extrabold text-slate-900">
          Find Your Hidden Brand Revenue Leak
        </h3>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Many direct-to-consumer and professional brands lose up to 40% of their prospective buyer pool simply because they do not occupy key digital marketplaces or have thin, unoptimized listings.
        </p>
      </div>

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
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        />
      </div>

      {/* Input 2: Annual Revenue Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-slate-500 font-bold uppercase tracking-wider">Estimated Annual Revenue (USD)</span>
          <span className="text-sm font-extrabold text-blue-600">${annualRevenue.toLocaleString()}</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min={200000}
            max={10000000}
            step={100000}
            value={annualRevenue}
            onChange={(e) => setAnnualRevenue(Number(e.target.value))}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-slate-100 accent-blue-600 focus:outline-none"
          />
          <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1 uppercase font-semibold">
            <span>$200K</span>
            <span>$5M</span>
            <span>$10M+</span>
          </div>
        </div>
      </div>

      {/* Input 3: Scenario Selection */}
      <div className="space-y-1.5">
        <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
          Market Exposure Status
        </label>
        <select
          value={leakPercentage}
          onChange={(e) => setLeakPercentage(Number(e.target.value))}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
        >
          <option value={0.40}>Completely Missing from Secondary Channels (40% Est. Leak)</option>
          <option value={0.30}>Authorized Wholesalers Controlling Listings (30% Est. Leak)</option>
          <option value={0.20}>Active but Thin Listings/Low Optimization (20% Est. Leak)</option>
        </select>
      </div>

      {/* Calculator Output Display */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-center space-y-1">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">
          Calculated Annual Revenue Leak
        </span>
        <div className="text-3xl font-extrabold text-blue-600 tracking-tight">
          ${calculatedLeak.toLocaleString()} <span className="text-sm font-normal text-slate-500">/yr</span>
        </div>
        <p className="text-[9px] text-slate-500 uppercase tracking-wide">
          Estimated leakage based on market search metrics & category averages
        </p>
      </div>

      {/* Working Lead Capture Form (No fake button!) */}
      <div className="pt-4 border-t border-slate-150">
        {submitSuccess ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-slate-700 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-slate-900 uppercase tracking-wide">Audit Request Sourced!</p>
              <p className="mt-1 leading-relaxed text-slate-600">
                We have registered your audit profile. Our Senior Sales closers are compiling a custom, raw digital channel teardown report for <strong>{brandName}</strong>. Check the Admin Console to view your request status.
              </p>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="mt-3.5 text-[10px] font-mono text-emerald-700 font-bold uppercase hover:underline"
              >
                Calculate Another Leak
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitAudit} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter corporate email for raw report"
                className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                disabled={submitting}
              />
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all whitespace-nowrap flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Request Full Teardown"
                )}
              </button>
            </div>
            {errorMsg && (
              <p className="text-[10px] text-red-600 font-mono flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" /> {errorMsg}
              </p>
            )}
            <p className="text-[10px] text-slate-400 leading-normal">
              🛡️ No fake demos here. Submitting this form creates a live client ticket in our applicant tracking Admin Console pipeline above.
            </p>
          </form>
        )}
      </div>

      <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 text-[11px] leading-relaxed text-slate-500">
        <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-blue-600">Audit Strategy:</span> Outbound setters utilize these exact computations when initiating outreach to 7 and 8-figure brand founders, converting passive attention into scheduled exploration calls instantly.
        </div>
      </div>
    </div>
  );
}
