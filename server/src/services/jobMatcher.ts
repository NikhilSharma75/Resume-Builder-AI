import axios from "axios";

// =======================
// TECH KEYWORDS (unchanged)
// =======================
const TECH_KEYWORDS = new Set([
  "java", "spring", "spring boot", "node", "nodejs",
  "react", "angular", "typescript", "javascript",
  "mongodb", "mysql", "postgresql", "redis",
  "docker", "kubernetes", "aws", "graphql",
  "express", "tailwind", "bootstrap", "jenkins",
  "git", "microservices", "python", "django", "flask",
  "vue", "next", "nextjs", "php", "laravel", "rust",
  "golang", "flutter", "react native", "firebase",
  "azure", "gcp", "linux", "nginx", "kafka", "rabbitmq",
  "elasticsearch", "jest", "cypress", "prisma", "sequelize",
  "tensorflow", "pytorch", "machine learning",
  "devops", "terraform", "ansible", "redux",
  "webpack", "vite", "sass", "figma"
]);

// =======================
// WORD MATCH (helper)
// =======================
const matchesKeyword = (text: string, tech: string): boolean => {
  const escaped = tech.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(^|[\\s,/+])${escaped}([\\s,/+]|$)`, "i");
  return regex.test(text);
};

// =======================
// KEYWORD EXTRACTION (for scoring)
// =======================
export function extractKeywords(resumeData: any): string[] {
  const found = new Set<string>();
  resumeData?.skills?.forEach((skill: string) => {
    const s = skill.toLowerCase();
    TECH_KEYWORDS.forEach((tech) => {
      if (matchesKeyword(s, tech)) found.add(tech);
    });
  });
  resumeData?.experience?.forEach((exp: any) => {
    const text = `${exp.title || ""} ${exp.description || ""}`.toLowerCase();
    TECH_KEYWORDS.forEach((tech) => {
      if (matchesKeyword(text, tech)) found.add(tech);
    });
  });
  resumeData?.projects?.forEach((proj: any) => {
    const text = `${proj.title || ""} ${proj.description || ""} ${proj.technologies || ""}`.toLowerCase();
    TECH_KEYWORDS.forEach((tech) => {
      if (matchesKeyword(text, tech)) found.add(tech);
    });
  });
  return Array.from(found);
}

// =======================
// ROLE + EXPERIENCE EXTRACTION
// =======================
export function extractRole(resumeData: any): string {
  if (resumeData?.personalInfo?.title?.trim()) return resumeData.personalInfo.title.trim();
  const exp = resumeData?.experience?.[0];
  return exp?.title || exp?.role || exp?.position || "Software Developer";
}

export function extractExperience(resumeData: any): string {
  const count = resumeData?.experience?.length || 0;
  if (count === 0) return "fresher";
  if (count === 1) return "junior";
  if (count <= 3) return "mid level";
  return "senior";
}

// =======================
// LOCATION NORMALIZER
// =======================
export function normalizeLocation(location: string) {
  if (!location) return { city: "", country: "" };
  const parts = location.split(",").map((p) => p.trim().toLowerCase());
  if (parts.length === 1) return { city: parts[0] || "", country: "" };
  return { city: parts[0] || "", country: parts[1] || "" };
}

// Simple mapping of country names to ISO 3166-1 alpha-2 codes
const countryCodeMap: Record<string, string> = {
  "india": "in",
  "united states": "us",
  "usa": "us",
  "canada": "ca",
  "united kingdom": "gb",
  "uk": "gb",
  "australia": "au",
  "germany": "de",
  "france": "fr",
  "netherlands": "nl",
  "singapore": "sg",
  "remote": ""
};

export function getCountryCode(countryName: string): string {
  const normalized = countryName.toLowerCase().trim();
  return countryCodeMap[normalized] || normalized; // fallback to the name itself
}

// =======================
// ADVANCED JSEARCH API (aligned with boilerplate)
// =======================
interface AdvancedJSearchParams {
  keyword: string;               // required: job title/keywords
  location?: string;             // optional: e.g., "Mohali, India"
  country?: string;              // optional: two-letter ISO code
  job_type?: string;             // optional: full-time, part-time, contract, internship
  experience_level?: string;     // optional: junior, mid, senior
  posted_days?: number;          // optional: days since posted (e.g., 7)
  page?: number;                 // optional: page number
  per_page?: number;             // optional: results per page (max 10)
}

export async function callAdvancedJSearch(params: AdvancedJSearchParams) {
  const {
    keyword,
    location,
    country,
    job_type = "full-time",      // default to full-time
    experience_level,
    posted_days = 7,             // match boilerplate: 7 days
    page = 1,
    per_page = 10,
  } = params;

  const requestParams: any = {
    keyword,
    page,
    per_page,
    job_type,
    posted_days,
  };

  if (location && location.trim()) requestParams.location = location.trim();
  if (country && country.trim()) requestParams.country = country.trim();
  if (experience_level) requestParams.experience_level = experience_level;

  try {
    const res = await axios.get(
      "https://advanced-jsearch-job-search-salary-intelligence-api.p.rapidapi.com/job-search",
      {
        params: requestParams,
        headers: {
          "X-RapidAPI-Key": process.env.RAPID_API_KEY!,
          "X-RapidAPI-Host": "advanced-jsearch-job-search-salary-intelligence-api.p.rapidapi.com",
        },
      }
    );
    return res.data?.data || [];
  } catch (error: any) {
    console.error("Advanced JSearch API Error:", error?.response?.data || error.message);
    throw error;
  }
}

// =======================
// EXPERIENCE FILTER (post‑fetch)
// =======================
export const filterByExperience = (jobs: any[], experience: string) => {
  const map: Record<string, number> = {
    fresher: 1,
    junior: 3,
    "mid level": 4,
    senior: 8,
  };
  const max = map[experience.toLowerCase()];
  if (!max) return jobs;
  return jobs.filter((job) => {
    const desc = (job.description || "").toLowerCase();
    const match = desc.match(/(\d+)\+?\s*years?/);
    if (!match) return true;
    const years = parseInt(match[1]);
    return years <= max;
  });
};

// =======================
// LOCATION FILTER (post‑fetch)
// =======================
export function filterJobsByLocation(jobs: any[], location: string) {
  if (!location || location.toLowerCase() === "remote") return jobs;
  const parts = location.toLowerCase().split(",").map((p) => p.trim());
  return jobs.filter((job) => {
    const jobLoc = [job.job_city, job.job_state, job.job_country]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return parts.every((part) => jobLoc.includes(part));
  });
}

// =======================
// SCORING & RANKING
// =======================
export function calculateJobScore(job: any, keywords: string[]) {
  let score = 0;
  const title = job.job_title?.toLowerCase() || "";
  const desc = job.job_description?.toLowerCase() || "";
  keywords.forEach((kw) => {
    if (title.includes(kw)) score += 25;
    else if (desc.includes(kw)) score += 5;
  });
  return Math.min(score, 100);
}

export function rankJobs(jobs: any[], keywords: string[]) {
  return jobs
    .map((job) => ({ ...job, score: calculateJobScore(job, keywords) }))
    .filter((job) => job.score >= 10)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);
}