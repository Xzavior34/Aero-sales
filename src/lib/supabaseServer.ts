import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const url = process.env.SUPABASE_URL;
// Prefer service role key for admin-level operations on the backend, fall back to anon key
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

// Check if the URL is a valid http or https URL to prevent initialization errors with placeholders
const isValidUrl = (str: string | undefined): boolean => {
  if (!str) return false;
  try {
    const parsed = new URL(str);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (_) {
    return false;
  }
};

export const isSupabaseConfigured = Boolean(url && key && isValidUrl(url));

let supabaseClient: any = null;

export function getSupabaseClient() {
  if (!isSupabaseConfigured) {
    return null;
  }
  if (!supabaseClient) {
    try {
      supabaseClient = createClient(url!, key!);
      console.log("Supabase Client initialized successfully.");
    } catch (error) {
      console.error("Failed to initialize Supabase client:", error);
    }
  }
  return supabaseClient;
}

// Data models
export interface Job {
  id: string;
  title: string;
  department: string;
  description: string;
  requirements: string[];
  status: "active" | "draft" | "closed";
  createdAt: string;
}

export interface Application {
  id: string;
  fullName: string;
  email: string;
  roleId: string;
  roleTitle: string;
  experience: string;
  status: "applied" | "interviewing" | "hired" | "pending" | "reviewed" | "shortlisted";
  timestamp: string;
}

// Local File Database Helper for real persistence when Supabase is not present
const DB_FILE = path.join(process.cwd(), "src", "data", "db.json");

const defaultJobs: Job[] = [
  {
    id: "job-1",
    title: "B2B Outbound Appointment Setter (Nigeria/Remote)",
    department: "Sales & Outbound Operations",
    description: "Conduct high-energy, structured outbound outreach via phone, social channels, and email. Perform 150-180 high-quality touchpoints per day targeting 7 and 8-figure business owners. Coordinate direct bookings into closers' calendars and maintain absolute CRM data hygiene.",
    requirements: [
      "Based in Nigeria or working in compatible timezones with exceptional conversational energy",
      "Proven experience with high-volume cold outreach (cold call, cold email, or LinkedIn)",
      "Highly proficient with GoHighLevel CRM, smart lists, and dialer tools"
    ],
    status: "active",
    createdAt: new Date("2026-06-15T09:00:00Z").toISOString()
  },
  {
    id: "job-2",
    title: "Senior Enterprise Sales Closer (Remote)",
    department: "Sales & Closing",
    description: "Conclude high-ticket enterprise client acquisitions. Conduct real-time value-driven audits showing prospective clients their exact mathematical brand leakage and presenting custom pipeline solutions. Manage negotiation and close contracts from $5k - $50k.",
    requirements: [
      "Demonstrated track record of closing high-ticket B2B consulting packages",
      "Mastery of consultational sales methodologies and pipeline diagnostics",
      "Experienced in pipeline stage hygiene and staff co-management inside GHL"
    ],
    status: "active",
    createdAt: new Date("2026-06-22T14:30:00Z").toISOString()
  },
  {
    id: "job-3",
    title: "GHL CRM & Outbound Pipeline Specialist (Remote)",
    department: "Revenue Operations",
    description: "Build out complete outbound sales workflows in GoHighLevel (GHL) with clean smart lists, custom triggers, automated email/SMS sequencers, and accurate hygiene tracking.",
    requirements: [
      "Certified GHL expert with advanced trigger and workflow configuration skills",
      "Deep familiarity with CRM automation, lead scoring, and webhooks",
      "Analytical approach to sales data hygiene and conversion tracking"
    ],
    status: "active",
    createdAt: new Date("2026-06-28T10:00:00Z").toISOString()
  }
];

const defaultApplications: Application[] = [
  {
    id: "app-1",
    fullName: "Sarah Jenkins",
    email: "sarah.j@aero-setters.ng",
    roleId: "job-1",
    roleTitle: "B2B Outbound Appointment Setter (Nigeria/Remote)",
    experience: "Based in Lagos. 3+ years of outbound calling inside US real-estate and high-ticket B2B agencies. Consistently hits 160+ dials per day with a 12% booking rate. Expert in handling gatekeepers and GoHighLevel CRM setup.",
    status: "shortlisted",
    timestamp: new Date("2026-07-01T10:15:00Z").toISOString()
  },
  {
    id: "app-2",
    fullName: "Marcus Chen",
    email: "m.chen@aero-closers.ng",
    roleId: "job-2",
    roleTitle: "Senior Enterprise Sales Closer (Remote)",
    experience: "Based in Enugu. Closed over $450k in high-ticket B2B consulting packages for European SaaS corporations. Strong consultational sales style, adept at doing detailed pipeline audits and using diagnostic leakage metrics.",
    status: "applied",
    timestamp: new Date("2026-07-01T16:45:00Z").toISOString()
  }
];

function readLocalDb(): { jobs: Job[]; applications: Application[] } {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading local database file, using defaults:", err);
  }
  
  // Create file with default data if missing
  const initial = { jobs: defaultJobs, applications: defaultApplications };
  try {
    const parentDir = path.dirname(DB_FILE);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
  } catch (err) {
    console.error("Error creating local database seed file:", err);
  }
  return initial;
}

function writeLocalDb(jobs: Job[], applications: Application[]) {
  try {
    const parentDir = path.dirname(DB_FILE);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify({ jobs, applications }, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving database file:", err);
  }
}

// Helper to synchronise table structural warnings or configurations
export const SUPABASE_SQL_INSTRUCTIONS = `
-- COPY AND PASTE THIS SQL CODE IN THE SUPABASE SQL EDITOR TO CREATE THE NECESSARY TABLES:

-- 1. Create 'jobs' table
CREATE TABLE IF NOT EXISTS public.jobs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create 'applications' table
CREATE TABLE IF NOT EXISTS public.applications (
    id TEXT PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    email TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    experience TEXT,
    status TEXT NOT NULL DEFAULT 'applied',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS and add public access policies (or leave open for anon/authenticated access)
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-access to jobs" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Allow public insert-access to applications" ON public.applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow full admin access to jobs" ON public.jobs ALL USING (true);
CREATE POLICY "Allow full admin access to applications" ON public.applications ALL USING (true);
`;

// Fetch Jobs
export async function fetchJobs(): Promise<Job[]> {
  const client = getSupabaseClient();
  if (!client) {
    return readLocalDb().jobs;
  }
  try {
    const { data, error } = await client
      .from("jobs")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) {
      console.warn("Supabase jobs select error, using local fallback:", error.message);
      return readLocalDb().jobs;
    }
    return data as Job[];
  } catch (err: any) {
    console.error("fetchJobs error:", err);
    return readLocalDb().jobs;
  }
}

// Add or Update Job
export async function saveJob(job: Job): Promise<Job> {
  const client = getSupabaseClient();
  if (!client) {
    const db = readLocalDb();
    const existingIndex = db.jobs.findIndex(j => j.id === job.id);
    if (existingIndex > -1) {
      db.jobs[existingIndex] = job;
    } else {
      db.jobs.unshift(job);
    }
    writeLocalDb(db.jobs, db.applications);
    return job;
  }
  try {
    const { data, error } = await client
      .from("jobs")
      .upsert({
        id: job.id,
        title: job.title,
        department: job.department,
        description: job.description,
        requirements: job.requirements,
        status: job.status,
        createdAt: job.createdAt
      })
      .select()
      .single();

    if (error) {
      throw error;
    }
    return data as Job;
  } catch (err: any) {
    console.error("saveJob error, falling back to local database:", err);
    const db = readLocalDb();
    const existingIndex = db.jobs.findIndex(j => j.id === job.id);
    if (existingIndex > -1) {
      db.jobs[existingIndex] = job;
    } else {
      db.jobs.unshift(job);
    }
    writeLocalDb(db.jobs, db.applications);
    return job;
  }
}

// Delete or close job (Closing changes status to 'closed')
export async function closeJob(id: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) {
    const db = readLocalDb();
    const job = db.jobs.find(j => j.id === id);
    if (job) {
      job.status = "closed";
      writeLocalDb(db.jobs, db.applications);
      return true;
    }
    return false;
  }
  try {
    const { error } = await client
      .from("jobs")
      .update({ status: "closed" })
      .eq("id", id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("closeJob error:", err);
    const db = readLocalDb();
    const job = db.jobs.find(j => j.id === id);
    if (job) {
      job.status = "closed";
      writeLocalDb(db.jobs, db.applications);
      return true;
    }
    return false;
  }
}

// Fetch Applications
export async function fetchApplications(): Promise<Application[]> {
  const client = getSupabaseClient();
  if (!client) {
    return readLocalDb().applications;
  }
  try {
    const { data, error } = await client
      .from("applications")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) {
      console.warn("Supabase applications select error, using local fallback:", error.message);
      return readLocalDb().applications;
    }
    return data as Application[];
  } catch (err: any) {
    console.error("fetchApplications error:", err);
    return readLocalDb().applications;
  }
}

// Submit Application
export async function submitApplication(app: Application): Promise<Application> {
  const client = getSupabaseClient();
  if (!client) {
    const db = readLocalDb();
    db.applications.unshift(app);
    writeLocalDb(db.jobs, db.applications);
    return app;
  }
  try {
    const { data, error } = await client
      .from("applications")
      .insert({
        id: app.id,
        fullName: app.fullName,
        email: app.email,
        roleId: app.roleId,
        roleTitle: app.roleTitle,
        experience: app.experience,
        status: app.status,
        timestamp: app.timestamp
      })
      .select()
      .single();

    if (error) {
      throw error;
    }
    return data as Application;
  } catch (err: any) {
    console.error("submitApplication error, falling back to local database:", err);
    const db = readLocalDb();
    db.applications.unshift(app);
    writeLocalDb(db.jobs, db.applications);
    return app;
  }
}

// Update Application Status
export async function updateApplicationStatus(id: string, status: Application["status"]): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) {
    const db = readLocalDb();
    const app = db.applications.find(a => a.id === id);
    if (app) {
      app.status = status;
      writeLocalDb(db.jobs, db.applications);
      return true;
    }
    return false;
  }
  try {
    const { error } = await client
      .from("applications")
      .update({ status })
      .eq("id", id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("updateApplicationStatus error:", err);
    const db = readLocalDb();
    const app = db.applications.find(a => a.id === id);
    if (app) {
      app.status = status;
      writeLocalDb(db.jobs, db.applications);
      return true;
    }
    return false;
  }
}
