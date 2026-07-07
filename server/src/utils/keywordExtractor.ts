// // utils/keywordExtractor.ts

// export function extractKeywords(resumeData: any): string[] {
//   const keywords = new Set<string>();

//   // Skills
//   resumeData.skills?.forEach((s: string) =>
//     keywords.add(s.toLowerCase())
//   );

//   // Experience
//   resumeData.experience?.forEach((exp: any) => {
//     exp.title && keywords.add(exp.title.toLowerCase());

//     exp.description?.split(" ").forEach((word: string) => {
//       if (word.length > 3) keywords.add(word.toLowerCase());
//     });
//   });

//   // Projects
//   resumeData.projects?.forEach((proj: any) => {
//     proj.description?.split(" ").forEach((word: string) => {
//       if (word.length > 3) keywords.add(word.toLowerCase());
//     });
//   });

//   return Array.from(keywords);
// }

const TECH_KEYWORDS = new Set([
  "java", "spring", "spring boot", "node", "nodejs",
  "react", "angular", "typescript", "javascript",
  "mongodb", "mysql", "postgresql", "redis",
  "docker", "kubernetes", "aws", "graphql",
  "express", "html", "css", "tailwind",
  "bootstrap", "jenkins", "git", "microservices",
  "python", "django", "flask", "vue", "next", "nextjs",
  "php", "laravel", "rust", "golang", "go", "swift",
  "kotlin", "flutter", "react native", "firebase",
  "azure", "gcp", "linux", "nginx", "kafka", "rabbitmq",
  "elasticsearch", "jest", "cypress", "prisma", "sequelize",
  "c++", "c#", ".net", "ruby", "rails", "scala", "hadoop",
  "spark", "tensorflow", "pytorch", "machine learning", "ai",
  "devops", "ci/cd", "terraform", "ansible", "bash", "shell",
  "redux", "webpack", "vite", "sass", "figma", "rest", "api"
]);


export function extractKeywords(resumeData: any): string[] {
  const found = new Set<string>();

  // ✅ 1. Skills section — add directly (source of truth)
  resumeData?.skills?.forEach((skill: string) => {
    const s = skill.toLowerCase().trim();
    found.add(s); // always add raw skill

    // also check if it matches a known tech
    TECH_KEYWORDS.forEach((tech) => {
      if (s.includes(tech)) found.add(tech);
    });
  });

  // ✅ 2. Experience — only match against known tech keywords
  resumeData?.experience?.forEach((exp: any) => {
    const text = [
      exp.title || "",
      exp.description || "",
    ].join(" ").toLowerCase();

    TECH_KEYWORDS.forEach((tech) => {
      if (text.includes(tech)) found.add(tech);
    });
  });

  // ✅ 3. Projects — only match against known tech keywords
  resumeData?.projects?.forEach((proj: any) => {
    const text = [
      proj.title || "",
      proj.description || "",
      proj.technologies || "",
    ].join(" ").toLowerCase();

    TECH_KEYWORDS.forEach((tech) => {
      if (text.includes(tech)) found.add(tech);
    });
  });

  return Array.from(found);
}

// ✅ Extract role from resume
export function extractRole(resumeData: any): string {
  // 1. Personal info title (e.g. "Full Stack Developer")
  if (resumeData?.personalInfo?.title) {
    return resumeData.personalInfo.title;
  }

  // 2. First experience job title
  if (resumeData?.experience?.length > 0) {
    return resumeData.experience[0].title || "";
  }

  // 3. Fallback
  return "Software Developer";
}