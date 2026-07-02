import { LandingPageData } from "../types";

export const TEMPLATES: Record<string, LandingPageData> = {
  aether: {
    productName: "Aero Sales Operations",
    hero: {
      badge: "ENTERPRISE OUTBOUND SALES PIPELINE",
      headline: "We Engineer High-Performing Outbound Sales Pipelines.",
      subheadline: "Aero Sales Operations recruits, trains, and integrates elite teams of dedicated appointment setters and expert sales closers inside your business. Stop losing multi-million dollar market opportunities to lower-quality competitors.",
      ctaPrimary: "Schedule Pipeline Audit",
      ctaSecondary: "Explore Placed Solutions"
    },
    metrics: {
      label1: "Daily Outbound Actions Per Rep",
      value1: "150 - 180+",
      label2: "Average Revenue Found Per Client",
      value2: "$3.2M+",
      label3: "Average Client Integration Speed",
      value3: "7 Days"
    },
    features: [
      {
        title: "For Companies: Elite Sales Placement",
        description: "We source, vet, and place highly fluent, rigorously trained appointment setters and sales closers directly inside your systems. We manage and scale daily performance so you don't have to.",
        icon: "Users"
      },
      {
        title: "For Workers: High-Payout Placements",
        description: "Get trained by elite sales veterans and secured in high-earning, commission-based placements with fast-growing brands in the US and Europe. Work from anywhere with top-tier training.",
        icon: "TrendingUp"
      },
      {
        title: "Full Outreach CRM Infrastructure",
        description: "We configure your entire sales engine inside GoHighLevel, including optimized smart lists, custom automated sequences (Email/SMS), and absolute performance visibility.",
        icon: "Cpu"
      }
    ],
    calculator: {
      metricLabel: "Your Estimated Annual Revenue (USD)",
      metricMin: 200000,
      metricMax: 10000000,
      metricDefault: 2500000,
      unitLabel: "USD",
      basePricePerUnit: 1,
      revenueMultiplier: 0.40,
      valueLabel: "Estimated Brand Revenue Leak"
    },
    testimonial: {
      quote: "Partnering with Aero completely transformed our sales cycle. Their integrated reps booked 42 high-value enterprise meetings in their first 30 days, unlocking over $380,000 in previously uncaptured sales pipeline.",
      author: "Chidi Ndubisi",
      role: "VP of Global Revenue Operations",
      company: "ScaleFlow B2B Enterprise",
      avatarInitials: "CN"
    },
    faqs: [
      {
        question: "How does the placement process work for companies?",
        answer: "We understand your ideal customer profile and outbound script goals first. We then hand-match pre-vetted, high-energy sales professionals from Nigeria and other tech hubs, setting up their workspace, custom tracking links, and GHL CRM systems so they can start booking meetings in under a week."
      },
      {
        question: "What is the opportunity for remote sales reps (workers)?",
        answer: "Aero is the premier hub for elite remote sales talent. When you pass our vetting process, you receive intensive training in outbound conversational dynamics and are placed in roles with verified high-performance commission splits and top-tier supportive leadership."
      },
      {
        question: "Who manages and trains the remote reps?",
        answer: "Aero Sales Operations co-manages placed reps daily. We review daily activity metrics, conduct recording teardowns, refine scripts, and ensure optimal customer experience is delivered across all accounts."
      }
    ],
    ctaSection: {
      headline: "Accelerate Your Revenue Pipeline Today",
      subheadline: "Whether you are a growing business looking to scale your sales or an elite rep looking to secure a high-payout placement, Aero is your ultimate outbound partner.",
      buttonText: "Schedule Free Pipeline Audit"
    },
    conversionInsights: {
      predictedConversionRate: 4.5,
      bounceRate: 18,
      predictedAov: "$3,200/mo",
      principlesUsed: ["Authority Framing", "Mathematical Pain Anchor", "Frictionless Sourcing", "Performance Splits"],
      editorialTeardown: "This copywriting is designed to completely eliminate agency-buyer friction by introducing rigorous, mathematical accountability. Rather than selling 'leads', we quantify the client's current 'revenue leak' (the pain point) and position trained B2B setters as the direct, turnkey solution."
    }
  },
  prism: {
    productName: "Aero Talent Operations",
    hero: {
      badge: "ELITE REPRESENTATION & SOURCING",
      headline: "Sourcing Elite Nigerian Setters & Closers.",
      subheadline: "We source, vet, and place highly motivated, high-energy remote sales representatives from Nigeria to scale your outbound efforts. Empower your customer outreach with elite talent operating on high-performance commission splits.",
      ctaPrimary: "Apply to Join Aero Ops",
      ctaSecondary: "Browse Career Tracks"
    },
    metrics: {
      label1: "Average Sourcing Time",
      value1: "14 Days",
      label2: "Candidate Screening Ratio",
      value2: "Top 2%",
      label3: "Commission Splits Enabled",
      value3: "Yes"
    },
    features: [
      {
        title: "Rigorous Sales Training",
        description: "Every representative undergoes intensive B2B cold email, phone, and objection-handling training before being integrated into your operations.",
        icon: "GraduationCap"
      },
      {
        title: "Timezone-Optimized Support",
        description: "Our reps operate in complete alignment with US and European business hours to ensure consistent, live executive follow-up.",
        icon: "Clock"
      },
      {
        title: "Continuous Performance Coaching",
        description: "Aero's internal management audits call recordings daily, refining scripts and offering micro-feedback to maintain peak closing rates.",
        icon: "Activity"
      }
    ],
    calculator: {
      metricLabel: "Dedicated Sales Representatives",
      metricMin: 1,
      metricMax: 15,
      metricDefault: 3,
      unitLabel: "Rep(s)",
      basePricePerUnit: 1200,
      revenueMultiplier: 4.5,
      valueLabel: "Expected Pipeline Value"
    },
    testimonial: {
      quote: "The outbound setter from Aero operates with incredible work ethic and high energy. He manages our GHL pipeline perfectly, making over 160 touches daily and scheduling 3 to 4 qualified calls every single week.",
      author: "Evelyn Sterling",
      role: "Director of Business Development",
      company: "Sovereign Scale Group",
      avatarInitials: "ES"
    },
    faqs: [
      {
        question: "Are the sales representatives fully dedicated to our company?",
        answer: "Yes, all setters and closers placed by Aero Sales Operations are fully dedicated 1-to-1 to your business. They work exclusively inside your workspace, CRM, and communication tools."
      },
      {
        question: "What timezone do the representatives work in?",
        answer: "Our representatives adjust their schedules to work fully during your target audience's standard business hours, whether that is EST, PST, or GMT."
      }
    ],
    ctaSection: {
      headline: "Integrate Elite Sales Talent Into Your Pipeline Today.",
      subheadline: "We have a curated roster of pre-vetted, high-energy Nigerian appointment setters and sales closers ready for placement within 7 days.",
      buttonText: "Interview Sourced Candidates"
    },
    conversionInsights: {
      predictedConversionRate: 5.1,
      bounceRate: 20,
      predictedAov: "$2,500/placement",
      principlesUsed: ["Talent Arbitrage Advantage", "Intense Sourcing Vetting", "Timezone Alignment Guarantee", "Direct Human Connection"],
      editorialTeardown: "By highlighting the sourcing of highly motivated remote talent from Nigeria, we leverage talent arbitrage to promise high work ethic and cost-effectiveness. Highlighting exact numbers (Top 2% screening ratio, 14 days sourcing) builds strong institutional trust."
    }
  },
  scribe: {
    productName: "Aero CRM RevOps",
    hero: {
      badge: "AUTOMATED OUTBOUND INFRASTRUCTURE",
      headline: "Enterprise CRM Pipeline & GoHighLevel Workflows.",
      subheadline: "Stop leaking prospective buyers due to poor data hygiene. We build out robust, custom-triggered outbound sales setups in GoHighLevel (GHL) with clean smart lists, automated sequences, and accurate conversion dashboards.",
      ctaPrimary: "Audit My CRM Setup",
      ctaSecondary: "View Sample Workflows"
    },
    metrics: {
      label1: "Average Pipeline Efficiency",
      value1: "+44.5%",
      label2: "CRM Setup Deployment",
      value2: "5 Days",
      label3: "Leaked Lead Retrieval",
      value3: "Up to 30%"
    },
    features: [
      {
        title: "Smart List Segmentation",
        description: "We split your raw lead databases into responsive, action-based smart lists, ensuring your setters always contact the highest-value prospects first.",
        icon: "Layers"
      },
      {
        title: "Automated Omni-Channel Triggers",
        description: "Set up instant email, SMS, and WhatsApp alerts triggered by prospect actions to lock down user engagement in under 5 minutes.",
        icon: "Zap"
      },
      {
        title: "Unified Dashboard Metrics",
        description: "Track outbound touch volume, calendar appointments, closing ratios, and representative commission schedules inside a single, verified console.",
        icon: "BarChart"
      }
    ],
    calculator: {
      metricLabel: "Monthly Contact Database Size",
      metricMin: 100,
      metricMax: 5000,
      metricDefault: 1000,
      unitLabel: "Leads",
      basePricePerUnit: 0.5,
      revenueMultiplier: 8,
      valueLabel: "Calculated Database Asset Value"
    },
    testimonial: {
      quote: "Aero rebuilt our entire GoHighLevel workspace from scratch. The clean smart lists and custom triggers eliminated lead duplication and gave our outbound setters extreme clarity on who to dial next. Our booking efficiency surged by over 40%.",
      author: "Marcus Vance",
      role: "Chief Operating Officer",
      company: "Hyperion B2B Systems",
      avatarInitials: "MV"
    },
    faqs: [
      {
        question: "Do we need an existing GoHighLevel subscription?",
        answer: "Yes, you will need your own GHL subscription, or we can assist in provisioning a dedicated co-managed workspace for your agency's operations."
      },
      {
        question: "How do you protect prospect contact data?",
        answer: "We employ strict OAuth permission controls and customized staff security boundaries inside your GHL account, ensuring representatives only view details necessary for active dialing."
      }
    ],
    ctaSection: {
      headline: "Eliminate Friction. Automate Your Outbound Workspace.",
      subheadline: "Let our RevOps architects audit your GoHighLevel CRM structure and deploy a high-converting, leak-proof outbound framework in less than 5 days.",
      buttonText: "Request CRM Audit"
    },
    conversionInsights: {
      predictedConversionRate: 4.2,
      bounceRate: 22,
      predictedAov: "$4,500 setup",
      principlesUsed: ["Systems-Level Authority", "Workforce Leverage Framing", "Omni-Channel Trigger Speed", "Data Hygiene Focus"],
      editorialTeardown: "This angle targets operational excellence. High-ticket SaaS and agency founders often have lead-flow but lack organization. By promising custom GHL smart lists, trigger sequences, and hygiene tracking, we relieve the operational chaos of cold outreach."
    }
  }
};
