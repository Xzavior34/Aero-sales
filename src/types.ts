export interface LandingPageData {
  productName: string;
  hero: {
    badge: string;
    headline: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  metrics: {
    label1: string;
    value1: string;
    label2: string;
    value2: string;
    label3: string;
    value3: string;
  };
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  calculator: {
    metricLabel: string;
    metricMin: number;
    metricMax: number;
    metricDefault: number;
    unitLabel: string;
    basePricePerUnit: number;
    revenueMultiplier: number;
    valueLabel: string;
  };
  testimonial: {
    quote: string;
    author: string;
    role: string;
    company: string;
    avatarInitials: string;
  };
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  ctaSection: {
    headline: string;
    subheadline: string;
    buttonText: string;
  };
  conversionInsights: {
    predictedConversionRate: number;
    bounceRate: number;
    predictedAov: string;
    principlesUsed: Array<string>;
    editorialTeardown: string;
  };
}

export type AestheticTheme = "obsidian_noir" | "emerald_glass" | "monochrome_luxury" | "arctic_frost";

export interface Role {
  id: string;
  title: string;
  department: string;
  description: string;
  requirements: string[];
  status: "active" | "draft" | "closed";
  createdAt: string;
}

export interface Signup {
  id: string;
  fullName: string;
  email: string;
  roleId: string;
  roleTitle: string;
  experience: string;
  status: "applied" | "interviewing" | "hired" | "pending" | "reviewed" | "shortlisted";
  timestamp: string;
}
