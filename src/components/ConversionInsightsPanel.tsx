import { useState } from "react";
import { LandingPageData } from "../types";
import { Award, BarChart2, CheckCircle2, ChevronDown, ChevronUp, FileText, HelpCircle, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";

interface ConversionInsightsPanelProps {
  insights: LandingPageData["conversionInsights"];
  productName: string;
}

export function ConversionInsightsPanel({ insights, productName }: ConversionInsightsPanelProps) {
  const [selectedPrinciple, setSelectedPrinciple] = useState<string | null>(null);
  const [isTeardownExpanded, setIsTeardownExpanded] = useState<boolean>(true);

  const getPrincipleDescription = (principle: string) => {
    switch (principle.toLowerCase()) {
      case "loss aversion":
        return "Highlights potential waste, excess fees, or missed opportunities. Users feel a stronger emotional pull to prevent losses than to acquire gains of equal size.";
      case "cost-to-value framing":
        return "Frames the software subscription as an investment or cost-saving mechanism. The purchase pays for itself by directly reducing other major overhead expenses.";
      case "technical authority anchor":
        return "Establishes elite credibility by referencing specific performance specs, architectural designs, and benchmarks. Perfect for highly skeptical technical buyers.";
      case "frictionless self-serve":
        return "Minimizes psychological buy-in thresholds by providing instant trial triggers, straightforward onboarding pathways, and eliminating credit card constraints.";
      case "social proof anchoring":
        return "Leverages peer validation and authority figures within similar roles or sectors to reduce buying anxiety and confirm product efficacy.";
      case "the primacy effect":
        return "Ensures the single most critical claim is presented first in visual layout, as items at the beginning of list structures are recalled best.";
      case "exclusivity anchor":
        return "Uses premium boutique terminology (e.g., 'private invite', 'specimen') to trigger status-seeking behavior, raising conversion intent for high-ticket SaaS.";
      case "aesthetic usability":
        return "Users perceive more aesthetic and visually pleasing designs as significantly more usable, professional, and trustworthy.";
      default:
        return "A recognized cognitive bias or persuasive copy framework applied directly to increase landing page CTRs and establish value transparency.";
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Title */}
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-blue-600" />
          Conversion Intelligence Model
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Predictive analytics and copy architecture audit for {productName}.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-sm">
          <div className="text-[9px] font-mono font-bold text-slate-400 mb-1">PREDICTED CR</div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-mono font-bold text-blue-600">
              {insights.predictedConversionRate}%
            </span>
            <span className="text-[9px] text-blue-500/70 font-mono">avg</span>
          </div>
          <p className="text-[9px] text-slate-500 mt-1 leading-snug">
            3.4x industry baseline
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-sm">
          <div className="text-[9px] font-mono font-bold text-slate-400 mb-1">BOUNCE RATE</div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-mono font-bold text-slate-700">
              {insights.bounceRate}%
            </span>
            <span className="text-[9px] text-slate-500 font-mono">est</span>
          </div>
          <p className="text-[9px] text-slate-500 mt-1 leading-snug">
            High scroll-dwell rate
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-sm">
          <div className="text-[9px] font-mono font-bold text-slate-400 mb-1">TARGET AOV</div>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-mono font-bold text-blue-600 tracking-tight">
              {insights.predictedAov}
            </span>
          </div>
          <p className="text-[9px] text-slate-500 mt-1 leading-snug">
            Premium market segment
          </p>
        </div>
      </div>

      {/* Persuasion Principles list */}
      <div className="space-y-3">
        <div className="text-[10px] font-mono font-bold text-slate-500 flex items-center gap-1.5 uppercase">
          <Award className="w-3.5 h-3.5 text-blue-600" />
          Active Persuasion Principles
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          {insights.principlesUsed.map((principle, index) => {
            const isSelected = selectedPrinciple === principle;
            return (
              <div 
                key={principle} 
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-3 shadow-xs cursor-pointer transition-all hover:bg-slate-50/50"
                onClick={() => setSelectedPrinciple(isSelected ? null : principle)}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    {principle}
                  </span>
                  <HelpCircle className={`w-3.5 h-3.5 text-slate-400 transition-colors ${isSelected ? "text-blue-600" : ""}`} />
                </div>
                {isSelected && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-[11px] text-slate-500 leading-relaxed mt-2 pt-2 border-t border-slate-100"
                  >
                    {getPrincipleDescription(principle)}
                  </motion.p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Copywriter Teardown */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <button
          onClick={() => setIsTeardownExpanded(!isTeardownExpanded)}
          className="w-full flex justify-between items-center p-3.5 bg-slate-50 text-xs font-mono font-bold text-slate-700 hover:text-slate-900 border-b border-slate-100 transition-colors"
        >
          <span className="flex items-center gap-1.5 uppercase">
            <FileText className="w-4 h-4 text-blue-600" />
            CRO Expert Teardown
          </span>
          {isTeardownExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>
        {isTeardownExpanded && (
          <div className="p-4 space-y-3 bg-white">
            <p className="text-xs text-slate-600 leading-relaxed font-sans font-light">
              {insights.editorialTeardown}
            </p>
            <div className="flex gap-2 items-center text-[9px] text-slate-400 font-mono pt-2 border-t border-slate-100">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              Audited by Conversion Architect V1
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
