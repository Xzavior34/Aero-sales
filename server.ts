import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import {
  isSupabaseConfigured,
  SUPABASE_SQL_INSTRUCTIONS,
  fetchJobs,
  saveJob,
  closeJob,
  fetchApplications,
  submitApplication,
  updateApplicationStatus,
  Job as DbJob,
  Application as DbApplication
} from "./src/lib/supabaseServer";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// JSON Schema for Landing Page Data
const landingPageSchema = {
  type: Type.OBJECT,
  properties: {
    productName: { type: Type.STRING },
    hero: {
      type: Type.OBJECT,
      properties: {
        badge: { type: Type.STRING },
        headline: { type: Type.STRING },
        subheadline: { type: Type.STRING },
        ctaPrimary: { type: Type.STRING },
        ctaSecondary: { type: Type.STRING }
      },
      required: ["badge", "headline", "subheadline", "ctaPrimary", "ctaSecondary"]
    },
    metrics: {
      type: Type.OBJECT,
      properties: {
        label1: { type: Type.STRING },
        value1: { type: Type.STRING },
        label2: { type: Type.STRING },
        value2: { type: Type.STRING },
        label3: { type: Type.STRING },
        value3: { type: Type.STRING }
      },
      required: ["label1", "value1", "label2", "value2", "label3", "value3"]
    },
    features: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          icon: { type: Type.STRING }
        },
        required: ["title", "description", "icon"]
      }
    },
    calculator: {
      type: Type.OBJECT,
      properties: {
        metricLabel: { type: Type.STRING },
        metricMin: { type: Type.INTEGER },
        metricMax: { type: Type.INTEGER },
        metricDefault: { type: Type.INTEGER },
        unitLabel: { type: Type.STRING },
        basePricePerUnit: { type: Type.NUMBER },
        revenueMultiplier: { type: Type.NUMBER },
        valueLabel: { type: Type.STRING }
      },
      required: ["metricLabel", "metricMin", "metricMax", "metricDefault", "unitLabel", "basePricePerUnit", "revenueMultiplier", "valueLabel"]
    },
    testimonial: {
      type: Type.OBJECT,
      properties: {
        quote: { type: Type.STRING },
        author: { type: Type.STRING },
        role: { type: Type.STRING },
        company: { type: Type.STRING },
        avatarInitials: { type: Type.STRING }
      },
      required: ["quote", "author", "role", "company", "avatarInitials"]
    },
    faqs: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          answer: { type: Type.STRING }
        },
        required: ["question", "answer"]
      }
    },
    ctaSection: {
      type: Type.OBJECT,
      properties: {
        headline: { type: Type.STRING },
        subheadline: { type: Type.STRING },
        buttonText: { type: Type.STRING }
      },
      required: ["headline", "subheadline", "buttonText"]
    },
    conversionInsights: {
      type: Type.OBJECT,
      properties: {
        predictedConversionRate: { type: Type.NUMBER },
        bounceRate: { type: Type.NUMBER },
        predictedAov: { type: Type.STRING },
        principlesUsed: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        editorialTeardown: { type: Type.STRING }
      },
      required: ["predictedConversionRate", "bounceRate", "predictedAov", "principlesUsed", "editorialTeardown"]
    }
  },
  required: [
    "productName", "hero", "metrics", "features", "calculator", "testimonial", "faqs", "ctaSection", "conversionInsights"
  ]
};

// Supabase Database Connection Status
app.get("/api/supabase-status", (req, res) => {
  res.json({
    configured: isSupabaseConfigured,
    url: process.env.SUPABASE_URL ? `${process.env.SUPABASE_URL.substring(0, 15)}...` : null,
    sqlInstructions: SUPABASE_SQL_INSTRUCTIONS
  });
});

// Get all roles/jobs (mapped to Supabase jobs)
app.get("/api/roles", async (req, res) => {
  try {
    const jobs = await fetchJobs();
    res.json(jobs);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to retrieve job listings" });
  }
});

// Create or draft a new role/job
app.post("/api/roles", async (req, res) => {
  try {
    const { title, department, description, requirements, status } = req.body;
    if (!title || !department || !description) {
      return res.status(400).json({ error: "Title, department, and description are required fields." });
    }

    const reqArray = Array.isArray(requirements) 
      ? requirements 
      : typeof requirements === "string" 
        ? requirements.split(",").map(r => r.trim()).filter(Boolean)
        : [];

    const newJob: DbJob = {
      id: `job-${Date.now()}`,
      title,
      department,
      description,
      requirements: reqArray.length > 0 ? reqArray : ["Experience in high-growth environments", "Self-directed problem solver"],
      status: status || "active",
      createdAt: new Date().toISOString()
    };

    const saved = await saveJob(newJob);
    res.status(201).json(saved);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to save job posting" });
  }
});

// Close a role/job
app.post("/api/roles/:id/close", async (req, res) => {
  try {
    const { id } = req.params;
    const success = await closeJob(id);
    if (success) {
      res.json({ message: "Job closed successfully" });
    } else {
      res.status(404).json({ error: "Job posting not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: "Failed to close job posting" });
  }
});

// Update an existing role/job status directly
app.patch("/api/roles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, title, department, description, requirements } = req.body;
    
    const existingJobs = await fetchJobs();
    const job = existingJobs.find(j => j.id === id);
    if (!job) {
      return res.status(404).json({ error: "Job posting not found" });
    }

    const updatedJob: DbJob = {
      ...job,
      ...(status && { status }),
      ...(title && { title }),
      ...(department && { department }),
      ...(description && { description }),
      ...(requirements && { requirements: Array.isArray(requirements) ? requirements : requirements.split(",") })
    };

    const saved = await saveJob(updatedJob);
    res.json(saved);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update job posting" });
  }
});

// Get all applications (mapped to Supabase applications)
app.get("/api/signups", async (req, res) => {
  try {
    const apps = await fetchApplications();
    res.json(apps);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to retrieve applicant data" });
  }
});

// Export all applications as CSV
app.get("/api/signups/export", async (req, res) => {
  try {
    const apps = await fetchApplications();
    const headers = ["ID", "Full Name", "Email", "Role ID", "Role Title", "Experience", "Status", "Timestamp"];
    const rows = apps.map(a => [
      a.id,
      `"${a.fullName.replace(/"/g, '""')}"`,
      a.email,
      a.roleId,
      `"${a.roleTitle.replace(/"/g, '""')}"`,
      `"${(a.experience || "").replace(/"/g, '""')}"`,
      a.status,
      a.timestamp
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="applicants_export.csv"');
    res.status(200).send(csvContent);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to generate CSV data for download" });
  }
});

// Submit a job application/signup
app.post("/api/signups", async (req, res) => {
  try {
    const { fullName, email, roleId, experience } = req.body;
    if (!fullName || !email || !roleId) {
      return res.status(400).json({ error: "Full Name, Email, and Selected Role are required." });
    }

    let roleTitle = "General Operations Candidate";
    if (roleId === "audit-request") {
      roleTitle = "Revenue Leak Audit Lead";
    } else if (roleId === "cta-lead") {
      roleTitle = "Homepage Lead Generation Request";
    } else {
      const jobs = await fetchJobs();
      const associatedRole = jobs.find(j => j.id === roleId);
      roleTitle = associatedRole ? associatedRole.title : "General Operations Candidate";
    }

    const newApp: DbApplication = {
      id: `app-${Date.now()}`,
      fullName,
      email,
      roleId,
      roleTitle,
      experience: experience || "Interested in learning more about Aero Sales Operations.",
      status: "applied",
      timestamp: new Date().toISOString()
    };

    const saved = await submitApplication(newApp);
    res.status(201).json(saved);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to submit job application" });
  }
});

// Update application status (tracking: Applied -> Interviewing -> Hired, etc.)
app.patch("/api/signups/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Status is required." });
    }

    const success = await updateApplicationStatus(id, status);
    if (success) {
      res.json({ message: "Applicant status updated successfully" });
    } else {
      res.status(404).json({ error: "Application not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update applicant status" });
  }
});

// API Endpoint to generate copy and optimization insights
app.post("/api/generate-landing-page", async (req, res) => {
  try {
    const { productName, hook, targetAudience, conversionGoal, styleTheme } = req.body;

    if (!productName) {
      return res.status(400).json({ error: "Product name is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key is missing on the server. Please check the Secrets panel." });
    }

    const systemInstruction = `You are an elite Senior Frontend Architect, Conversion Rate Optimization (CRO) Expert, and Premium Copywriter specializing in luxury minimalist SaaS landing pages.
Your job is to generate persuasive, world-class landing page copy and structured elements for a SaaS product named "${productName}".
The landing page copy must follow high-conversion copy principles: above-the-fold value alignment, friction-reduction, objection-handling, social proof, and a highly interactive, value-driven ROI calculator.
The copy should match a "${styleTheme}" style (e.g. extremely sophisticated, high-end, authoritative, clean and crisp).

The response MUST strictly conform to the requested JSON schema.
- 'features' array should contain exactly 3 features. Each feature must have an icon key which is a valid Lucide icon name (e.g., 'Zap', 'Shield', 'TrendingUp', 'Layers', 'Cpu', 'Activity', 'BarChart2', 'Lock', 'Terminal').
- 'calculator' metrics should be configured to suit the product context (e.g., if the SaaS is a database tool, configure metrics like 'Queries processed per month' or 'GB of logs' with reasonable price increments).
- 'conversionInsights' must provide extremely high-fidelity insights analyzing the visual psychology, cognitive biases, and structure of this premium copy. Keep 'editorialTeardown' thorough and insightful, written in the tone of a high-end agency partner.`;

    const prompt = `Generate a complete premium high-conversion landing page structure and copy for:
- Product Name: ${productName}
- Main Hook/Description: ${hook || "A high-performance SaaS platform"}
- Target Audience: ${targetAudience || "B2B professionals and decision makers"}
- Conversion Goal: ${conversionGoal || "Direct SaaS Subscription signup"}
- Aesthetic Vibe: ${styleTheme || "Minimalist Luxury"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: landingPageSchema,
        temperature: 0.8,
      }
    });

    const contentText = response.text;
    if (!contentText) {
      throw new Error("No response text from Gemini");
    }

    const parsedData = JSON.parse(contentText);
    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate optimized copy with Gemini" });
  }
});

// Serve assets / Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
