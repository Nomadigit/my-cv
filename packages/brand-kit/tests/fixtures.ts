import type { BrandFile } from "../src/types";

export const minimalBrand: BrandFile = {
  meta: { name: "Acme", version: "1.0.0" },
  identity: { displayName: "Acme Inc." },
  colors: {
    primary: "#1a73e8",
    text: "#111111",
    background: "#ffffff",
  },
  typography: {
    webFont: { family: "Inter", fallback: ["sans-serif"] },
    printFont: { family: "Georgia", fallback: ["serif"] },
    sizes: { body: "16px" },
    weights: { regular: 400, bold: 700 },
  },
  spacing: {},
  layout: {},
};

export const fullBrand: BrandFile = {
  meta: {
    name: "Acme",
    version: "2.1.0",
    description: "Acme corporate brand",
    updatedAt: "2026-01-15",
  },
  identity: {
    displayName: "Acme Inc.",
    tagline: "Built to last",
    legalName: "Acme Incorporated LLC",
    website: "https://acme.example",
    email: "hello@acme.example",
  },
  logo: {
    text: "ACME",
    lightSrc: "/logo-light.svg",
    darkSrc: "/logo-dark.svg",
    favicon: "/favicon.ico",
    minSize: 24,
    clearSpace: 8,
  },
  colors: {
    primary: "#1a73e8",
    secondary: "#34a853",
    accent: "#fbbc04",
    semantic: {
      success: "#188038",
      warning: "#f9ab00",
      error: "#d93025",
      info: "#1a73e8",
    },
    text: "#111111",
    background: "#ffffff",
    border: "#e0e0e0",
    darkMode: {
      primary: "#8ab4f8",
      secondary: "#81c995",
      accent: "#fdd663",
      text: "#e8eaed",
      background: "#202124",
      border: "#3c4043",
      logoSrc: "/logo-dark.svg",
    },
  },
  typography: {
    webFont: { family: "Inter", fallback: ["Helvetica Neue", "sans-serif"] },
    printFont: { family: "Georgia", fallback: ["Times New Roman", "serif"] },
    sizes: { h1: "32px", h2: "24px", h3: "20px", body: "16px", small: "13px" },
    weights: { regular: 400, medium: 500, bold: 700 },
    lineHeight: { heading: 1.2, body: 1.5 },
  },
  spacing: { unit: 8, borderRadius: 6 },
  layout: {
    web: { maxWidth: "1120px", containerPadding: "24px" },
    document: {
      pageSize: "A4",
      margins: { top: "2cm", right: "1.8cm", bottom: "2cm", left: "1.8cm" },
    },
    email: { maxWidth: "600px", contentPadding: "16px" },
  },
  letterhead: {
    addressLines: ["1 Market St", "San Francisco, CA 94105"],
    footerText: "Acme Incorporated LLC · acme.example",
    showLogoOn: ["document", "email"],
  },
  voice: {
    tone: ["direct", "warm", "confident"],
    avoid: ["jargon", "hype"],
  },
};

export const invalidBrand = {
  meta: { name: "Acme" },
  identity: { displayName: "Acme Inc." },
  colors: { primary: "#1a73e8" },
  typography: {
    webFont: { family: "Inter" },
    sizes: {},
    weights: {},
  },
  spacing: {},
};
