import React, { useState, useEffect } from "react";
import { Role, Signup } from "../types";
import { 
  Users, 
  Briefcase, 
  Plus, 
  Search, 
  Loader2, 
  CheckCircle, 
  Clock, 
  Send, 
  Check, 
  TrendingUp, 
  X,
  FileText,
  Bookmark,
  Building,
  Info,
  Lock,
  Download,
  Database,
  ArrowRight,
  ShieldCheck,
  Eye,
  Trash2,
  Sliders,
  Sparkles
} from "lucide-react";

interface AdminConsoleProps {
  onRoleAdded?: () => void;
}

export function AdminConsole({ onRoleAdded }: AdminConsoleProps) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("cro_admin_authed") === "true";
  });
  const [passcode, setPasscode] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);

  // Database Connection State
  const [dbStatus, setDbStatus] = useState<{ configured: boolean; url: string | null; sqlInstructions: string }>({
    configured: false,
    url: null,
    sqlInstructions: ""
  });
  const [showSqlDoc, setShowSqlDoc] = useState<boolean>(false);

  // Primary Data State
  const [signups, setSignups] = useState<Signup[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Form State for new Role
  const [roleTitle, setRoleTitle] = useState<string>("");
  const [roleDept, setRoleDept] = useState<string>("");
  const [roleDesc, setRoleDesc] = useState<string>("");
  const [roleReqs, setRoleReqs] = useState<string>("");
  const [roleStatus, setRoleStatus] = useState<"active" | "draft">("active");
  const [formSuccess, setFormSuccess] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch all jobs, applications, and Supabase status
  const fetchData = async () => {
    try {
      setLoading(true);
      const [signupsRes, rolesRes, statusRes] = await Promise.all([
        fetch("/api/signups"),
        fetch("/api/roles"),
        fetch("/api/supabase-status")
      ]);
      
      const signupsData = await signupsRes.json();
      const rolesData = await rolesRes.json();
      const statusData = await statusRes.json();
      
      setSignups(signupsData);
      setRoles(rolesData);
      setDbStatus(statusData);
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Handle Authenticator Passcode Submit
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "admin") {
      setIsAuthenticated(true);
      localStorage.setItem("cro_admin_authed", "true");
      setAuthError(null);
    } else {
      setAuthError("Invalid administration key code. Try 'admin'.");
    }
  };

  // Sign out
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("cro_admin_authed");
  };

  // Create or draft a new Role
  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleTitle.trim() || !roleDept.trim() || !roleDesc.trim()) {
      setFormError("All primary fields are required to draft or publish a role.");
      return;
    }

    setSubmitting(true);
    setFormError(null);
    setFormSuccess(false);

    try {
      const requirementsArray = roleReqs
        .split(",")
        .map(req => req.trim())
        .filter(Boolean);

      const res = await fetch("/api/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: roleTitle,
          department: roleDept,
          description: roleDesc,
          requirements: requirementsArray,
          status: roleStatus
        })
      });

      if (!res.ok) {
        throw new Error("Server rejected role publishing protocol.");
      }

      setRoleTitle("");
      setRoleDept("");
      setRoleDesc("");
      setRoleReqs("");
      setRoleStatus("active");
      setFormSuccess(true);
      
      // Refresh local roles list
      await fetchData();
      if (onRoleAdded) onRoleAdded();

      setTimeout(() => setFormSuccess(false), 4000);
    } catch (err: any) {
      setFormError(err.message || "Failed to submit role design.");
    } finally {
      setSubmitting(false);
    }
  };

  // Close or toggle Job status
  const handleUpdateJobStatus = async (jobId: string, newStatus: "active" | "draft" | "closed") => {
    try {
      const res = await fetch(`/api/roles/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) {
        throw new Error("Failed to update role status on server.");
      }

      // Refresh listings
      await fetchData();
      if (onRoleAdded) onRoleAdded();
    } catch (error) {
      console.error("Job status update error:", error);
    }
  };

  // Update Applicant Tracking Status (Applied -> Interviewing -> Hired, etc.)
  const handleUpdateApplicantStatus = async (appId: string, newStatus: Signup["status"]) => {
    try {
      // Optimistic client update for real-time responsiveness
      setSignups(prev => prev.map(s => s.id === appId ? { ...s, status: newStatus } : s));

      const res = await fetch(`/api/signups/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) {
        throw new Error("Failed to persist applicant status.");
      }
    } catch (error) {
      console.error("Applicant status update error, rolling back:", error);
      // Rollback
      fetchData();
    }
  };

  // Handle Export Applicant CSV trigger
  const handleExportData = () => {
    // Navigate directly to the download stream
    window.location.href = "/api/signups/export";
  };

  // Filter Applicants
  const filteredSignups = signups.filter(signup => {
    const matchesSearch = 
      signup.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      signup.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      signup.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (signup.experience || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || signup.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Render Login Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[500px] flex items-center justify-center py-16 px-4 font-sans bg-[#F8FAFC]">
        <div className="w-full max-w-md bg-white border border-slate-200 shadow-2xl rounded-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100 shadow-xs">
              <Lock className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-display font-bold tracking-tight text-slate-900 uppercase">
              MERCURY // SECURE ACCESS
            </h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Enter secure cryptographic passcode to verify credentials and unlock client talent pipelines.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                ADMIN ACCESS PASSCODE
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter administrator passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 text-xs text-slate-800 p-3.5 pl-4 rounded-xl outline-none transition-all text-center tracking-widest font-mono"
                  autoFocus
                />
              </div>
            </div>

            {authError && (
              <div className="p-3.5 bg-red-50 border border-red-150 rounded-xl text-center text-[10.5px] text-red-700 flex justify-center items-center gap-1.5 font-mono">
                <X className="w-4 h-4 text-red-600 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              Verify Passcode <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 font-mono">
              💡 Demodemo? Use the access key <span className="font-semibold text-blue-600 select-all font-bold">admin</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-8 font-sans bg-[#F8FAFC] text-slate-800 min-h-full">
      
      {/* Admin HUD Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-[9px] tracking-widest font-mono text-blue-700 font-bold px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 uppercase inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            SYSTEM VERIFIED • ADMINISTRATION CONSOLE
          </span>
          <h2 className="text-xl font-display font-bold mt-2 text-slate-900">
            Mercury Talent Acquisition Console
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time management for SaaS job listings, candidate statuses, and Supabase telemetry integrations.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={fetchData}
            className="text-xs font-mono font-bold bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" /> : null}
            Refresh Secure Data
          </button>
          <button 
            onClick={handleLogout}
            className="text-xs font-mono font-bold bg-slate-50 hover:bg-slate-100 text-slate-600 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Lock Dashboard
          </button>
        </div>
      </div>

      {/* Database Connection telemetry widget */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${dbStatus.configured ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">DATABASE SYSTEM INTEGRATION</span>
              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${dbStatus.configured ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                {dbStatus.configured ? "SUPABASE DEPLOYED" : "LOCAL IN-MEMORY ENGINE"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              {dbStatus.configured 
                ? `Successfully tunnelled through Express API proxy to live Supabase cluster: ${dbStatus.url}`
                : "Active using client in-memory database fallback. Data persists during server runtime."}
            </p>
          </div>
        </div>
        
        <div>
          <button
            onClick={() => setShowSqlDoc(!showSqlDoc)}
            className="text-[10px] font-mono font-bold text-blue-700 hover:text-blue-800 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-150 flex items-center gap-1 cursor-pointer"
          >
            {showSqlDoc ? "Hide Setup Scripts" : "Show SQL Setup Script"}
          </button>
        </div>
      </div>

      {/* Database Documentation Schema Container */}
      {showSqlDoc && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-inner">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">SUPABASE TABLE PREPARATION SCHEMAS</span>
            <span className="text-[9px] font-mono text-emerald-400">POSTGRESQL / RLS STANDARD</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Run the following SQL inside your Supabase project&apos;s SQL Editor to set up tables with correct typing and default row security policies.
          </p>
          <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-[10px] rounded-xl overflow-x-auto max-h-56 border border-slate-800/80">
            {dbStatus.sqlInstructions}
          </pre>
          <p className="text-[10px] text-slate-500 font-mono italic">
            Once tables are created, configure the <span className="text-blue-400">SUPABASE_URL</span> and <span className="text-blue-400">SUPABASE_ANON_KEY</span> secrets in the AI Studio platform to instantly synchronize live candidates.
          </p>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Applied (Raw Flow)</p>
            <p className="text-2xl font-mono font-bold text-blue-600 mt-1">
              {signups.filter(s => s.status === "applied").length}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Initial candidate review</p>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Interviewing</p>
            <p className="text-2xl font-mono font-bold text-amber-500 mt-1">
              {signups.filter(s => s.status === "interviewing").length}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Under technical audit</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-500 border border-amber-100">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Hired</p>
            <p className="text-2xl font-mono font-bold text-emerald-600 mt-1">
              {signups.filter(s => s.status === "hired").length}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Contracts dispatched</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Active Open Jobs</p>
            <p className="text-2xl font-mono font-bold text-slate-800 mt-1">
              {roles.filter(r => r.status === "active").length}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Listed on homepage</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 text-slate-600 border border-slate-100">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Post Role Form vs Applicants List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COMPONENT: Post new Role (Lg: 5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="pb-3 border-b border-slate-150">
              <h3 className="text-xs font-mono font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                <Plus className="w-4 h-4 text-blue-600" />
                CREATE / DRAFT JOB POSTING
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Register a newly structured vacancy to the interactive career matrix instantly.
              </p>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-4">
              {/* Title */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Role Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Principal Systems Architect (Rust)"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 text-xs text-slate-800 p-3 rounded-xl outline-none transition-all"
                />
              </div>

              {/* Department */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Department</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Platform Core & Edge Infrastructure"
                  value={roleDept}
                  onChange={(e) => setRoleDept(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 text-xs text-slate-800 p-3 rounded-xl outline-none transition-all"
                />
              </div>

              {/* Status Segmented Picker */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Publish Status</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRoleStatus("active")}
                    className={`py-2 px-3 text-[10px] font-mono rounded-xl border text-center transition-all cursor-pointer ${
                      roleStatus === "active"
                        ? "bg-blue-50 border-blue-200 text-blue-700 font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    🚀 Active (Published)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoleStatus("draft")}
                    className={`py-2 px-3 text-[10px] font-mono rounded-xl border text-center transition-all cursor-pointer ${
                      roleStatus === "draft"
                        ? "bg-slate-100 border-slate-300 text-slate-700 font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    📝 Draft (Internal Only)
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Role Description & Value Mission</label>
                <textarea 
                  required
                  placeholder="Describe key responsibilities and critical tech stacks (e.g., PostgreSQL, Rust, Go, OpenTelemetry)..."
                  value={roleDesc}
                  onChange={(e) => setRoleDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 text-xs text-slate-800 p-3 rounded-xl outline-none transition-all resize-none"
                />
              </div>

              {/* Requirements */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono font-bold text-slate-500 uppercase font-semibold">Requirements</label>
                  <span className="text-[8px] font-mono text-slate-400">COMMA SEPARATED</span>
                </div>
                <input 
                  type="text" 
                  placeholder="e.g. 5+ years Systems Dev, Rust, Distributed systems, Docker"
                  value={roleReqs}
                  onChange={(e) => setRoleReqs(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 text-xs text-slate-800 p-3 rounded-xl outline-none transition-all"
                />
              </div>

              {formSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-[11px] flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Success: Role recorded successfully on database.</span>
                </div>
              )}

              {formError && (
                <div className="p-3 bg-red-50 border border-red-150 rounded-xl text-red-800 text-[11px] flex items-center gap-2">
                  <X className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{formError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> : <Send className="w-3.5 h-3.5" />}
                Publish Role Posting
              </button>
            </form>
          </div>

          {/* Open positions list */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
            <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Currently Listed Categories ({roles.length})
            </h4>
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {roles.map(role => (
                <div key={role.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 transition-all">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-xs font-bold text-slate-800 leading-tight block">{role.title}</span>
                      <span className="text-[9px] text-slate-400 font-mono tracking-wider">{role.department}</span>
                    </div>
                    <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded uppercase border font-semibold ${
                      role.status === "active" 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                        : role.status === "draft"
                          ? "bg-amber-50 text-amber-700 border-amber-100"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}>
                      {role.status}
                    </span>
                  </div>
                  
                  {/* Action row to change post status */}
                  <div className="flex justify-end gap-1.5 mt-2.5 pt-2 border-t border-slate-150">
                    {role.status !== "active" && (
                      <button
                        onClick={() => handleUpdateJobStatus(role.id, "active")}
                        className="text-[8.5px] font-mono bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 px-2 py-1 rounded transition-colors"
                      >
                        Publish
                      </button>
                    )}
                    {role.status !== "draft" && (
                      <button
                        onClick={() => handleUpdateJobStatus(role.id, "draft")}
                        className="text-[8.5px] font-mono bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 px-2 py-1 rounded transition-colors"
                      >
                        Draft
                      </button>
                    )}
                    {role.status !== "closed" && (
                      <button
                        onClick={() => handleUpdateJobStatus(role.id, "closed")}
                        className="text-[8.5px] font-mono bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 px-2 py-1 rounded transition-colors"
                      >
                        Close Role
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COMPONENT: Applicants Database (Lg: 7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            
            {/* Filter Hub */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center border-b border-slate-150 pb-4">
              <div>
                <h3 className="text-xs font-mono font-bold text-slate-700 uppercase flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-500" />
                  APPLICANTS & PIPELINE TABLE ({filteredSignups.length})
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Track developer candidates through the vetting pipeline.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Export Button */}
                <button
                  onClick={handleExportData}
                  className="text-[10px] font-mono font-bold bg-blue-50 border border-blue-100 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                  title="Download all applications in CSV format"
                >
                  <Download className="w-3.5 h-3.5" /> Export CSV
                </button>

                {/* Status filter selection */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-[10px] text-slate-600 font-mono px-2.5 py-1.5 rounded-xl outline-none cursor-pointer hover:bg-slate-100"
                >
                  <option value="all">Show All</option>
                  <option value="applied">Applied</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="hired">Hired</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            {/* Search Bar Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search applicants by name, email, role, or experience statement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 text-xs text-slate-800 pl-10 pr-4 py-3 rounded-xl outline-none transition-all"
              />
            </div>

            {/* Applicants Table Render */}
            <div className="overflow-x-auto rounded-xl border border-slate-150">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-150 font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                    <th className="p-3">Candidate</th>
                    <th className="p-3">Target Vacancy</th>
                    <th className="p-3">Status Vetting</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-400 font-mono">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-600 mx-auto mb-2" />
                        Syncing live database records...
                      </td>
                    </tr>
                  ) : filteredSignups.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-400 font-mono">
                        No candidates matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredSignups.map((signup) => (
                      <tr key={signup.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 space-y-0.5">
                          <p className="font-bold text-slate-800">{signup.fullName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{signup.email}</p>
                        </td>
                        <td className="p-3">
                          <p className="font-semibold text-slate-700 leading-tight">{signup.roleTitle}</p>
                          <p className="text-[9px] text-slate-400 font-mono">{new Date(signup.timestamp).toLocaleDateString()}</p>
                        </td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1 text-[8.5px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                            signup.status === "hired"
                              ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                              : signup.status === "interviewing"
                                ? "bg-amber-50 border-amber-100 text-amber-700"
                                : signup.status === "applied"
                                  ? "bg-blue-50 border-blue-100 text-blue-700"
                                  : "bg-slate-50 border-slate-200 text-slate-600"
                          }`}>
                            <span className={`w-1 h-1 rounded-full ${
                              signup.status === "hired" ? "bg-emerald-500" : signup.status === "interviewing" ? "bg-amber-400" : "bg-blue-500"
                            }`} />
                            {signup.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-1">
                            <select
                              value={signup.status}
                              onChange={(e) => handleUpdateApplicantStatus(signup.id, e.target.value as Signup["status"])}
                              className="bg-white border border-slate-200 text-[10px] text-slate-600 font-mono px-2 py-1 rounded outline-none cursor-pointer hover:bg-slate-50"
                            >
                              <option value="applied">Applied</option>
                              <option value="interviewing">Interviewing</option>
                              <option value="hired">Hired</option>
                              <option value="shortlisted">Shortlist</option>
                              <option value="reviewed">Reviewed</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Candidate Experience Teardown details popup helper */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Selected Candidate Background Statements
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {filteredSignups.filter(s => s.experience).map(signup => (
                  <div key={signup.id} className="p-3 bg-slate-50/50 border border-slate-150 rounded-xl text-[11px] leading-relaxed text-slate-600">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-800">{signup.fullName}</span>
                      <span className="text-[9px] font-mono text-slate-400">{signup.roleTitle}</span>
                    </div>
                    <p className="font-light italic text-slate-600">
                      &ldquo;{signup.experience}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
          
          <div className="flex items-start gap-2 p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-[11px] text-slate-600 leading-relaxed shadow-xs">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-700 font-bold">Mercury Talent Flow Note:</span> Changing status tracking for applicants (e.g. from <span className="font-semibold">Applied</span> to <span className="font-semibold">Interviewing</span> or <span className="font-semibold">Hired</span>) instantly registers on the backend DB. Click <span className="font-semibold">Export CSV</span> at any time to backup your talent roster.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
