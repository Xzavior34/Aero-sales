import React, { useState, useEffect } from "react";
import { Role } from "../types";
import { 
  Briefcase, 
  Send, 
  CheckCircle, 
  Loader2, 
  ArrowRight, 
  User, 
  Mail, 
  Shield, 
  Sparkles,
  MapPin,
  Calendar,
  DollarSign,
  ChevronRight,
  ArrowLeft,
  Search,
  Filter,
  Upload,
  Linkedin,
  File
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PilotRolesBoardProps {
  theme: string;
  isLight: boolean;
  currentStyles: any;
  onSignupComplete?: () => void;
}

export function PilotRolesBoard({ theme, isLight, currentStyles, onSignupComplete }: PilotRolesBoardProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDept, setSelectedDept] = useState<string>("All");

  // Application Form State
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [experience, setExperience] = useState<string>("");
  const [linkedinUrl, setLinkedinUrl] = useState<string>("");
  const [cvFile, setCvFile] = useState<globalThis.File | null>(null);
  const [cvName, setCvName] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchRoles = async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const res = await fetch("/api/roles");
      if (res.ok) {
        const data = await res.json();
        // Only show active positions for candidate preview
        const activeRoles = data.filter((r: Role) => r.status === "active");
        setRoles(activeRoles);
      }
    } catch (e) {
      console.error("Error fetching preview roles:", e);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles(false);
    const interval = setInterval(() => {
      fetchRoles(true);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !selectedRole) {
      setErrorMsg("Full Name and secure Email are required.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/signups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          roleId: selectedRole.id,
          experience,
          linkedinUrl,
          cvName
        })
      });

      if (!res.ok) {
        throw new Error("Unable to register application profile.");
      }

      setSubmitSuccess(true);
      setFullName("");
      setEmail("");
      setExperience("");
      setLinkedinUrl("");
      setCvFile(null);
      setCvName("");
      if (onSignupComplete) onSignupComplete();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit signup request.");
    } finally {
      setSubmitting(false);
    }
  };

  // Get unique departments for filters
  const departments = ["All", ...Array.from(new Set(roles.map(r => r.department)))];

  // Filter roles based on search query and department filter
  const filteredRoles = roles.filter(role => {
    const matchesSearch = 
      role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.requirements.some(req => req.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDept = selectedDept === "All" || role.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  return (
    <section id="careers" className="space-y-8 pt-6">
      
      {/* Dynamic Header */}
      <div className="text-center space-y-3">
        <span className="text-[9px] font-mono tracking-widest font-bold text-amber-600 uppercase inline-flex items-center gap-1.5 bg-amber-50/80 px-3.5 py-1.5 rounded-full border border-amber-100/60 max-w-max mx-auto shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          AERO GLOBAL OPPORTUNITIES
        </span>
        <h2 className="text-3xl font-display font-bold tracking-tight text-slate-900">
          Join Our Roster of Sourced Setters & Closers.
        </h2>
        <p className="text-xs max-w-lg mx-auto leading-relaxed text-slate-500 font-light">
          We source, vet, and place highly motivated remote sales representatives from Nigeria with heavy-hitting US and European B2B and DTC companies. Choose an open track below.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!selectedRole ? (
          /* ========================================================================= */
          /* VIEW 1: JOB LISTINGS                                                      */
          /* ========================================================================= */
          <motion.div
            key="listings"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Search and Filters bar */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter openings by keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs p-3.5 pl-10 rounded-xl border outline-none bg-white border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 transition-all shadow-xs"
                />
              </div>

              {/* Department Filters */}
              <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {departments.map(dept => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDept(dept)}
                    className={`text-[10px] font-mono px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
                      selectedDept === dept
                        ? "bg-slate-900 border-slate-900 text-white font-bold"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>

            {/* Listings Grid */}
            {loading ? (
              <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-xs font-mono text-slate-500">Retrieving active positions from database...</span>
              </div>
            ) : filteredRoles.length === 0 ? (
              <div className="p-12 text-center border border-dashed rounded-2xl bg-white border-slate-200/80 shadow-xs max-w-lg mx-auto space-y-2">
                <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-mono text-slate-700 font-bold">No active positions match criteria</p>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Try clearing your search filters, or contact our team to inquire about custom corporate sales structures.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRoles.map(role => (
                  <div 
                    key={role.id}
                    onClick={() => {
                      setSelectedRole(role);
                      setSubmitSuccess(false);
                      setErrorMsg(null);
                    }}
                    className="group p-6 rounded-2xl border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-slate-400 hover:shadow-md bg-white border-slate-200/80 shadow-xs cursor-pointer"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {role.department}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                          <MapPin className="w-3.5 h-3.5" /> Remote
                        </div>
                      </div>

                      <h3 className="text-base font-bold font-display text-slate-900 group-hover:text-blue-600 transition-colors">
                        {role.title}
                      </h3>

                      <p className="text-xs leading-relaxed text-slate-500 line-clamp-3 font-light">
                        {role.description}
                      </p>

                      {role.requirements && role.requirements.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <p className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-wider">Key Expectation</p>
                          <div className="flex items-center gap-2 text-[10.5px] text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <span className="truncate">{role.requirements[0]}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-100 mt-5 flex items-center justify-between text-xs font-mono font-bold text-slate-800">
                      <span>View Specifications</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: JOB DETAILS & APPLICATION FORM                                    */
          /* ========================================================================= */
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm"
          >
            {/* Left Specs Panel: Lg: 7 Columns */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Back Button */}
              <button
                onClick={() => setSelectedRole(null)}
                className="text-[10px] font-mono font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to open slots
              </button>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-100">
                    {selectedRole.department}
                  </span>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-slate-50 text-slate-600 border border-slate-200">
                    Full-time
                  </span>
                </div>

                <h3 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
                  {selectedRole.title}
                </h3>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-slate-400 font-mono">
                  <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> Distributed (Global Remote)</div>
                  <div className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Active Posting</div>
                  <div className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-slate-400" /> Premium Equity + Salary</div>
                </div>
              </div>

              <div className="space-y-3.5 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-mono font-bold text-slate-700 uppercase tracking-widest">POSITION MISSION SUMMARY</h4>
                <p className="text-xs leading-relaxed text-slate-600 font-light whitespace-pre-wrap">
                  {selectedRole.description}
                </p>
              </div>

              {selectedRole.requirements && selectedRole.requirements.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-mono font-bold text-slate-700 uppercase tracking-widest">TECHNICAL & QUALITY EXPECTATIONS</h4>
                  <ul className="space-y-2.5 text-xs">
                    {selectedRole.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        <span className="leading-relaxed font-light">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Application Form Panel: Lg: 5 Columns */}
            <div className="lg:col-span-5 bg-slate-50/50 rounded-2xl border border-slate-250 p-6 space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h4 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-blue-600" /> CANDIDATE SPEC APPLICATION
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Submit credentials directly to our recruitment backend pipeline.
                </p>
              </div>

              {submitSuccess ? (
                <div className="py-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-150 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-slate-800">Application Lodged Successfully</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed px-2">
                      Your vetting record is now live in our secure candidate database. Our talent team will review it shortly.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSubmitSuccess(false);
                      setSelectedRole(null);
                    }}
                    className="text-xs font-mono font-bold px-4 py-2.5 rounded-xl uppercase transition-all w-full mt-2 bg-slate-900 text-white hover:bg-slate-800 shadow-sm cursor-pointer"
                  >
                    View other slots
                  </button>
                </div>
              ) : (
                 <form onSubmit={handleApply} className="space-y-4">
                  
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-slate-500 uppercase flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" /> Candidate Full Name
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Elena Rostova"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl outline-none border bg-white border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-slate-500 uppercase flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" /> Professional Email
                    </label>
                    <input 
                      type="email" 
                      required
                      placeholder="e.g. elena@rosto.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl outline-none border bg-white border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 transition-all"
                    />
                  </div>

                  {/* LinkedIn Profile */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-slate-500 uppercase flex items-center gap-1">
                      <Linkedin className="w-3 h-3 text-blue-600" /> LinkedIn Profile URL
                    </label>
                    <input 
                      type="url" 
                      required
                      placeholder="e.g. https://linkedin.com/in/username"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl outline-none border bg-white border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 transition-all"
                    />
                  </div>

                  {/* CV/Resume File Upload Zone */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-slate-500 uppercase flex items-center gap-1">
                      <Upload className="w-3 h-3 text-amber-500" /> CV / Resume Upload
                    </label>
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const files = e.dataTransfer.files;
                        if (files && files.length > 0) {
                          setCvFile(files[0]);
                          setCvName(files[0].name);
                        }
                      }}
                      onClick={() => {
                        const fileInput = document.getElementById("cv-file-input");
                        if (fileInput) fileInput.click();
                      }}
                      className={`border border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                        isDragging 
                          ? "border-blue-500 bg-blue-50/50" 
                          : cvName 
                            ? "border-emerald-300 bg-emerald-50/20" 
                            : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        id="cv-file-input"
                        type="file"
                        accept=".pdf,.doc,.docx,.rtf,.txt"
                        className="hidden"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files && files.length > 0) {
                            setCvFile(files[0]);
                            setCvName(files[0].name);
                          }
                        }}
                      />
                      {cvName ? (
                        <div className="flex items-center justify-center gap-2">
                          <File className="w-4 h-4 text-emerald-600" />
                          <div className="text-left">
                            <p className="text-xs font-semibold text-slate-800 line-clamp-1">{cvName}</p>
                            <p className="text-[9px] text-slate-400">Drag another file or click to replace</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <Upload className="w-5 h-5 text-slate-400 mx-auto" />
                          <p className="text-xs text-slate-600 font-medium">Drag & drop your CV here, or <span className="text-blue-600 font-bold">browse</span></p>
                          <p className="text-[9px] text-slate-400">Supports PDF, DOCX, DOC, TXT (Max 10MB)</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Statement */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                      Relevant Experience & Mastery Statement
                    </label>
                    <textarea 
                      placeholder="Briefly state systems architectural accomplishments or metrics optimization credentials..."
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      rows={4}
                      className="w-full text-xs p-3 rounded-xl outline-none border resize-none bg-white border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 transition-all"
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-150 rounded-xl text-xs text-red-700 font-mono">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="text-xs font-mono font-bold px-4 py-3 rounded-xl uppercase transition-all w-full flex items-center justify-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> : <Send className="w-3.5 h-3.5" />}
                    Submit Spec Application
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
