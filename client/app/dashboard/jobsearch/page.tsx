// // // // "use client";

// // // // import { useEffect, useState } from "react";
// // // // import { useRouter } from "next/navigation";
// // // // import Link from "next/link";
// // // // import api from "@/lib/api";
// // // // import { Button } from "@/components/ui/button";
// // // // import {
// // // //   ChevronLeft,
// // // //   Loader2,
// // // //   Sparkles,
// // // //   Building2,
// // // //   MapPin,
// // // //   ExternalLink,
// // // //   RefreshCw,
// // // //   Briefcase,
// // // //   Calendar,
// // // //   DollarSign,
// // // //   BarChart3,
// // // //   FileText,
// // // // } from "lucide-react";

// // // // import { motion } from "framer-motion";
// // // // import { toast } from "sonner";
// // // // import { ThemeToggle } from "@/components/ThemeToggle";

// // // // interface Resume {
// // // //   _id: string;
// // // //   title: string;
// // // // }

// // // // interface Job {
// // // //   title: string;
// // // //   company: string;
// // // //   location?: string;
// // // //   applyLink: string;
// // // //   description?: string;
// // // //   score: number;
// // // //   experience: string;
// // // //   job_type: string;
// // // //   salary_min: string;
// // // //   salary_max: string;
// // // //   salary_currency: string;
// // // //   posted_at: string;
// // // // }

// // // // export default function JobSearchPage() {
// // // //   const router = useRouter();

// // // //   const [resumes, setResumes] = useState<Resume[]>([]);
// // // //   const [selectedResumeId, setSelectedResumeId] = useState("");
// // // //   const [jobs, setJobs] = useState<Job[]>([]);

// // // //   const [loadingResumes, setLoadingResumes] = useState(true);
// // // //   const [loadingJobs, setLoadingJobs] = useState(false);

// // // //   const [location, setLocation] = useState("");
// // // //   const [role, setRole] = useState("");
// // // //   const [keywords, setKeywords] = useState<string[]>([]);
// // // //   const [experience, setExperience] = useState("");
// // // //   const [jobType, setJobType] = useState("full-time");
// // // //   const [postedDays, setPostedDays] = useState(7);
// // // // const [selectedJob, setSelectedJob] = useState<Job | null>(null);
// // // //   useEffect(() => {
// // // //     const user = localStorage.getItem("user");
// // // //     if (!user) {
// // // //       router.push("/login");
// // // //       return;
// // // //     }
// // // //     fetchResumes();
// // // //   }, []);

// // // //   const fetchResumes = async () => {
// // // //     try {
// // // //       const res = await api.get("/resumes");
// // // //       setResumes(res.data);
// // // //       if (res.data.length > 0) {
// // // //         setSelectedResumeId(res.data[0]._id);
// // // //       }
// // // //     } catch {
// // // //       toast.error("Failed to fetch resumes");
// // // //     } finally {
// // // //       setLoadingResumes(false);
// // // //     }
// // // //   };

// // // //   // 🔥 MAIN JOB SEARCH FUNCTION (UPDATED)
// // // //   // 🔥 MAIN JOB SEARCH FUNCTION
// // // // const handleSearchJobs = async () => {
// // // //   setLoadingJobs(true);
// // // //   const toastId = toast.loading("Finding best jobs for you...");

// // // //   try {
// // // //     // If role is typed, use it. Otherwise send empty so backend uses resume title
// // // //     const queryString = role.trim() 
// // // //       ? `${role} jobs in ${location || "India"}`
// // // //       : "";

// // // //     const res = await api.get("/jobs/search", {
// // // //       params: {
// // // //         keyword: queryString,
// // // //         resumeId: selectedResumeId, // Always send resume ID
// // // //         location: location,
// // // //         page: 1,
// // // //         num_pages: 1,
// // // //         country: "in",
// // // //         posted_days: "all",
// // // //       },
// // // //     });

// // // //     setJobs(res.data.jobs || []);
// // // //     toast.success(`Found ${res.data.total} jobs!`, { id: toastId });
    
// // // //     // Update role field with what was actually searched
// // // //     if (res.data.searchedQuery && !role) {
// // // //       // Extract job title from searched query
// // // //       const searchedTitle = res.data.searchedQuery.replace(' jobs', '').replace(` in ${location}`, '');
// // // //       setRole(searchedTitle);
// // // //     }
    
// // // //   } catch (error: any) {
// // // //     console.error("Search error:", error);
// // // //     toast.error("Failed to fetch jobs", { id: toastId });
// // // //   } finally {
// // // //     setLoadingJobs(false);
// // // //   }
// // // // };

// // // //   return (
// // // //     <div className="min-h-screen bg-background text-foreground">
// // // //       {/* HEADER */}
// // // //       <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
// // // //         <div className="flex items-center gap-4">
// // // //           <Link href="/dashboard" className="p-2 hover:bg-accent rounded-xl">
// // // //             <ChevronLeft size={24} />
// // // //           </Link>
// // // //           <h1 className="text-xl font-black">AI Job Matcher</h1>
// // // //         </div>
// // // //         <ThemeToggle />
// // // //       </header>

// // // //       <main className="mx-auto max-w-7xl px-8 py-12">
// // // //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
// // // //           {/* LEFT PANEL */}
// // // //           <motion.div
// // // //             initial={{ opacity: 0, x: -20 }}
// // // //             animate={{ opacity: 1, x: 0 }}
// // // //             className="space-y-8"
// // // //           >
// // // //             <div>
// // // //               <h2 className="text-3xl font-black">
// // // //                 Find Jobs Based on Your Skills
// // // //               </h2>
// // // //               <p className="text-muted-foreground">
// // // //                 Powered by AI + real job API
// // // //               </p>
// // // //             </div>

// // // //             <div className="p-8 rounded-3xl border bg-card shadow-xl space-y-6">

// // // //               {/* Resume Select */}
// // // //               <div>
// // // //                 <label className="text-sm font-black flex items-center gap-2">
// // // //                   <FileText size={14} /> Select Resume (Optional)
// // // //                 </label>
// // // //                 <select
// // // //                   value={selectedResumeId}
// // // //                   onChange={(e) => setSelectedResumeId(e.target.value)}
// // // //                   className="w-full h-12 px-4 rounded-xl bg-input border mt-1"
// // // //                 >
// // // //                   {loadingResumes ? (
// // // //                     <option>Loading resumes...</option>
// // // //                   ) : resumes.length === 0 ? (
// // // //                     <option>No resumes found</option>
// // // //                   ) : (
// // // //                     resumes.map((r) => (
// // // //                       <option key={r._id} value={r._id}>
// // // //                         {r.title}
// // // //                       </option>
// // // //                     ))
// // // //                   )}
// // // //                 </select>
// // // //               </div>

// // // //               {/* Role */}
// // // //               <div>
// // // //                 <label className="text-sm font-black flex items-center gap-2">
// // // //                   <Briefcase size={14} /> Role / Job Title
// // // //                 </label>
// // // //                 <input
// // // //                   placeholder="e.g. React Developer"
// // // //                   value={role}
// // // //                   onChange={(e) => setRole(e.target.value)}
// // // //                   className="w-full h-12 px-4 rounded-xl bg-input border mt-1"
// // // //                 />
// // // //               </div>

// // // //               {/* Experience */}
// // // //               <div>
// // // //                 <label className="text-sm font-black flex items-center gap-2">
// // // //                   <BarChart3 size={14} /> Experience Level
// // // //                 </label>
// // // //                 <select
// // // //                   value={experience}
// // // //                   onChange={(e) => setExperience(e.target.value)}
// // // //                   className="w-full h-12 px-4 rounded-xl bg-input border mt-1"
// // // //                 >
// // // //                   <option value="">Select</option>
// // // //                   <option value="fresher">Fresher</option>
// // // //                   <option value="junior">Junior</option>
// // // //                   <option value="mid level">Mid</option>
// // // //                   <option value="senior">Senior</option>
// // // //                 </select>
// // // //               </div>

// // // //               {/* Job Type */}
// // // //               <div>
// // // //                 <label className="text-sm font-black flex items-center gap-2">
// // // //                   <Briefcase size={14} /> Job Type
// // // //                 </label>
// // // //                 <select
// // // //                   value={jobType}
// // // //                   onChange={(e) => setJobType(e.target.value)}
// // // //                   className="w-full h-12 px-4 rounded-xl bg-input border mt-1"
// // // //                 >
// // // //                   <option value="full-time">Full-time</option>
// // // //                   <option value="part-time">Part-time</option>
// // // //                   <option value="contract">Contract</option>
// // // //                   <option value="internship">Internship</option>
// // // //                 </select>
// // // //               </div>

// // // //               {/* Posted Days */}
// // // //               <div>
// // // //                 <label className="text-sm font-black flex items-center gap-2">
// // // //                   <Calendar size={14} /> Posted Within
// // // //                 </label>
// // // //                 <select
// // // //                   value={postedDays}
// // // //                   onChange={(e) => setPostedDays(Number(e.target.value))}
// // // //                   className="w-full h-12 px-4 rounded-xl bg-input border mt-1"
// // // //                 >
// // // //                   <option value={1}>24 hours</option>
// // // //                   <option value={7}>7 days</option>
// // // //                   <option value={14}>14 days</option>
// // // //                   <option value={30}>30 days</option>
// // // //                 </select>
// // // //               </div>

// // // //               {/* Location */}
// // // //               <div>
// // // //                 <label className="text-sm font-black flex items-center gap-2">
// // // //                   <MapPin size={14} /> Location
// // // //                 </label>
// // // //                 <input
// // // //                   placeholder="e.g. Mumbai or Remote"
// // // //                   value={location}
// // // //                   onChange={(e) => setLocation(e.target.value)}
// // // //                   className="w-full h-12 px-4 rounded-xl bg-input border mt-1"
// // // //                 />
// // // //               </div>

// // // //               {/* Button */}
// // // //               <Button
// // // //                 onClick={handleSearchJobs}
// // // //                 disabled={loadingJobs}
// // // //                 className="w-full h-14 text-lg font-bold"
// // // //               >
// // // //                 {loadingJobs ? (
// // // //                   <>
// // // //                     <Loader2 className="animate-spin mr-2" /> Searching...
// // // //                   </>
// // // //                 ) : (
// // // //                   <>
// // // //                     <Sparkles className="mr-2" /> Find Jobs
// // // //                   </>
// // // //                 )}
// // // //               </Button>
// // // //             </div>
// // // //           </motion.div>

// // // //           {/* RIGHT PANEL */}
// // // //           {/* <motion.div
// // // //             initial={{ opacity: 0, x: 20 }}
// // // //             animate={{ opacity: 1, x: 0 }}
// // // //           >
// // // //             <div className="mb-6 flex justify-between items-center">
// // // //               <h2 className="text-3xl font-black">Matched Jobs</h2>
// // // //               {jobs.length > 0 && (
// // // //                 <Button
// // // //                   size="sm"
// // // //                   onClick={handleSearchJobs}
// // // //                   disabled={loadingJobs}
// // // //                 >
// // // //                   <RefreshCw size={14} /> Refresh
// // // //                 </Button>
// // // //               )}
// // // //             </div>

// // // //             {loadingJobs ? (
// // // //               <div className="flex justify-center items-center h-[500px] border rounded-3xl">
// // // //                 <Loader2 className="animate-spin h-10 w-10" />
// // // //               </div>
// // // //             ) : jobs.length === 0 ? (
// // // //               <div className="h-[500px] flex items-center justify-center border rounded-3xl">
// // // //                 No jobs found
// // // //               </div>
// // // //             ) : (
// // // //               <div className="space-y-4 max-h-[600px] overflow-y-auto">
// // // //                 {jobs.map((job, i) => (
// // // //                   <div
// // // //                     key={i}
// // // //                     className="p-5 border rounded-2xl bg-card"
// // // //                   >
// // // //                     <h3 className="font-bold">{job.title}</h3>
// // // //                     <p className="text-sm text-muted-foreground">
// // // //                       {job.company}
// // // //                     </p>
// // // //                     <p className="text-sm text-muted-foreground">
// // // //                       {job.location}
// // // //                     </p>

// // // //                     <a
// // // //                       href={job.applyLink}
// // // //                       target="_blank"
// // // //                       className="text-primary text-sm mt-2 inline-block"
// // // //                     >
// // // //                       Apply <ExternalLink size={12} />
// // // //                     </a>
// // // //                   </div>
// // // //                 ))}
// // // //               </div>
// // // //             )}
// // // //           </motion.div> */}
// // // //           <motion.div
// // // //             initial={{ opacity: 0, x: 20 }}
// // // //             animate={{ opacity: 1, x: 0 }}
// // // //           >
// // // //             <div className="mb-6 flex justify-between items-center">
// // // //               <h2 className="text-3xl font-black">Matched Jobs</h2>

// // // //               {jobs.length > 0 && (
// // // //                 <Button size="sm" onClick={handleSearchJobs} disabled={loadingJobs}>
// // // //                   <RefreshCw size={14} className={loadingJobs ? "animate-spin" : ""} />
// // // //                   Refresh
// // // //                 </Button>
// // // //               )}
// // // //             </div>

// // // //             {loadingJobs ? (
// // // //               <div className="flex justify-center items-center h-[500px] border rounded-3xl">
// // // //                 <Loader2 className="animate-spin h-10 w-10" />
// // // //               </div>
// // // //             ) : jobs.length === 0 ? (
// // // //               <div className="h-[500px] flex items-center justify-center border rounded-3xl text-muted-foreground">
// // // //                 No jobs found
// // // //               </div>
// // // //             ) : (
// // // //               <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
// // // //                 {jobs.map((job, i) => (
// // // //                   <div
// // // //                     key={i}
// // // //                     className="p-5 border rounded-2xl bg-card shadow-sm hover:shadow-md transition"
// // // //                   >
// // // //                     {/* Top */}
// // // //                     <div className="flex justify-between items-start gap-2">
// // // //                       <h3 className="font-bold text-lg leading-tight">
// // // //                         {job.title}
// // // //                       </h3>

// // // //                       <span
// // // //                         className={`text-xs font-bold px-2 py-1 rounded-full ${job.score >= 70
// // // //                           ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
// // // //                           : job.score >= 40
// // // //                             ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
// // // //                             : "bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400"
// // // //                           }`}
// // // //                       >
// // // //                         {job.score}% Match
// // // //                       </span>
// // // //                     </div>

// // // //                     {/* Company */}
// // // //                     <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
// // // //                       <Building2 size={14} /> {job.company}
// // // //                     </p>

// // // //                     {/* Location */}
// // // //                     <p className="text-sm text-muted-foreground flex items-center gap-2">
// // // //                       <MapPin size={14} /> {job.location}
// // // //                     </p>

// // // //                     {/* Details */}
// // // //                     <div className="flex flex-wrap gap-3 mt-3 text-xs font-medium">
// // // //                       <span className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
// // // //                         <Briefcase size={12} /> {job.job_type}
// // // //                       </span>

// // // //                       <span className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
// // // //                         <BarChart3 size={12} /> {job.experience}
// // // //                       </span>

// // // //                       <span className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
// // // //                         <Calendar size={12} /> {job.posted_at}
// // // //                       </span>
// // // //                     </div>

// // // //                     {/* Salary */}
// // // //                     <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
// // // //                       <DollarSign size={14} />
// // // //                       {job.salary_min !== "Unknown"
// // // //                         ? `${job.salary_currency} ${job.salary_min} - ${job.salary_max}`
// // // //                         : "Salary not disclosed"}
// // // //                     </div>

// // // //                     {/* Description */}
// // // //                     {job.description && (
// // // //                       <p className="text-xs text-muted-foreground mt-3 line-clamp-2">
// // // //                         {job.description}...
// // // //                       </p>
// // // //                     )}

// // // // {/* View Description Button */}
// // // // <Button
// // // //   variant="outline"
// // // //   size="sm"
// // // //   className="mt-3"
// // // //   onClick={() => setSelectedJob(job)}
// // // // >
// // // //   View Description
// // // // </Button>


// // // //                     {/* Apply */}
// // // //                     <div className="mt-4">
// // // //                       <a
// // // //                         href={job.applyLink}
// // // //                         target="_blank"
// // // //                         rel="noopener noreferrer"
// // // //                         className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
// // // //                       >
// // // //                         Apply Now <ExternalLink size={13} />
// // // //                       </a>
// // // //                     </div>
// // // //                   </div>
// // // //                 ))}
// // // //               </div>
// // // //             )}
// // // //           </motion.div>
// // // //         </div>
// // // //       </main>
// // // //       {/* JOB DESCRIPTION MODAL */}
// // // // {selectedJob && (
// // // //   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
// // // //     <div className="w-[90%] max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-2xl">

// // // //       {/* Header */}
// // // //       <div className="flex justify-between items-start mb-4">
// // // //         <div>
// // // //           <h2 className="text-xl font-bold">{selectedJob.title}</h2>
// // // //           <p className="text-sm text-muted-foreground">
// // // //             {selectedJob.company} • {selectedJob.location}
// // // //           </p>
// // // //         </div>

// // // //         <button
// // // //           onClick={() => setSelectedJob(null)}
// // // //           className="text-muted-foreground hover:text-foreground text-xl"
// // // //         >
// // // //           ✕
// // // //         </button>
// // // //       </div>

// // // //       {/* Meta Info */}
// // // //       <div className="flex flex-wrap gap-2 mb-4 text-xs">
// // // //         <span className="px-2 py-1 bg-muted rounded">
// // // //           {selectedJob.job_type}
// // // //         </span>
// // // //         <span className="px-2 py-1 bg-muted rounded">
// // // //           {selectedJob.experience}
// // // //         </span>
// // // //         <span className="px-2 py-1 bg-muted rounded">
// // // //           {selectedJob.posted_at}
// // // //         </span>
// // // //       </div>

// // // //       {/* Salary */}
// // // //       <div className="mb-4 text-sm text-muted-foreground">
// // // //         {selectedJob.salary_min !== "Unknown"
// // // //           ? `${selectedJob.salary_currency} ${selectedJob.salary_min} - ${selectedJob.salary_max}`
// // // //           : "Salary not disclosed"}
// // // //       </div>

// // // //       {/* FULL DESCRIPTION */}
// // // //       <div className="text-sm leading-relaxed whitespace-pre-line text-foreground">
// // // //         {selectedJob.description || "No description available"}
// // // //       </div>

// // // //       {/* Apply Button */}
// // // //       <div className="mt-6 flex justify-end">
// // // //         <a
// // // //           href={selectedJob.applyLink}
// // // //           target="_blank"
// // // //           rel="noopener noreferrer"
// // // //         >
// // // //           <Button>
// // // //             Apply Now <ExternalLink size={14} />
// // // //           </Button>
// // // //         </a>
// // // //       </div>
// // // //     </div>
// // // //   </div>
// // // // )}
// // // //     </div>
// // // //   );
// // // // }


// // // //////////////////
// // // "use client";

// // // import { useEffect, useState, useRef, useCallback } from "react";
// // // import { useRouter } from "next/navigation";
// // // import Link from "next/link";
// // // import api from "@/lib/api";
// // // import { Button } from "@/components/ui/button";
// // // import {
// // //   ChevronLeft,
// // //   Loader2,
// // //   Sparkles,
// // //   Building2,
// // //   MapPin,
// // //   ExternalLink,
// // //   RefreshCw,
// // //   Briefcase,
// // //   Calendar,
// // //   DollarSign,
// // //   BarChart3,
// // //   FileText,
// // // } from "lucide-react";

// // // import { motion } from "framer-motion";
// // // import { toast } from "sonner";
// // // import { ThemeToggle } from "@/components/ThemeToggle";

// // // interface Resume {
// // //   _id: string;
// // //   title: string;
// // // }

// // // interface Job {
// // //   title: string;
// // //   company: string;
// // //   location?: string;
// // //   applyLink: string;
// // //   description?: string;
// // //   score: number;
// // //   experience: string;
// // //   job_type: string;
// // //   salary_min: string;
// // //   salary_max: string;
// // //   salary_currency: string;
// // //   posted_at: string;
// // // }

// // // export default function JobSearchPage() {
// // //   const router = useRouter();

// // //   const [resumes, setResumes] = useState<Resume[]>([]);
// // //   const [selectedResumeId, setSelectedResumeId] = useState("");
// // //   const [jobs, setJobs] = useState<Job[]>([]);

// // //   const [loadingResumes, setLoadingResumes] = useState(true);
// // //   const [loadingJobs, setLoadingJobs] = useState(false);

// // //   const [location, setLocation] = useState("");
// // //   const [role, setRole] = useState("");
// // //   const [experience, setExperience] = useState("");
// // //   const [jobType, setJobType] = useState("full-time");
// // //   const [postedDays, setPostedDays] = useState(7);
// // //   const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
// // //   // Track if user manually changed inputs
// // //   const [userChangedRole, setUserChangedRole] = useState(false);
// // //   const [userChangedLocation, setUserChangedLocation] = useState(false);
  
// // //   // Ref to prevent duplicate auto-fill
// // //   const hasAutoFilled = useRef(false);

// // //   // Check authentication
// // //   useEffect(() => {
// // //     const user = localStorage.getItem("user");
// // //     if (!user) {
// // //       router.push("/login");
// // //       return;
// // //     }
// // //   }, [router]);

// // //   // Fetch resumes on mount
// // //   useEffect(() => {
// // //     fetchResumes();
// // //   }, []);

// // //   const fetchResumes = async () => {
// // //     try {
// // //       setLoadingResumes(true);
// // //       const res = await api.get("/resumes");
// // //       setResumes(res.data);
// // //       if (res.data.length > 0 && !selectedResumeId) {
// // //         setSelectedResumeId(res.data[0]._id);
// // //       }
// // //     } catch {
// // //       toast.error("Failed to fetch resumes");
// // //     } finally {
// // //       setLoadingResumes(false);
// // //     }
// // //   };

// // //   // Auto-fill job title and location when resume is selected
// // //   useEffect(() => {
// // //     if (!selectedResumeId || resumes.length === 0) return;

// // //     const fetchResumeDetails = async () => {
// // //       try {
// // //         const res = await api.get(`/resumes/${selectedResumeId}`);
// // //         const resume = res.data;
        
// // //         // Auto-fill role from resume (only if user hasn't manually changed it)
// // //         if (!userChangedRole && resume?.personalInfo?.jobTitle) {
// // //           setRole(resume.personalInfo.jobTitle);
// // //         }
        
// // //         // Auto-fill location from resume (only if user hasn't manually changed it)
// // //         if (!userChangedLocation && resume?.personalInfo?.location) {
// // //           setLocation(resume.personalInfo.location);
// // //         }
        
// // //         hasAutoFilled.current = true;
// // //       } catch (err) {
// // //         console.log('Could not fetch resume details');
// // //       }
// // //     };
    
// // //     fetchResumeDetails();
// // //   }, [selectedResumeId]); // Only runs when resume selection changes

// // //   // Handle role input change
// // //   const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     setRole(e.target.value);
// // //     setUserChangedRole(true);
// // //   };

// // //   // Handle location input change
// // //   const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     setLocation(e.target.value);
// // //     setUserChangedLocation(true);
// // //   };

// // //   // Handle resume selection change
// // //   const handleResumeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
// // //     setSelectedResumeId(e.target.value);
// // //     // Reset flags when resume changes so new resume can auto-fill
// // //     setUserChangedRole(false);
// // //     setUserChangedLocation(false);
// // //     hasAutoFilled.current = false;
// // //   };

// // //   // 🔥 MAIN JOB SEARCH FUNCTION
// // //   const handleSearchJobs = useCallback(async () => {
// // //     setLoadingJobs(true);
// // //     const toastId = toast.loading("Finding best jobs for you...");

// // //     try {
// // //       // If role is typed, use it. Otherwise send empty so backend uses resume title
// // //       const queryString = role.trim() 
// // //         ? `${role} jobs in ${location || "India"}`
// // //         : "";

// // //       const res = await api.get("/jobs/search", {
// // //         params: {
// // //           keyword: queryString,
// // //           resumeId: selectedResumeId,
// // //           location: location,
// // //           page: 1,
// // //           num_pages: 1,
// // //           country: "in",
// // //           posted_days: "all",
// // //         },
// // //       });

// // //       setJobs(res.data.jobs || []);
// // //       toast.success(`Found ${res.data.total} jobs!`, { id: toastId });
      
// // //       // Update role field with what was actually searched (if auto-detected)
// // //       if (res.data.searchedQuery && !userChangedRole) {
// // //         const searchedTitle = res.data.searchedQuery
// // //           .replace(' jobs', '')
// // //           .replace(` in ${location || 'India'}`, '')
// // //           .trim();
// // //         if (searchedTitle) {
// // //           setRole(searchedTitle);
// // //         }
// // //       }
// // //     } catch (error: any) {
// // //       console.error("Search error:", error);
// // //       toast.error("Failed to fetch jobs", { id: toastId });
// // //     } finally {
// // //       setLoadingJobs(false);
// // //     }
// // //   }, [role, location, selectedResumeId, userChangedRole]);

// // //   return (
// // //     <div className="min-h-screen bg-background text-foreground">
// // //       {/* HEADER */}
// // //       <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
// // //         <div className="flex items-center gap-4">
// // //           <Link href="/dashboard" className="p-2 hover:bg-accent rounded-xl">
// // //             <ChevronLeft size={24} />
// // //           </Link>
// // //           <h1 className="text-xl font-black">AI Job Matcher</h1>
// // //         </div>
// // //         <ThemeToggle />
// // //       </header>

// // //       <main className="mx-auto max-w-7xl px-8 py-12">
// // //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
// // //           {/* LEFT PANEL - SEARCH FORM */}
// // //           <motion.div
// // //             initial={{ opacity: 0, x: -20 }}
// // //             animate={{ opacity: 1, x: 0 }}
// // //             className="space-y-8"
// // //           >
// // //             <div>
// // //               <h2 className="text-3xl font-black">
// // //                 Find Jobs Based on Your Skills
// // //               </h2>
// // //               <p className="text-muted-foreground">
// // //                 Auto-detects job title from your resume
// // //               </p>
// // //             </div>

// // //             <div className="p-8 rounded-3xl border bg-card shadow-xl space-y-6">
// // //               {/* Resume Select */}
// // //               <div>
// // //                 <label className="text-sm font-black flex items-center gap-2">
// // //                   <FileText size={14} /> Select Resume
// // //                 </label>
// // //                 <select
// // //                   value={selectedResumeId}
// // //                   onChange={handleResumeChange}
// // //                   className="w-full h-12 px-4 rounded-xl bg-input border mt-1"
// // //                 >
// // //                   {loadingResumes ? (
// // //                     <option>Loading resumes...</option>
// // //                   ) : resumes.length === 0 ? (
// // //                     <option>No resumes found</option>
// // //                   ) : (
// // //                     resumes.map((r) => (
// // //                       <option key={r._id} value={r._id}>
// // //                         {r.title}
// // //                       </option>
// // //                     ))
// // //                   )}
// // //                 </select>
// // //                 <p className="text-xs text-muted-foreground mt-1">
// // //                   Job title will auto-fill from selected resume
// // //                 </p>
// // //               </div>

// // //               {/* Role */}
// // //               <div>
// // //                 <label className="text-sm font-black flex items-center gap-2">
// // //                   <Briefcase size={14} /> Role / Job Title
// // //                 </label>
// // //                 <input
// // //                   placeholder="Auto-filled from resume, or type manually"
// // //                   value={role}
// // //                   onChange={handleRoleChange}
// // //                   className="w-full h-12 px-4 rounded-xl bg-input border mt-1"
// // //                 />
// // //               </div>

// // //               {/* Location */}
// // //               <div>
// // //                 <label className="text-sm font-black flex items-center gap-2">
// // //                   <MapPin size={14} /> Location
// // //                 </label>
// // //                 <input
// // //                   placeholder="e.g. Mumbai, Remote, or auto-filled"
// // //                   value={location}
// // //                   onChange={handleLocationChange}
// // //                   className="w-full h-12 px-4 rounded-xl bg-input border mt-1"
// // //                 />
// // //               </div>

// // //               {/* Experience */}
// // //               <div>
// // //                 <label className="text-sm font-black flex items-center gap-2">
// // //                   <BarChart3 size={14} /> Experience Level
// // //                 </label>
// // //                 <select
// // //                   value={experience}
// // //                   onChange={(e) => setExperience(e.target.value)}
// // //                   className="w-full h-12 px-4 rounded-xl bg-input border mt-1"
// // //                 >
// // //                   <option value="">Any</option>
// // //                   <option value="fresher">Fresher</option>
// // //                   <option value="junior">Junior (1-2 years)</option>
// // //                   <option value="mid level">Mid Level (3-5 years)</option>
// // //                   <option value="senior">Senior (5+ years)</option>
// // //                 </select>
// // //               </div>

// // //               {/* Job Type */}
// // //               <div>
// // //                 <label className="text-sm font-black flex items-center gap-2">
// // //                   <Briefcase size={14} /> Job Type
// // //                 </label>
// // //                 <select
// // //                   value={jobType}
// // //                   onChange={(e) => setJobType(e.target.value)}
// // //                   className="w-full h-12 px-4 rounded-xl bg-input border mt-1"
// // //                 >
// // //                   <option value="full-time">Full-time</option>
// // //                   <option value="part-time">Part-time</option>
// // //                   <option value="contract">Contract</option>
// // //                   <option value="internship">Internship</option>
// // //                 </select>
// // //               </div>

// // //               {/* Posted Days */}
// // //               <div>
// // //                 <label className="text-sm font-black flex items-center gap-2">
// // //                   <Calendar size={14} /> Posted Within
// // //                 </label>
// // //                 <select
// // //                   value={postedDays}
// // //                   onChange={(e) => setPostedDays(Number(e.target.value))}
// // //                   className="w-full h-12 px-4 rounded-xl bg-input border mt-1"
// // //                 >
// // //                   <option value={1}>24 hours</option>
// // //                   <option value={7}>7 days</option>
// // //                   <option value={14}>14 days</option>
// // //                   <option value={30}>30 days</option>
// // //                 </select>
// // //               </div>

// // //               {/* Search Button */}
// // //               <Button
// // //                 onClick={handleSearchJobs}
// // //                 disabled={loadingJobs}
// // //                 className="w-full h-14 text-lg font-bold"
// // //               >
// // //                 {loadingJobs ? (
// // //                   <>
// // //                     <Loader2 className="animate-spin mr-2" /> Searching...
// // //                   </>
// // //                 ) : (
// // //                   <>
// // //                     <Sparkles className="mr-2" /> Find Jobs
// // //                   </>
// // //                 )}
// // //               </Button>
// // //             </div>
// // //           </motion.div>

// // //           {/* RIGHT PANEL - JOB RESULTS */}
// // //           <motion.div
// // //             initial={{ opacity: 0, x: 20 }}
// // //             animate={{ opacity: 1, x: 0 }}
// // //           >
// // //             <div className="mb-6 flex justify-between items-center">
// // //               <h2 className="text-3xl font-black">
// // //                 {jobs.length > 0 ? `Matched Jobs (${jobs.length})` : "Matched Jobs"}
// // //               </h2>

// // //               {jobs.length > 0 && (
// // //                 <Button size="sm" onClick={handleSearchJobs} disabled={loadingJobs}>
// // //                   <RefreshCw size={14} className={loadingJobs ? "animate-spin" : ""} />
// // //                   Refresh
// // //                 </Button>
// // //               )}
// // //             </div>

// // //             {loadingJobs ? (
// // //               <div className="flex justify-center items-center h-[500px] border rounded-3xl">
// // //                 <Loader2 className="animate-spin h-10 w-10" />
// // //               </div>
// // //             ) : jobs.length === 0 ? (
// // //               <div className="h-[500px] flex flex-col items-center justify-center border rounded-3xl text-muted-foreground gap-4">
// // //                 <FileText size={48} className="opacity-30" />
// // //                 <p>Select a resume and click "Find Jobs" to start</p>
// // //               </div>
// // //             ) : (
// // //               <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
// // //                 {jobs.map((job, i) => (
// // //                   <div
// // //                     key={i}
// // //                     className="p-5 border rounded-2xl bg-card shadow-sm hover:shadow-md transition"
// // //                   >
// // //                     {/* Top Row: Title + Score */}
// // //                     <div className="flex justify-between items-start gap-2">
// // //                       <h3 className="font-bold text-lg leading-tight">
// // //                         {job.title}
// // //                       </h3>

// // //                       <span
// // //                         className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${
// // //                           job.score >= 70
// // //                             ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
// // //                             : job.score >= 40
// // //                             ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
// // //                             : "bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400"
// // //                         }`}
// // //                       >
// // //                         {job.score}% Match
// // //                       </span>
// // //                     </div>

// // //                     {/* Company */}
// // //                     <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
// // //                       <Building2 size={14} /> {job.company}
// // //                     </p>

// // //                     {/* Location */}
// // //                     <p className="text-sm text-muted-foreground flex items-center gap-2">
// // //                       <MapPin size={14} /> {job.location}
// // //                     </p>

// // //                     {/* Details Tags */}
// // //                     <div className="flex flex-wrap gap-3 mt-3 text-xs font-medium">
// // //                       <span className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
// // //                         <Briefcase size={12} /> {job.job_type}
// // //                       </span>
// // //                       <span className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
// // //                         <BarChart3 size={12} /> {job.experience}
// // //                       </span>
// // //                       <span className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
// // //                         <Calendar size={12} /> {job.posted_at}
// // //                       </span>
// // //                     </div>

// // //                     {/* Salary */}
// // //                     <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
// // //                       <DollarSign size={14} />
// // //                       {job.salary_min !== "Unknown"
// // //                         ? `${job.salary_currency || "$"} ${job.salary_min} - ${job.salary_max}`
// // //                         : "Salary not disclosed"}
// // //                     </div>

// // //                     {/* Description Preview */}
// // //                     {job.description && (
// // //                       <p className="text-xs text-muted-foreground mt-3 line-clamp-2">
// // //                         {job.description.replace(/<[^>]*>/g, '').substring(0, 200)}...
// // //                       </p>
// // //                     )}

// // //                     {/* Action Buttons */}
// // //                     <div className="flex gap-2 mt-3">
// // //                       <Button
// // //                         variant="outline"
// // //                         size="sm"
// // //                         onClick={() => setSelectedJob(job)}
// // //                       >
// // //                         View Description
// // //                       </Button>
// // //                     </div>

// // //                     {/* Apply Link */}
// // //                     <div className="mt-4">
// // //                       <a
// // //                         href={job.applyLink}
// // //                         target="_blank"
// // //                         rel="noopener noreferrer"
// // //                         className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
// // //                       >
// // //                         Apply Now <ExternalLink size={13} />
// // //                       </a>
// // //                     </div>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             )}
// // //           </motion.div>
// // //         </div>
// // //       </main>

// // //       {/* JOB DESCRIPTION MODAL */}
// // //       {selectedJob && (
// // //         <div 
// // //           className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
// // //           onClick={() => setSelectedJob(null)}
// // //         >
// // //           <div 
// // //             className="w-[90%] max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-2xl"
// // //             onClick={(e) => e.stopPropagation()}
// // //           >
// // //             {/* Header */}
// // //             <div className="flex justify-between items-start mb-4">
// // //               <div>
// // //                 <h2 className="text-xl font-bold">{selectedJob.title}</h2>
// // //                 <p className="text-sm text-muted-foreground">
// // //                   {selectedJob.company} • {selectedJob.location}
// // //                 </p>
// // //               </div>
// // //               <button
// // //                 onClick={() => setSelectedJob(null)}
// // //                 className="text-muted-foreground hover:text-foreground text-xl p-1"
// // //               >
// // //                 ✕
// // //               </button>
// // //             </div>

// // //             {/* Meta Info */}
// // //             <div className="flex flex-wrap gap-2 mb-4 text-xs">
// // //               <span className="px-2 py-1 bg-muted rounded">{selectedJob.job_type}</span>
// // //               <span className="px-2 py-1 bg-muted rounded">{selectedJob.experience}</span>
// // //               <span className="px-2 py-1 bg-muted rounded">{selectedJob.posted_at}</span>
// // //               <span className="px-2 py-1 bg-muted rounded">
// // //                 Match: {selectedJob.score}%
// // //               </span>
// // //             </div>

// // //             {/* Salary */}
// // //             <div className="mb-4 text-sm text-muted-foreground">
// // //               {selectedJob.salary_min !== "Unknown"
// // //                 ? `💰 ${selectedJob.salary_currency || "$"} ${selectedJob.salary_min} - ${selectedJob.salary_max}`
// // //                 : "💰 Salary not disclosed"}
// // //             </div>

// // //             {/* Full Description */}
// // //             <div className="text-sm leading-relaxed whitespace-pre-line text-foreground">
// // //               {selectedJob.description 
// // //                 ? selectedJob.description.replace(/<[^>]*>/g, '')
// // //                 : "No description available"}
// // //             </div>

// // //             {/* Apply Button */}
// // //             <div className="mt-6 flex justify-end">
// // //               <a
// // //                 href={selectedJob.applyLink}
// // //                 target="_blank"
// // //                 rel="noopener noreferrer"
// // //               >
// // //                 <Button>
// // //                   Apply Now <ExternalLink size={14} className="ml-1" />
// // //                 </Button>
// // //               </a>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }


// // /////////////
// // "use client";

// // import { useEffect, useState, useCallback } from "react";
// // import { useRouter } from "next/navigation";
// // import Link from "next/link";
// // import api from "@/lib/api";
// // import { Button } from "@/components/ui/button";
// // import {
// //   ChevronLeft,
// //   Loader2,
// //   Sparkles,
// //   Building2,
// //   MapPin,
// //   ExternalLink,
// //   RefreshCw,
// //   Briefcase,
// //   Calendar,
// //   DollarSign,
// //   BarChart3,
// //   FileText,
// // } from "lucide-react";

// // import { motion } from "framer-motion";
// // import { toast } from "sonner";
// // import { ThemeToggle } from "@/components/ThemeToggle";

// // interface Resume {
// //   _id: string;
// //   title: string;
// //   personalInfo?: {
// //     fullName?: string;
// //     jobTitle?: string;
// //     email?: string;
// //     location?: string;
// //     summary?: string;
// //     phone?: string;
// //   };
// // }

// // interface Job {
// //   title: string;
// //   company: string;
// //   location?: string;
// //   applyLink: string;
// //   description?: string;
// //   score: number;
// //   experience: string;
// //   job_type: string;
// //   salary_min: string;
// //   salary_max: string;
// //   salary_currency: string;
// //   posted_at: string;
// // }

// // export default function JobSearchPage() {
// //   const router = useRouter();

// //   const [resumes, setResumes] = useState<Resume[]>([]);
// //   const [selectedResumeId, setSelectedResumeId] = useState("");
// //   const [jobs, setJobs] = useState<Job[]>([]);

// //   const [loadingResumes, setLoadingResumes] = useState(true);
// //   const [loadingJobs, setLoadingJobs] = useState(false);

// //   const [location, setLocation] = useState("");
// //   const [role, setRole] = useState("");
// //   const [experience, setExperience] = useState("");
// //   const [jobType, setJobType] = useState("full-time");
// //   const [postedDays, setPostedDays] = useState(7);
// //   const [selectedJob, setSelectedJob] = useState<Job | null>(null);

// //   // Track if user manually changed inputs
// //   const [userChangedRole, setUserChangedRole] = useState(false);
// //   const [userChangedLocation, setUserChangedLocation] = useState(false);

// //   // Check authentication
// //   useEffect(() => {
// //     const user = localStorage.getItem("user");
// //     if (!user) {
// //       router.push("/login");
// //       return;
// //     }
// //   }, [router]);

// //   // Fetch resumes on mount
// //   useEffect(() => {
// //     fetchResumes();
// //   }, []);

// //   const fetchResumes = async () => {
// //     try {
// //       setLoadingResumes(true);
// //       const res = await api.get("/resumes");
// //       const resumeData = res.data;
// //       setResumes(resumeData);
      
// //       if (resumeData.length > 0 && !selectedResumeId) {
// //         const firstResume = resumeData[0];
// //         setSelectedResumeId(firstResume._id);
        
// //         // Auto-fill from first resume
// //         if (firstResume.personalInfo?.jobTitle) {
// //           setRole(firstResume.personalInfo.jobTitle);
// //         }
// //         if (firstResume.personalInfo?.location) {
// //           setLocation(firstResume.personalInfo.location);
// //         }
// //       }
// //     } catch {
// //       toast.error("Failed to fetch resumes");
// //     } finally {
// //       setLoadingResumes(false);
// //     }
// //   };

// //   // Handle resume selection change
// //   const handleResumeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
// //     const newResumeId = e.target.value;
// //     setSelectedResumeId(newResumeId);
    
// //     // Reset manual change flags
// //     setUserChangedRole(false);
// //     setUserChangedLocation(false);

// //     // Immediately auto-fill from the selected resume
// //     if (newResumeId) {
// //       const selected = resumes.find(r => r._id === newResumeId);
// //       if (selected?.personalInfo) {
// //         if (selected.personalInfo.jobTitle) {
// //           setRole(selected.personalInfo.jobTitle);
// //         } else {
// //           setRole("");
// //         }
        
// //         if (selected.personalInfo.location) {
// //           setLocation(selected.personalInfo.location);
// //         } else {
// //           setLocation("");
// //         }
// //       } else {
// //         setRole("");
// //         setLocation("");
// //       }
// //     }
// //   };

// //   // Handle role input change
// //   const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     setRole(e.target.value);
// //     setUserChangedRole(true);
// //   };

// //   // Handle location input change
// //   const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     setLocation(e.target.value);
// //     setUserChangedLocation(true);
// //   };

// //   // 🔥 MAIN JOB SEARCH FUNCTION
// //   const handleSearchJobs = useCallback(async () => {
// //     setLoadingJobs(true);
// //     const toastId = toast.loading("Finding best jobs for you...");

// //     try {
// //       const queryString = role.trim() 
// //         ? `${role} jobs in ${location || "India"}`
// //         : "";

// //       const res = await api.get("/jobs/search", {
// //         params: {
// //           keyword: queryString,
// //           resumeId: selectedResumeId,
// //           location: location,
// //           page: 1,
// //           num_pages: 1,
// //           country: "in",
// //           posted_days: "all",
// //         },
// //       });

// //       setJobs(res.data.jobs || []);
// //       toast.success(`Found ${res.data.total} jobs!`, { id: toastId });
      
// //       // Update role field with what was actually searched
// //       if (res.data.searchedQuery && !userChangedRole) {
// //         const searchedTitle = res.data.searchedQuery
// //           .replace(' jobs', '')
// //           .replace(` in ${location || 'India'}`, '')
// //           .trim();
// //         if (searchedTitle && searchedTitle !== role) {
// //           setRole(searchedTitle);
// //         }
// //       }
// //     } catch (error: any) {
// //       console.error("Search error:", error);
// //       toast.error("Failed to fetch jobs", { id: toastId });
// //     } finally {
// //       setLoadingJobs(false);
// //     }
// //   }, [role, location, selectedResumeId, userChangedRole]);

// //   return (
// //     <div className="min-h-screen bg-background text-foreground">
// //       {/* HEADER */}
// //       <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
// //         <div className="flex items-center gap-4">
// //           <Link href="/dashboard" className="p-2 hover:bg-accent rounded-xl">
// //             <ChevronLeft size={24} />
// //           </Link>
// //           <h1 className="text-xl font-black">AI Job Matcher</h1>
// //         </div>
// //         <ThemeToggle />
// //       </header>

// //       <main className="mx-auto max-w-7xl px-8 py-12">
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
// //           {/* LEFT PANEL - SEARCH FORM */}
// //           <motion.div
// //             initial={{ opacity: 0, x: -20 }}
// //             animate={{ opacity: 1, x: 0 }}
// //             className="space-y-8"
// //           >
// //             <div>
// //               <h2 className="text-3xl font-black">
// //                 Find Jobs Based on Your Skills
// //               </h2>
// //               <p className="text-muted-foreground">
// //                 Auto-detects job title from your resume
// //               </p>
// //             </div>

// //             <div className="p-8 rounded-3xl border bg-card shadow-xl space-y-6">
// //               {/* Resume Select */}
// //               <div>
// //                 <label className="text-sm font-black flex items-center gap-2">
// //                   <FileText size={14} /> Select Resume
// //                 </label>
// //                 <select
// //                   value={selectedResumeId}
// //                   onChange={handleResumeChange}
// //                   className="w-full h-12 px-4 rounded-xl bg-input border mt-1"
// //                 >
// //                   {loadingResumes ? (
// //                     <option>Loading resumes...</option>
// //                   ) : resumes.length === 0 ? (
// //                     <option>No resumes found</option>
// //                   ) : (
// //                     resumes.map((r) => (
// //                       <option key={r._id} value={r._id}>
// //                         {r.title}
// //                       </option>
// //                     ))
// //                   )}
// //                 </select>
// //                 <p className="text-xs text-muted-foreground mt-1">
// //                   Job title auto-fills from selected resume
// //                 </p>
// //               </div>

// //               {/* Role */}
// //               <div>
// //                 <label className="text-sm font-black flex items-center gap-2">
// //                   <Briefcase size={14} /> Role / Job Title
// //                 </label>
// //                 <input
// //                   placeholder="Auto-filled from resume, or type manually"
// //                   value={role}
// //                   onChange={handleRoleChange}
// //                   className="w-full h-12 px-4 rounded-xl bg-input border mt-1"
// //                 />
// //                 {!userChangedRole && role && (
// //                   <p className="text-xs text-green-600 mt-1">✓ Auto-filled from resume</p>
// //                 )}
// //               </div>

// //               {/* Location */}
// //               <div>
// //                 <label className="text-sm font-black flex items-center gap-2">
// //                   <MapPin size={14} /> Location
// //                 </label>
// //                 <input
// //                   placeholder="e.g. Mumbai, Remote, or auto-filled"
// //                   value={location}
// //                   onChange={handleLocationChange}
// //                   className="w-full h-12 px-4 rounded-xl bg-input border mt-1"
// //                 />
// //                 {!userChangedLocation && location && (
// //                   <p className="text-xs text-green-600 mt-1">✓ Auto-filled from resume</p>
// //                 )}
// //               </div>

// //               {/* Experience */}
// //               <div>
// //                 <label className="text-sm font-black flex items-center gap-2">
// //                   <BarChart3 size={14} /> Experience Level
// //                 </label>
// //                 <select
// //                   value={experience}
// //                   onChange={(e) => setExperience(e.target.value)}
// //                   className="w-full h-12 px-4 rounded-xl bg-input border mt-1"
// //                 >
// //                   <option value="">Any</option>
// //                   <option value="fresher">Fresher</option>
// //                   <option value="junior">Junior (1-2 years)</option>
// //                   <option value="mid level">Mid Level (3-5 years)</option>
// //                   <option value="senior">Senior (5+ years)</option>
// //                 </select>
// //               </div>

// //               {/* Job Type */}
// //               <div>
// //                 <label className="text-sm font-black flex items-center gap-2">
// //                   <Briefcase size={14} /> Job Type
// //                 </label>
// //                 <select
// //                   value={jobType}
// //                   onChange={(e) => setJobType(e.target.value)}
// //                   className="w-full h-12 px-4 rounded-xl bg-input border mt-1"
// //                 >
// //                   <option value="full-time">Full-time</option>
// //                   <option value="part-time">Part-time</option>
// //                   <option value="contract">Contract</option>
// //                   <option value="internship">Internship</option>
// //                 </select>
// //               </div>

// //               {/* Posted Days */}
// //               <div>
// //                 <label className="text-sm font-black flex items-center gap-2">
// //                   <Calendar size={14} /> Posted Within
// //                 </label>
// //                 <select
// //                   value={postedDays}
// //                   onChange={(e) => setPostedDays(Number(e.target.value))}
// //                   className="w-full h-12 px-4 rounded-xl bg-input border mt-1"
// //                 >
// //                   <option value={1}>24 hours</option>
// //                   <option value={7}>7 days</option>
// //                   <option value={14}>14 days</option>
// //                   <option value={30}>30 days</option>
// //                 </select>
// //               </div>

// //               {/* Search Button */}
// //               <Button
// //                 onClick={handleSearchJobs}
// //                 disabled={loadingJobs}
// //                 className="w-full h-14 text-lg font-bold"
// //               >
// //                 {loadingJobs ? (
// //                   <>
// //                     <Loader2 className="animate-spin mr-2" /> Searching...
// //                   </>
// //                 ) : (
// //                   <>
// //                     <Sparkles className="mr-2" /> Find Jobs
// //                   </>
// //                 )}
// //               </Button>
// //             </div>
// //           </motion.div>

// //           {/* RIGHT PANEL - JOB RESULTS */}
// //           <motion.div
// //             initial={{ opacity: 0, x: 20 }}
// //             animate={{ opacity: 1, x: 0 }}
// //           >
// //             <div className="mb-6 flex justify-between items-center">
// //               <h2 className="text-3xl font-black">
// //                 {jobs.length > 0 ? `Matched Jobs (${jobs.length})` : "Matched Jobs"}
// //               </h2>

// //               {jobs.length > 0 && (
// //                 <Button size="sm" onClick={handleSearchJobs} disabled={loadingJobs}>
// //                   <RefreshCw size={14} className={loadingJobs ? "animate-spin" : ""} />
// //                   Refresh
// //                 </Button>
// //               )}
// //             </div>

// //             {loadingJobs ? (
// //               <div className="flex justify-center items-center h-[500px] border rounded-3xl">
// //                 <Loader2 className="animate-spin h-10 w-10" />
// //               </div>
// //             ) : jobs.length === 0 ? (
// //               <div className="h-[500px] flex flex-col items-center justify-center border rounded-3xl text-muted-foreground gap-4">
// //                 <FileText size={48} className="opacity-30" />
// //                 <p>Select a resume and click "Find Jobs" to start</p>
// //               </div>
// //             ) : (
// //               <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
// //                 {jobs.map((job, i) => (
// //                   <div
// //                     key={i}
// //                     className="p-5 border rounded-2xl bg-card shadow-sm hover:shadow-md transition"
// //                   >
// //                     {/* Top Row: Title + Score */}
// //                     <div className="flex justify-between items-start gap-2">
// //                       <h3 className="font-bold text-lg leading-tight">
// //                         {job.title}
// //                       </h3>

// //                       <span
// //                         className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${
// //                           job.score >= 70
// //                             ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
// //                             : job.score >= 40
// //                             ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
// //                             : "bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400"
// //                         }`}
// //                       >
// //                         {job.score}% Match
// //                       </span>
// //                     </div>

// //                     {/* Company */}
// //                     <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
// //                       <Building2 size={14} /> {job.company}
// //                     </p>

// //                     {/* Location */}
// //                     <p className="text-sm text-muted-foreground flex items-center gap-2">
// //                       <MapPin size={14} /> {job.location}
// //                     </p>

// //                     {/* Details Tags */}
// //                     <div className="flex flex-wrap gap-3 mt-3 text-xs font-medium">
// //                       <span className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
// //                         <Briefcase size={12} /> {job.job_type}
// //                       </span>
// //                       <span className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
// //                         <BarChart3 size={12} /> {job.experience}
// //                       </span>
// //                       <span className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
// //                         <Calendar size={12} /> {job.posted_at}
// //                       </span>
// //                     </div>

// //                     {/* Salary */}
// //                     <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
// //                       <DollarSign size={14} />
// //                       {job.salary_min !== "Unknown"
// //                         ? `${job.salary_currency || "$"} ${job.salary_min} - ${job.salary_max}`
// //                         : "Salary not disclosed"}
// //                     </div>

// //                     {/* Description Preview */}
// //                     {job.description && (
// //                       <p className="text-xs text-muted-foreground mt-3 line-clamp-2">
// //                         {job.description.replace(/<[^>]*>/g, '').substring(0, 200)}...
// //                       </p>
// //                     )}

// //                     {/* Action Buttons */}
// //                     <div className="flex gap-2 mt-3">
// //                       <Button
// //                         variant="outline"
// //                         size="sm"
// //                         onClick={() => setSelectedJob(job)}
// //                       >
// //                         View Description
// //                       </Button>
// //                     </div>

// //                     {/* Apply Link */}
// //                     <div className="mt-4">
// //                       <a
// //                         href={job.applyLink}
// //                         target="_blank"
// //                         rel="noopener noreferrer"
// //                         className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
// //                       >
// //                         Apply Now <ExternalLink size={13} />
// //                       </a>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </motion.div>
// //         </div>
// //       </main>

// //       {/* JOB DESCRIPTION MODAL */}
// //       {selectedJob && (
// //         <div 
// //           className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
// //           onClick={() => setSelectedJob(null)}
// //         >
// //           <div 
// //             className="w-[90%] max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-2xl"
// //             onClick={(e) => e.stopPropagation()}
// //           >
// //             {/* Header */}
// //             <div className="flex justify-between items-start mb-4">
// //               <div>
// //                 <h2 className="text-xl font-bold">{selectedJob.title}</h2>
// //                 <p className="text-sm text-muted-foreground">
// //                   {selectedJob.company} • {selectedJob.location}
// //                 </p>
// //               </div>
// //               <button
// //                 onClick={() => setSelectedJob(null)}
// //                 className="text-muted-foreground hover:text-foreground text-xl p-1"
// //               >
// //                 ✕
// //               </button>
// //             </div>

// //             {/* Meta Info */}
// //             <div className="flex flex-wrap gap-2 mb-4 text-xs">
// //               <span className="px-2 py-1 bg-muted rounded">{selectedJob.job_type}</span>
// //               <span className="px-2 py-1 bg-muted rounded">{selectedJob.experience}</span>
// //               <span className="px-2 py-1 bg-muted rounded">{selectedJob.posted_at}</span>
// //               <span className="px-2 py-1 bg-muted rounded">
// //                 Match: {selectedJob.score}%
// //               </span>
// //             </div>

// //             {/* Salary */}
// //             <div className="mb-4 text-sm text-muted-foreground">
// //               {selectedJob.salary_min !== "Unknown"
// //                 ? `💰 ${selectedJob.salary_currency || "$"} ${selectedJob.salary_min} - ${selectedJob.salary_max}`
// //                 : "💰 Salary not disclosed"}
// //             </div>

// //             {/* Full Description */}
// //             <div className="text-sm leading-relaxed whitespace-pre-line text-foreground">
// //               {selectedJob.description 
// //                 ? selectedJob.description.replace(/<[^>]*>/g, '')
// //                 : "No description available"}
// //             </div>

// //             {/* Apply Button */}
// //             <div className="mt-6 flex justify-end">
// //               <a
// //                 href={selectedJob.applyLink}
// //                 target="_blank"
// //                 rel="noopener noreferrer"
// //               >
// //                 <Button>
// //                   Apply Now <ExternalLink size={14} className="ml-1" />
// //                 </Button>
// //               </a>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import api from "@/lib/api";
// import { Button } from "@/components/ui/button";
// import {
//   ChevronLeft,
//   Loader2,
//   Sparkles,
//   Building2,
//   MapPin,
//   ExternalLink,
//   RefreshCw,
//   Briefcase,
//   Calendar,
//   DollarSign,
//   BarChart3,
//   FileText,
// } from "lucide-react";

// import { motion } from "framer-motion";
// import { toast } from "sonner";
// import { ThemeToggle } from "@/components/ThemeToggle";

// interface Resume {
//   _id: string;
//   title: string;
// }

// interface Job {
//   title: string;
//   company: string;
//   location?: string;
//   applyLink: string;
//   description?: string;
//   score: number;
//   experience: string;
//   job_type: string;
//   salary_min: string;
//   salary_max: string;
//   salary_currency: string;
//   posted_at: string;
// }

// export default function JobSearchPage() {
//   const router = useRouter();

//   const [resumes, setResumes] = useState<Resume[]>([]);
//   const [selectedResumeId, setSelectedResumeId] = useState("");
//   const [jobs, setJobs] = useState<Job[]>([]);

//   const [loadingResumes, setLoadingResumes] = useState(true);
//   const [loadingJobs, setLoadingJobs] = useState(false);
//   const [loadingResumeDetails, setLoadingResumeDetails] = useState(false);

//   const [location, setLocation] = useState("");
//   const [role, setRole] = useState("");
//   const [experience, setExperience] = useState("");
//   const [jobType, setJobType] = useState("full-time");
//   const [postedDays, setPostedDays] = useState(7);
//   const [selectedJob, setSelectedJob] = useState<Job | null>(null);

//   const [userChangedRole, setUserChangedRole] = useState(false);
//   const [userChangedLocation, setUserChangedLocation] = useState(false);

//   // Check authentication
//   useEffect(() => {
//     const user = localStorage.getItem("user");
//     if (!user) {
//       router.push("/login");
//       return;
//     }
//   }, [router]);

//   // Fetch resumes on mount
//   useEffect(() => {
//     fetchResumes();
//   }, []);

//   const fetchResumes = async () => {
//     try {
//       setLoadingResumes(true);
//       const res = await api.get("/resumes");
//       const resumeData = res.data;
//       setResumes(resumeData);

//       if (resumeData.length > 0 && !selectedResumeId) {
//         const firstResumeId = resumeData[0]._id;
//         setSelectedResumeId(firstResumeId);
//         // Fetch full details of first resume
//         fetchAndAutoFill(firstResumeId);
//       }
//     } catch {
//       toast.error("Failed to fetch resumes");
//     } finally {
//       setLoadingResumes(false);
//     }
//   };

//   // Fetch full resume details and auto-fill
//   const fetchAndAutoFill = async (resumeId: string) => {
//     try {
//       setLoadingResumeDetails(true);
//       const res = await api.get(`/resumes/${resumeId}`);
//       const resume = res.data;

//       if (!userChangedRole) {
//         if (resume?.personalInfo?.jobTitle) {
//           setRole(resume.personalInfo.jobTitle);
//         } else {
//           setRole("");
//         }
//       }

//       if (!userChangedLocation) {
//         if (resume?.personalInfo?.location) {
//           setLocation(resume.personalInfo.location);
//         } else {
//           setLocation("");
//         }
//       }
//     } catch (err) {
//       console.error("Failed to fetch resume details:", err);
//     } finally {
//       setLoadingResumeDetails(false);
//     }
//   };

//   // Handle resume selection change
//   const handleResumeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const newResumeId = e.target.value;
//     setSelectedResumeId(newResumeId);

//     // Reset manual change flags
//     setUserChangedRole(false);
//     setUserChangedLocation(false);

//     if (newResumeId) {
//       await fetchAndAutoFill(newResumeId);
//     } else {
//       setRole("");
//       setLocation("");
//     }
//   };

//   // Handle role input change
//   const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setRole(e.target.value);
//     setUserChangedRole(true);
//   };

//   // Handle location input change
//   const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setLocation(e.target.value);
//     setUserChangedLocation(true);
//   };

//   // 🔥 MAIN JOB SEARCH FUNCTION
//   const handleSearchJobs = useCallback(async () => {
//     setLoadingJobs(true);
//     const toastId = toast.loading("Finding best jobs for you...");

//     try {
//       const queryString = role.trim()
//         ? `${role} jobs in ${location || "India"}`
//         : "";

//       const res = await api.get("/jobs/search", {
//         params: {
//           keyword: queryString,
//           resumeId: selectedResumeId,
//           location: location,
//           page: 1,
//           num_pages: 1,
//           country: "in",
//           posted_days: "all",
//         },
//       });

//       setJobs(res.data.jobs || []);
//       toast.success(`Found ${res.data.total} jobs!`, { id: toastId });

//       // Update role field with what was actually searched
//       if (res.data.searchedQuery && !userChangedRole) {
//         const searchedTitle = res.data.searchedQuery
//           .replace(" jobs", "")
//           .replace(` in ${location || "India"}`, "")
//           .trim();
//         if (searchedTitle && searchedTitle !== role) {
//           setRole(searchedTitle);
//         }
//       }
//     } catch (error: any) {
//       console.error("Search error:", error);
//       toast.error("Failed to fetch jobs", { id: toastId });
//     } finally {
//       setLoadingJobs(false);
//     }
//   }, [role, location, selectedResumeId, userChangedRole]);

//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       {/* HEADER */}
//       <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
//         <div className="flex items-center gap-4">
//           <Link href="/dashboard" className="p-2 hover:bg-accent rounded-xl">
//             <ChevronLeft size={24} />
//           </Link>
//           <h1 className="text-xl font-black">AI Job Matcher</h1>
//         </div>
//         <ThemeToggle />
//       </header>

//       <main className="mx-auto max-w-7xl px-8 py-12">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//           {/* LEFT PANEL - SEARCH FORM */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="space-y-8"
//           >
//             <div>
//               <h2 className="text-3xl font-black">
//                 Find Jobs Based on Your Skills
//               </h2>
//               <p className="text-muted-foreground">
//                 Auto-detects job title from your resume
//               </p>
//             </div>

//             <div className="p-8 rounded-3xl border bg-card shadow-xl space-y-6">
//               {/* Resume Select */}
//               <div>
//                 <label className="text-sm font-black flex items-center gap-2">
//                   <FileText size={14} /> Select Resume
//                 </label>
//                 <div className="relative">
//                   <select
//                     value={selectedResumeId}
//                     onChange={handleResumeChange}
//                     className="w-full h-12 px-4 rounded-xl bg-input border mt-1 appearance-none"
//                     disabled={loadingResumeDetails}
//                   >
//                     {loadingResumes ? (
//                       <option>Loading resumes...</option>
//                     ) : resumes.length === 0 ? (
//                       <option>No resumes found</option>
//                     ) : (
//                       resumes.map((r) => (
//                         <option key={r._id} value={r._id}>
//                           {r.title}
//                         </option>
//                       ))
//                     )}
//                   </select>
//                   {loadingResumeDetails && (
//                     <div className="absolute right-3 top-1/2 -translate-y-1/2">
//                       <Loader2 size={16} className="animate-spin" />
//                     </div>
//                   )}
//                 </div>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   Job title auto-fills from selected resume
//                 </p>
//               </div>

//               {/* Role */}
//               <div>
//                 <label className="text-sm font-black flex items-center gap-2">
//                   <Briefcase size={14} /> Role / Job Title
//                 </label>
//                 <div className="relative">
//                   <input
//                     placeholder="Auto-filled from resume, or type manually"
//                     value={role}
//                     onChange={handleRoleChange}
//                     className="w-full h-12 px-4 rounded-xl bg-input border mt-1"
//                   />
//                   {loadingResumeDetails && (
//                     <div className="absolute right-3 top-1/2 -translate-y-1/2">
//                       <Loader2 size={16} className="animate-spin" />
//                     </div>
//                   )}
//                 </div>
//                 {!userChangedRole && role && !loadingResumeDetails && (
//                   <p className="text-xs text-green-600 mt-1">✓ Auto-filled from resume</p>
//                 )}
//               </div>

//               {/* Location */}
//               <div>
//                 <label className="text-sm font-black flex items-center gap-2">
//                   <MapPin size={14} /> Location
//                 </label>
//                 <input
//                   placeholder="e.g. Mumbai, Remote, or auto-filled"
//                   value={location}
//                   onChange={handleLocationChange}
//                   className="w-full h-12 px-4 rounded-xl bg-input border mt-1"
//                 />
//                 {!userChangedLocation && location && (
//                   <p className="text-xs text-green-600 mt-1">✓ Auto-filled from resume</p>
//                 )}
//               </div>

//               {/* Experience */}
//               <div>
//                 <label className="text-sm font-black flex items-center gap-2">
//                   <BarChart3 size={14} /> Experience Level
//                 </label>
//                 <select
//                   value={experience}
//                   onChange={(e) => setExperience(e.target.value)}
//                   className="w-full h-12 px-4 rounded-xl bg-input border mt-1"
//                 >
//                   <option value="">Any</option>
//                   <option value="fresher">Fresher</option>
//                   <option value="junior">Junior (1-2 years)</option>
//                   <option value="mid level">Mid Level (3-5 years)</option>
//                   <option value="senior">Senior (5+ years)</option>
//                 </select>
//               </div>

//               {/* Job Type */}
//               <div>
//                 <label className="text-sm font-black flex items-center gap-2">
//                   <Briefcase size={14} /> Job Type
//                 </label>
//                 <select
//                   value={jobType}
//                   onChange={(e) => setJobType(e.target.value)}
//                   className="w-full h-12 px-4 rounded-xl bg-input border mt-1"
//                 >
//                   <option value="full-time">Full-time</option>
//                   <option value="part-time">Part-time</option>
//                   <option value="contract">Contract</option>
//                   <option value="internship">Internship</option>
//                 </select>
//               </div>

//               {/* Posted Days */}
//               <div>
//                 <label className="text-sm font-black flex items-center gap-2">
//                   <Calendar size={14} /> Posted Within
//                 </label>
//                 <select
//                   value={postedDays}
//                   onChange={(e) => setPostedDays(Number(e.target.value))}
//                   className="w-full h-12 px-4 rounded-xl bg-input border mt-1"
//                 >
//                   <option value={1}>24 hours</option>
//                   <option value={7}>7 days</option>
//                   <option value={14}>14 days</option>
//                   <option value={30}>30 days</option>
//                 </select>
//               </div>

//               {/* Search Button */}
//               <Button
//                 onClick={handleSearchJobs}
//                 disabled={loadingJobs}
//                 className="w-full h-14 text-lg font-bold"
//               >
//                 {loadingJobs ? (
//                   <>
//                     <Loader2 className="animate-spin mr-2" /> Searching...
//                   </>
//                 ) : (
//                   <>
//                     <Sparkles className="mr-2" /> Find Jobs
//                   </>
//                 )}
//               </Button>
//             </div>
//           </motion.div>

//           {/* RIGHT PANEL - JOB RESULTS */}
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//           >
//             <div className="mb-6 flex justify-between items-center">
//               <h2 className="text-3xl font-black">
//                 {jobs.length > 0 ? `Matched Jobs (${jobs.length})` : "Matched Jobs"}
//               </h2>

//               {jobs.length > 0 && (
//                 <Button size="sm" onClick={handleSearchJobs} disabled={loadingJobs}>
//                   <RefreshCw size={14} className={loadingJobs ? "animate-spin" : ""} />
//                   Refresh
//                 </Button>
//               )}
//             </div>

//             {loadingJobs ? (
//               <div className="flex justify-center items-center h-[500px] border rounded-3xl">
//                 <Loader2 className="animate-spin h-10 w-10" />
//               </div>
//             ) : jobs.length === 0 ? (
//               <div className="h-[500px] flex flex-col items-center justify-center border rounded-3xl text-muted-foreground gap-4">
//                 <FileText size={48} className="opacity-30" />
//                 <p>Select a resume and click "Find Jobs" to start</p>
//               </div>
//             ) : (
//               <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
//                 {jobs.map((job, i) => (
//                   <div
//                     key={i}
//                     className="p-5 border rounded-2xl bg-card shadow-sm hover:shadow-md transition"
//                   >
//                     {/* Top Row: Title + Score */}
//                     <div className="flex justify-between items-start gap-2">
//                       <h3 className="font-bold text-lg leading-tight">
//                         {job.title}
//                       </h3>

//                       <span
//                         className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${
//                           job.score >= 70
//                             ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
//                             : job.score >= 40
//                             ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
//                             : "bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400"
//                         }`}
//                       >
//                         {job.score}% Match
//                       </span>
//                     </div>

//                     {/* Company */}
//                     <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
//                       <Building2 size={14} /> {job.company}
//                     </p>

//                     {/* Location */}
//                     <p className="text-sm text-muted-foreground flex items-center gap-2">
//                       <MapPin size={14} /> {job.location}
//                     </p>

//                     {/* Details Tags */}
//                     <div className="flex flex-wrap gap-3 mt-3 text-xs font-medium">
//                       <span className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
//                         <Briefcase size={12} /> {job.job_type}
//                       </span>
//                       <span className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
//                         <BarChart3 size={12} /> {job.experience}
//                       </span>
//                       <span className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
//                         <Calendar size={12} /> {job.posted_at}
//                       </span>
//                     </div>

//                     {/* Salary */}
//                     <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
//                       <DollarSign size={14} />
//                       {job.salary_min !== "Unknown"
//                         ? `${job.salary_currency || "$"} ${job.salary_min} - ${job.salary_max}`
//                         : "Salary not disclosed"}
//                     </div>

//                     {/* Description Preview */}
//                     {job.description && (
//                       <p className="text-xs text-muted-foreground mt-3 line-clamp-2">
//                         {job.description.replace(/<[^>]*>/g, "").substring(0, 200)}...
//                       </p>
//                     )}

//                     {/* Action Buttons */}
//                     <div className="flex gap-2 mt-3">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => setSelectedJob(job)}
//                       >
//                         View Description
//                       </Button>
//                     </div>

//                     {/* Apply Link */}
//                     <div className="mt-4">
//                       <a
//                         href={job.applyLink}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
//                       >
//                         Apply Now <ExternalLink size={13} />
//                       </a>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </motion.div>
//         </div>
//       </main>

//       {/* JOB DESCRIPTION MODAL */}
//       {selectedJob && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
//           onClick={() => setSelectedJob(null)}
//         >
//           <div
//             className="w-[90%] max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Header */}
//             <div className="flex justify-between items-start mb-4">
//               <div>
//                 <h2 className="text-xl font-bold">{selectedJob.title}</h2>
//                 <p className="text-sm text-muted-foreground">
//                   {selectedJob.company} • {selectedJob.location}
//                 </p>
//               </div>
//               <button
//                 onClick={() => setSelectedJob(null)}
//                 className="text-muted-foreground hover:text-foreground text-xl p-1"
//               >
//                 ✕
//               </button>
//             </div>

//             {/* Meta Info */}
//             <div className="flex flex-wrap gap-2 mb-4 text-xs">
//               <span className="px-2 py-1 bg-muted rounded">{selectedJob.job_type}</span>
//               <span className="px-2 py-1 bg-muted rounded">{selectedJob.experience}</span>
//               <span className="px-2 py-1 bg-muted rounded">{selectedJob.posted_at}</span>
//               <span className="px-2 py-1 bg-muted rounded">
//                 Match: {selectedJob.score}%
//               </span>
//             </div>

//             {/* Salary */}
//             <div className="mb-4 text-sm text-muted-foreground">
//               {selectedJob.salary_min !== "Unknown"
//                 ? `💰 ${selectedJob.salary_currency || "$"} ${selectedJob.salary_min} - ${selectedJob.salary_max}`
//                 : "💰 Salary not disclosed"}
//             </div>

//             {/* Full Description */}
//             <div className="text-sm leading-relaxed whitespace-pre-line text-foreground">
//               {selectedJob.description
//                 ? selectedJob.description.replace(/<[^>]*>/g, "")
//                 : "No description available"}
//             </div>

//             {/* Apply Button */}
//             <div className="mt-6 flex justify-end">
//               <a
//                 href={selectedJob.applyLink}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <Button>
//                   Apply Now <ExternalLink size={14} className="ml-1" />
//                 </Button>
//               </a>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Loader2,
  Sparkles,
  Building2,
  MapPin,
  ExternalLink,
  RefreshCw,
  Briefcase,
  Calendar,
  DollarSign,
  BarChart3,
  FileText,
} from "lucide-react";

import { motion } from "framer-motion";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";

interface Resume {
  _id: string;
  title: string;
}

interface Job {
  title: string;
  company: string;
  location?: string;
  applyLink: string;
  description?: string;
  score: number;
  experience: string;
  job_type: string;
  salary_min: string;
  salary_max: string;
  salary_currency: string;
  posted_at: string;
}

export default function JobSearchPage() {
  const router = useRouter();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);

  const [loadingResumes, setLoadingResumes] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingResumeDetails, setLoadingResumeDetails] = useState(false);

  const [location, setLocation] = useState("");
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [jobType, setJobType] = useState("full-time");
  const [postedDays, setPostedDays] = useState(7);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [userChangedRole, setUserChangedRole] = useState(false);
  const [userChangedLocation, setUserChangedLocation] = useState(false);

  // Check authentication
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/login");
      return;
    }
  }, [router]);

  // Fetch resumes on mount
  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoadingResumes(true);
      const res = await api.get("/api/resumes");
      const resumeData = res.data;
      setResumes(resumeData);

      if (resumeData.length > 0 && !selectedResumeId) {
        const firstResumeId = resumeData[0]._id;
        setSelectedResumeId(firstResumeId);
        // Fetch full details of first resume
        fetchAndAutoFill(firstResumeId);
      }
    } catch {
      toast.error("Failed to fetch resumes");
    } finally {
      setLoadingResumes(false);
    }
  };

  // Fetch full resume details and auto-fill
  const fetchAndAutoFill = async (resumeId: string) => {
    try {
      setLoadingResumeDetails(true);
      const res = await api.get(`/api/resumes/${resumeId}`);
 const resume = res.data?.data || res.data;

      if (!userChangedRole) {
        if (resume?.personalInfo?.jobTitle) {
          setRole(resume.personalInfo.jobTitle);
        } else {
          setRole("");
        }
      }

    
    } catch (err) {
      console.error("Failed to fetch resume details:", err);
    } finally {
      setLoadingResumeDetails(false);
    }
  };

  // Handle resume selection change
  const handleResumeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newResumeId = e.target.value;
    setSelectedResumeId(newResumeId);

    // Reset manual change flags
    setUserChangedRole(false);
    setUserChangedLocation(false);

    if (newResumeId) {
      await fetchAndAutoFill(newResumeId);
    } else {
      setRole("");
      setLocation("");
    }
  };

  // Handle role input change
  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRole(e.target.value);
    setUserChangedRole(true);
  };

  // Handle location input change
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    setUserChangedLocation(true);
  };

const handleSearchJobs = useCallback(async () => {
  setLoadingJobs(true);
  const toastId = toast.loading("Finding best jobs for you...");

  try {
    let searchRole = role.trim();
    
    // If role is empty, fetch from resume
    if (!searchRole && selectedResumeId) {
      try {
        const res = await api.get(`/api/resumes/${selectedResumeId}`);
        const resume = res.data?.data || res.data;
        searchRole = resume?.personalInfo?.jobTitle || "";
        
        // Update the role field for user to see
        if (searchRole) {
          setRole(searchRole);
          setUserChangedRole(false); // Reset flag so it shows "auto-filled"
        }
      } catch (err) {
        console.error("Failed to fetch resume for search:", err);
      }
    }
    
    // Fallback if still empty
    if (!searchRole) {
      searchRole = "developer";
    }

    const searchLocation = location.trim() || "India";
    const queryString = `${searchRole} jobs in ${searchLocation}`;

    const res = await api.get("/api/jobs/search", {
      params: {
        keyword: queryString,
        resumeId: selectedResumeId,
        location: searchLocation,
        page: 1,
        num_pages: 1,
        country: "in",
        posted_days: "all",
      },
    });

    setJobs(res.data.jobs || []);
    toast.success(`Found ${res.data.total} jobs for ${searchRole}!`, { id: toastId });
    
  } catch (error: any) {
    console.error("Search error:", error);
    toast.error("Failed to fetch jobs", { id: toastId });
  } finally {
    setLoadingJobs(false);
  }
}, [role, location, selectedResumeId]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-accent rounded-xl">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-xl font-black">Resume-Based Job Search</h1>
        </div>
        <ThemeToggle />
      </header>

      <main className="mx-auto max-w-7xl px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT PANEL - SEARCH FORM */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-black">
                Find Jobs Based on Your Skills
              </h2>
              <p className="text-muted-foreground">
               We auto-detect your role from your resume and find matching jobs
              </p>
            </div>

            <div className="p-8 rounded-3xl border bg-card shadow-xl space-y-6">
              {/* Resume Select */}
              <div>
                <label className="text-sm font-black flex items-center gap-2">
                  <FileText size={14} /> Select Resume
                </label>
                <div className="relative">
                  <select
                    value={selectedResumeId}
                    onChange={handleResumeChange}
                    className="w-full h-12 px-4 rounded-xl bg-input border mt-1 appearance-none"
                    disabled={loadingResumeDetails}
                  >
                    {loadingResumes ? (
                      <option>Loading resumes...</option>
                    ) : resumes.length === 0 ? (
                      <option>No resumes found</option>
                    ) : (
                      resumes.map((r) => (
                        <option key={r._id} value={r._id}>
                          {r.title}
                        </option>
                      ))
                    )}
                  </select>
                  {loadingResumeDetails && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 size={16} className="animate-spin" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Job title auto-fills from selected resume
                </p>
              </div>

              {/* Role */}
              <div>
                <label className="text-sm font-black flex items-center gap-2">
                  <Briefcase size={14} /> Role / Job Title
                </label>
                <div className="relative">
                  <input
                    placeholder="Auto-filled from resume, or type manually"
                    value={role}
                    onChange={handleRoleChange}
                    className="w-full h-12 px-4 rounded-xl bg-input border mt-1"
                  />
                  {loadingResumeDetails && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 size={16} className="animate-spin" />
                    </div>
                  )}
                </div>
                {!userChangedRole && role && !loadingResumeDetails && (
                  <p className="text-xs text-green-600 mt-1">✓ Auto-filled from resume</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="text-sm font-black flex items-center gap-2">
                  <MapPin size={14} /> Location
                </label>
                <input
                  placeholder="e.g. Mumbai, Remote, or Other"
                  value={location}
                  onChange={handleLocationChange}
                  className="w-full h-12 px-4 rounded-xl bg-input border mt-1"
                />
              
              </div>

              {/* Experience */}
              <div>
                <label className="text-sm font-black flex items-center gap-2">
                  <BarChart3 size={14} /> Experience Level
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-input border mt-1"
                >
                  <option value="">Any</option>
                  <option value="fresher">Fresher</option>
                  <option value="junior">Junior (1-2 years)</option>
                  <option value="mid level">Mid Level (3-5 years)</option>
                  <option value="senior">Senior (5+ years)</option>
                </select>
              </div>

              {/* Job Type */}
              <div>
                <label className="text-sm font-black flex items-center gap-2">
                  <Briefcase size={14} /> Job Type
                </label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-input border mt-1"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              {/* Posted Days */}
              <div>
                <label className="text-sm font-black flex items-center gap-2">
                  <Calendar size={14} /> Posted Within
                </label>
                <select
                  value={postedDays}
                  onChange={(e) => setPostedDays(Number(e.target.value))}
                  className="w-full h-12 px-4 rounded-xl bg-input border mt-1"
                >
                  <option value={1}>24 hours</option>
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                </select>
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearchJobs}
                disabled={loadingJobs}
                className="w-full h-14 text-lg font-bold"
              >
                {loadingJobs ? (
                  <>
                    <Loader2 className="animate-spin mr-2" /> Searching...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2" /> Find Jobs
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* RIGHT PANEL - JOB RESULTS */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-3xl font-black">
                {jobs.length > 0 ? `Matched Jobs (${jobs.length})` : "Matched Jobs"}
              </h2>

              {jobs.length > 0 && (
                <Button size="sm" onClick={handleSearchJobs} disabled={loadingJobs}>
                  <RefreshCw size={14} className={loadingJobs ? "animate-spin" : ""} />
                  Refresh
                </Button>
              )}
            </div>

            {loadingJobs ? (
              <div className="flex justify-center items-center h-[500px] border rounded-3xl">
                <Loader2 className="animate-spin h-10 w-10" />
              </div>
            ) : jobs.length === 0 ? (
              <div className="h-[500px] flex flex-col items-center justify-center border rounded-3xl text-muted-foreground gap-4">
                <FileText size={48} className="opacity-30" />
                <p>Select a resume and click "Find Jobs" to start</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {jobs.map((job, i) => (
                  <div
                    key={i}
                    className="p-5 border rounded-2xl bg-card shadow-sm hover:shadow-md transition"
                  >
                    {/* Top Row: Title + Score */}
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-lg leading-tight">
                        {job.title}
                      </h3>

                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${
                          job.score >= 70
                            ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                            : job.score >= 40
                            ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {job.score}% Match
                      </span>
                    </div>

                    {/* Company */}
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
                      <Building2 size={14} /> {job.company}
                    </p>

                    {/* Location */}
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <MapPin size={14} /> {job.location}
                    </p>

                    {/* Details Tags */}
                    <div className="flex flex-wrap gap-3 mt-3 text-xs font-medium">
                      <span className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
                        <Briefcase size={12} /> {job.job_type}
                      </span>
                      <span className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
                        <BarChart3 size={12} /> {job.experience}
                      </span>
                      <span className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
                        <Calendar size={12} /> {job.posted_at}
                      </span>
                    </div>

                    {/* Salary */}
                    <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                      <DollarSign size={14} />
                      {job.salary_min !== "Unknown"
                        ? `${job.salary_currency || "$"} ${job.salary_min} - ${job.salary_max}`
                        : "Salary not disclosed"}
                    </div>

                    {/* Description Preview */}
                    {job.description && (
                      <p className="text-xs text-muted-foreground mt-3 line-clamp-2">
                        {job.description.replace(/<[^>]*>/g, "").substring(0, 200)}...
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedJob(job)}
                      >
                        View Description
                      </Button>
                    </div>

                    {/* Apply Link */}
                    <div className="mt-4">
                      <a
                        href={job.applyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        Apply Now <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* JOB DESCRIPTION MODAL */}
      {selectedJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="w-[90%] max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">{selectedJob.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedJob.company} • {selectedJob.location}
                </p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-muted-foreground hover:text-foreground text-xl p-1"
              >
                ✕
              </button>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-2 mb-4 text-xs">
              <span className="px-2 py-1 bg-muted rounded">{selectedJob.job_type}</span>
              <span className="px-2 py-1 bg-muted rounded">{selectedJob.experience}</span>
              <span className="px-2 py-1 bg-muted rounded">{selectedJob.posted_at}</span>
              <span className="px-2 py-1 bg-muted rounded">
                Match: {selectedJob.score}%
              </span>
            </div>

            {/* Salary */}
            <div className="mb-4 text-sm text-muted-foreground">
              {selectedJob.salary_min !== "Unknown"
                ? `💰 ${selectedJob.salary_currency || "$"} ${selectedJob.salary_min} - ${selectedJob.salary_max}`
                : "💰 Salary not disclosed"}
            </div>

            {/* Full Description */}
            <div className="text-sm leading-relaxed whitespace-pre-line text-foreground">
              {selectedJob.description
                ? selectedJob.description.replace(/<[^>]*>/g, "")
                : "No description available"}
            </div>

            {/* Apply Button */}
            <div className="mt-6 flex justify-end">
              <a
                href={selectedJob.applyLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button>
                  Apply Now <ExternalLink size={14} className="ml-1" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}