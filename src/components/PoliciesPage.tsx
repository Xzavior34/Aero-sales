import React from "react";
import { ShieldCheck, Database, Users, Lock, ScrollText, ArrowRight } from "lucide-react";

export function PoliciesPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs">
      
      {/* Policy Page Header */}
      <div className="space-y-3 pb-6 border-b border-slate-100">
        <span className="text-[9px] font-mono tracking-widest font-bold text-blue-600 uppercase inline-flex items-center gap-1.5 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100/60 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
          GOVERNANCE & TRUST PROTOCOLS
        </span>
        <h1 className="text-3xl font-display font-bold tracking-tight text-slate-900">
          Aero Operations Legal & Compliance Policies
        </h1>
        <p className="text-xs leading-relaxed text-slate-500 max-w-2xl font-light">
          Review our architectural and legal policies governing client database segregation, cryptographic safety keys, automated CRM workflows, and remote sourcing standards.
        </p>
      </div>

      {/* Grid of Policies */}
      <div className="space-y-8">
        
        {/* Policy Section 1: DB Row Level Security */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <Database className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              1. Relational Row-Level Security (RLS) Database Policies
            </h2>
          </div>
          <p className="text-xs leading-relaxed text-slate-600 font-light pl-10">
            Aero Sales Operations runs on a highly segregated relational database schema. By enabling Postgres Row-Level Security (RLS), we programmatically prevent unauthorized access to candidate applications, contact databases, and client leakage computations.
          </p>
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 font-mono text-[10.5px] text-slate-700 space-y-3 ml-10">
            <p className="font-bold text-slate-900 uppercase tracking-wider text-[9px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Verified RLS Directives
            </p>
            <pre className="overflow-x-auto whitespace-pre leading-relaxed p-1 bg-white border border-slate-100 rounded-lg">
{`-- Public Access: Allows prospective applicants to submit signups.
CREATE POLICY "Allow public insert-access to applications" 
ON public.applications FOR INSERT WITH CHECK (true);

-- Job Board: Public read-only access to published active listings.
CREATE POLICY "Allow public read-access to jobs" 
ON public.jobs FOR SELECT USING (status = 'active');

-- Administration: Full programmatic CRUD restricted strictly to vetted service-role keys.
CREATE POLICY "Allow full admin access to jobs" 
ON public.jobs ALL USING (auth.role() = 'service_role');`}
            </pre>
          </div>
        </div>

        {/* Policy Section 2: Talent Arbitrage & Remote Sourcing */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
              <Users className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              2. Remote Sourcing & Commission Splits Compliance
            </h2>
          </div>
          <p className="text-xs leading-relaxed text-slate-600 font-light pl-10">
            We are committed to ethical talent sourcing and career representation. Our recruitment pipeline rigorously selects candidates from remote tech hubs (focusing on Nigeria) and trains them in conversational enterprise dynamics. Our placements follow strict transparency agreements:
          </p>
          <ul className="list-disc text-xs text-slate-500 space-y-2.5 pl-14 font-light">
            <li>
              <strong className="text-slate-800">100% Sourced Dedication:</strong> No representative placed inside a client&apos;s GHL account may work concurrently on secondary contracts.
            </li>
            <li>
              <strong className="text-slate-800">Guaranteed Timezone Alignment:</strong> Remote representatives operate in full synchronization with the client&apos;s specified hours (EST, PST, or GMT).
            </li>
            <li>
              <strong className="text-slate-800">Fair Commission Splits:</strong> Representative commissions are paid directly on booked and closed contracts, calculated clearly via the Unified Dashboard metrics.
            </li>
          </ul>
        </div>

        {/* Policy Section 3: Data Protection & Erasure Protocol */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <Lock className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              3. Client Pipeline Data & Erasure Protocols
            </h2>
          </div>
          <p className="text-xs leading-relaxed text-slate-600 font-light pl-10">
            Your corporate contact databases and lead lists remain strictly your proprietary assets. Aero Sales Operations does not license, aggregate, or train algorithms on prospect data processed within your GoHighLevel workspaces.
          </p>
          <div className="p-4 rounded-xl border border-dashed border-rose-200 bg-rose-50/50 flex items-start gap-3 ml-10 text-xs text-slate-700 leading-relaxed font-light">
            <ScrollText className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-rose-950 uppercase tracking-wide block mb-1">DATA ERASURE GUARANTEE</span>
              Clients may request immediate and permanent removal of all submitted applications, audit results, and CRM configuration specs by contacting compliance@aero-operations.ng. Erasure commands are completed inside our databases in under 24 hours.
            </div>
          </div>
        </div>

      </div>

      {/* Footer Disclaimer */}
      <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 font-mono gap-4">
        <span>© {new Date().getFullYear()} Aero Sales Operations. All policies compliant with international ISO/IEC specifications.</span>
        <span className="text-emerald-600 font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> SECURE CONSOLE LIVE
        </span>
      </div>

    </div>
  );
}
