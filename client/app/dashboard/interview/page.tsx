
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import api from "@/lib/api";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Loader2, Sparkles, ChevronLeft } from "lucide-react";
// import { motion } from "framer-motion";
// import { toast } from "sonner";
// import { ThemeToggle } from "@/components/ThemeToggle";

// interface Resume {
//   _id: string;
//   title: string;
// }

// export default function InterviewPrepPage() {
//   const router = useRouter();

//   const [resumes, setResumes] = useState<Resume[]>([]);
//   const [selectedResumeId, setSelectedResumeId] = useState("");
//   const [jobDescription, setJobDescription] = useState("");
//   const [questions, setQuestions] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [loadingResumes, setLoadingResumes] = useState(true);
// const [credits, setCredits] = useState<number | null>(null);
  
// useEffect(() => {
//   const user = localStorage.getItem("user");

//   if (!user) {
//     router.push("/login");
//     return;
//   }

//   const parsed = JSON.parse(user);
//   setCredits(parsed.credits); // ✅ ADD THIS

//   fetchResumes();
// }, []);

//   const fetchResumes = async () => {
//     try {
//       const res = await api.get("/resumes");
//       setResumes(res.data);
//       if (res.data.length > 0) {
//         setSelectedResumeId(res.data[0]._id);
//       }
//     } catch {
//       toast.error("Failed to fetch resumes");
//     } finally {
//       setLoadingResumes(false);
//     }
//   };

//  const generateQuestions = async () => {
//   if (!jobDescription.trim()) {
//     toast.error("Please enter job description");
//     return;
//   }

//   // ✅ block if no credits
//   if (credits !== null && credits <= 0) {
//     toast.error("No credits left. Please upgrade.");
//     return;
//   }

//   setLoading(true);
//   const toastId = toast.loading("Generating interview questions...");

//   try {
//     const res = await api.post("/interview-prep", {
//       resumeId: selectedResumeId,
//       jobDescription
//     });

//     setQuestions(res.data.questions);

//     // ✅ UPDATE CREDITS
//     if (res.data?.credits !== undefined) {
//       setCredits(res.data.credits);

//       const user = JSON.parse(localStorage.getItem("user") || "{}");
//       user.credits = res.data.credits;
//       localStorage.setItem("user", JSON.stringify(user));
//     }

//     toast.success("Questions generated!", { id: toastId });

//   } catch (err: any) {
//     const message =
//       err.response?.data?.message || "Failed to generate questions";

//     if (message.toLowerCase().includes("credit")) {
//       toast.error("Not enough credits. Please upgrade.", { id: toastId });
//     } else {
//       toast.error(message, { id: toastId });
//     }

//   } finally {
//     setLoading(false);
//   }
// };

//   if (loadingResumes) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-background text-foreground">
//         <Loader2 className="animate-spin h-8 w-8 text-primary" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
//       {/* HEADER */}
//       <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
//         <div className="flex items-center gap-4">
//           <Link href="/dashboard" className="p-2 hover:bg-accent rounded-xl">
//             <ChevronLeft size={22} />
//           </Link>
//           <h1 className="text-xl font-black">AI Interview Prep</h1>
//         </div>
//         <div className="flex items-center gap-4">
//   <ThemeToggle />
//     <span className="text-md font-semibold text-muted-foreground">
//     Credits:{" "}
//     <span
//       className={`font-bold ${
//         credits !== null && credits <= 5
//           ? "text-red-500"
//           : "text-primary"
//       }`}
//     >
//       {credits ?? 0}
//     </span>
//   </span>
// </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-8 py-12 grid lg:grid-cols-2 gap-10">
        
//         {/* LEFT PANEL */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           className="space-y-6"
//         >
//           <div>
//             <h2 className="text-3xl font-black">Prepare Smarter</h2>
//             <p className="text-muted-foreground">
//               Generate AI-powered interview questions tailored to your resume.
//             </p>
//           </div>

//           <div className="p-6 rounded-3xl border bg-card space-y-4 shadow-xl">
            
//             {/* Resume Select */}
//             <select
//               value={selectedResumeId}
//               onChange={(e) => setSelectedResumeId(e.target.value)}
//               className="w-full h-12 rounded-xl border px-4 bg-input"
//             >
//               {resumes.map((r) => (
//                 <option key={r._id} value={r._id}>
//                   {r.title}
//                 </option>
//               ))}
//             </select>

//             {/* Job Description */}
//             <textarea
//               placeholder="Paste job description..."
//               value={jobDescription}
//               onChange={(e) => setJobDescription(e.target.value)}
//               className="w-full min-h-[160px] p-4 rounded-xl border bg-input"
//             />

//            <Button
//   onClick={generateQuestions}
//   disabled={loading || (credits !== null && credits <= 0)}
//               className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold"
//             >
//               {loading ? (
//                 <Loader2 className="animate-spin" />
//               ) : (
//                 <>
//                   <Sparkles size={18} /> Generate Questions
//                 </>
//               )}
//             </Button>
//           </div>
//         </motion.div>

//         {/* RIGHT PANEL */}
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           className="space-y-4"
//         >
//           <h2 className="text-3xl font-black">Interview Questions</h2>

//         <div className="p-6 rounded-3xl border bg-card h-[500px] overflow-y-auto scroll-smooth">
//             {questions.length === 0 ? (
//               <div className="flex items-center justify-center h-full text-muted-foreground">
//                 No questions generated yet.
//               </div>
//             ) : (
//               questions.map((q, i) => (
//                 <div key={i} className="mb-4 border-b pb-3">
//                   <p className="font-bold">{q.question}</p>
//                   <p className="text-sm text-primary">{q.category}</p>
//                   <p className="text-sm mt-1">{q.sampleAnswer}</p>
//                 </div>
//               ))
//             )}
//           </div>
//         </motion.div>

//       </main>
//     </div>
//   );
// }
////
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import api from "@/lib/api";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { 
//   Loader2, 
//   Sparkles, 
//   ChevronLeft, 
//   Code2, 
//   Users2, 
//   Briefcase,
//   ChevronDown,
//   ChevronUp
// } from "lucide-react";
// import { motion } from "framer-motion";
// import { toast } from "sonner";
// import { ThemeToggle } from "@/components/ThemeToggle";

// interface Resume {
//   _id: string;
//   title: string;
// }

// interface Question {
//   question: string;
//   category: 'Technical' | 'Behavioral' | 'HR';
//   sampleAnswer: string;
// }

// export default function InterviewPrepPage() {
//   const router = useRouter();

//   const [resumes, setResumes] = useState<Resume[]>([]);
//   const [selectedResumeId, setSelectedResumeId] = useState("");
//   const [jobDescription, setJobDescription] = useState("");
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [loadingResumes, setLoadingResumes] = useState(true);
//   const [credits, setCredits] = useState<number | null>(null);
//   const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
//   const [activeFilter, setActiveFilter] = useState<'All' | 'Technical' | 'Behavioral' | 'HR'>('All');
//   const [breakdown, setBreakdown] = useState({ technical: 0, behavioral: 0, hr: 0 });

//   useEffect(() => {
//     const user = localStorage.getItem("user");
//     if (!user) {
//       router.push("/login");
//       return;
//     }
//     const parsed = JSON.parse(user);
//     setCredits(parsed.credits);
//     fetchResumes();
//   }, []);

//   const fetchResumes = async () => {
//     try {
//       const res = await api.get("/resumes");
//       setResumes(res.data);
//       if (res.data.length > 0) {
//         setSelectedResumeId(res.data[0]._id);
//       }
//     } catch {
//       toast.error("Failed to fetch resumes");
//     } finally {
//       setLoadingResumes(false);
//     }
//   };

//   const generateQuestions = async () => {
//     if (!jobDescription.trim()) {
//       toast.error("Please enter job description");
//       return;
//     }

//     if (credits !== null && credits <= 0) {
//       toast.error("No credits left. Please upgrade.");
//       return;
//     }

//     setLoading(true);
//     const toastId = toast.loading("Generating 10 interview questions...");

//     try {
//       const res = await api.post("/interview-prep", {
//         resumeId: selectedResumeId,
//         jobDescription
//       });

//       setQuestions(res.data.questions || []);
//       setBreakdown(res.data.breakdown || { technical: 0, behavioral: 0, hr: 0 });
//       setExpandedIndex(null);
//       setActiveFilter('All');

//       if (res.data?.credits !== undefined) {
//         setCredits(res.data.credits);
//         const user = JSON.parse(localStorage.getItem("user") || "{}");
//         user.credits = res.data.credits;
//         localStorage.setItem("user", JSON.stringify(user));
//       }

//       toast.success(`Generated ${res.data.total || res.data.questions.length} questions!`, { id: toastId });

//     } catch (err: any) {
//       const message = err.response?.data?.message || "Failed to generate questions";
//       if (message.toLowerCase().includes("credit")) {
//         toast.error("Not enough credits. Please upgrade.", { id: toastId });
//       } else {
//         toast.error(message, { id: toastId });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredQuestions = activeFilter === 'All' 
//     ? questions 
//     : questions.filter(q => q.category === activeFilter);

//   const getCategoryIcon = (category: string) => {
//     switch (category) {
//       case 'Technical': return <Code2 size={14} />;
//       case 'Behavioral': return <Users2 size={14} />;
//       case 'HR': return <Briefcase size={14} />;
//       default: return null;
//     }
//   };

//   const getCategoryColor = (category: string) => {
//     switch (category) {
//       case 'Technical': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
//       case 'Behavioral': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
//       case 'HR': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400';
//       default: return '';
//     }
//   };

//   if (loadingResumes) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-background text-foreground">
//         <Loader2 className="animate-spin h-8 w-8 text-primary" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
//       {/* HEADER */}
//       <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
//         <div className="flex items-center gap-4">
//           <Link href="/dashboard" className="p-2 hover:bg-accent rounded-xl">
//             <ChevronLeft size={22} />
//           </Link>
//           <h1 className="text-xl font-black">AI Interview Prep</h1>
//         </div>
//         <div className="flex items-center gap-4">
//           <ThemeToggle />
//           <span className="text-md font-semibold text-muted-foreground">
//             Credits:{" "}
//             <span className={`font-bold ${credits !== null && credits <= 5 ? "text-red-500" : "text-primary"}`}>
//               {credits ?? 0}
//             </span>
//           </span>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-8 py-12 grid lg:grid-cols-2 gap-10">
        
//         {/* LEFT PANEL */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           className="space-y-6"
//         >
//           <div>
//             <h2 className="text-3xl font-black">Prepare Smarter</h2>
//             <p className="text-muted-foreground">
//               Generate 10 AI-powered interview questions tailored to your resume and job description.
//             </p>
//           </div>

//           <div className="p-6 rounded-3xl border bg-card space-y-4 shadow-xl">
            
//             {/* Resume Select */}
//             <div>
//               <label className="text-sm font-semibold mb-1 block">Select Resume</label>
//               <select
//                 value={selectedResumeId}
//                 onChange={(e) => setSelectedResumeId(e.target.value)}
//                 className="w-full h-12 rounded-xl border px-4 bg-input"
//               >
//                 {resumes.map((r) => (
//                   <option key={r._id} value={r._id}>
//                     {r.title}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Job Description */}
//             <div>
//               <label className="text-sm font-semibold mb-1 block">Job Description</label>
//               <textarea
//                 placeholder="Paste the job description here..."
//                 value={jobDescription}
//                 onChange={(e) => setJobDescription(e.target.value)}
//                 className="w-full min-h-[200px] p-4 rounded-xl border bg-input resize-y"
//               />
//             </div>

//             <Button
//               onClick={generateQuestions}
//               disabled={loading || (credits !== null && credits <= 0)}
//               className="w-full h-14 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg"
//             >
//               {loading ? (
//                 <Loader2 className="animate-spin mr-2" size={20} />
//               ) : (
//                 <Sparkles size={20} className="mr-2" />
//               )}
//               {loading ? "Generating..." : "Generate 10 Questions"}
//             </Button>
//           </div>
//         </motion.div>

//         {/* RIGHT PANEL */}
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           className="space-y-4"
//         >
//           <div className="flex justify-between items-center">
//             <h2 className="text-3xl font-black">Questions</h2>
//             {questions.length > 0 && (
//               <span className="text-sm text-muted-foreground">
//                 {questions.length} total
//               </span>
//             )}
//           </div>

//           {/* Filter Tabs */}
//           {questions.length > 0 && (
//             <div className="flex gap-2 flex-wrap">
//               <Button
//                 variant={activeFilter === 'All' ? 'primary' : 'outline'}
//                 size="sm"
//                 onClick={() => setActiveFilter('All')}
//               >
//                 All ({questions.length})
//               </Button>
//               <Button
//                 variant={activeFilter === 'Technical' ? 'primary' : 'outline'}
//                 size="sm"
//                 onClick={() => setActiveFilter('Technical')}
//                 className={activeFilter === 'Technical' ? '' : 'text-blue-600'}
//               >
//                 <Code2 size={14} className="mr-1" /> Technical ({breakdown.technical})
//               </Button>
//               <Button
//                 variant={activeFilter === 'Behavioral' ? 'primary' : 'outline'}
//                 size="sm"
//                 onClick={() => setActiveFilter('Behavioral')}
//                 className={activeFilter === 'Behavioral' ? '' : 'text-green-600'}
//               >
//                 <Users2 size={14} className="mr-1" /> Behavioral ({breakdown.behavioral})
//               </Button>
//               <Button
//                 variant={activeFilter === 'HR' ? 'primary' : 'outline'}
//                 size="sm"
//                 onClick={() => setActiveFilter('HR')}
//                 className={activeFilter === 'HR' ? '' : 'text-purple-600'}
//               >
//                 <Briefcase size={14} className="mr-1" /> HR ({breakdown.hr})
//               </Button>
//             </div>
//           )}

//           {/* Questions List */}
//           <div className="p-4 rounded-3xl border bg-card h-[600px] overflow-y-auto scroll-smooth">
//             {questions.length === 0 ? (
//               <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
//                 <Sparkles size={40} className="opacity-30" />
//                 <p>Paste a job description and click generate</p>
//                 <p className="text-xs">10 questions with sample answers will appear here</p>
//               </div>
//             ) : filteredQuestions.length === 0 ? (
//               <div className="flex items-center justify-center h-full text-muted-foreground">
//                 No {activeFilter} questions found.
//               </div>
//             ) : (
//               <div className="space-y-2">
//                 {filteredQuestions.map((q, i) => (
//                   <div key={i} className="border rounded-xl overflow-hidden">
//                     {/* Question Header */}
//                     <button
//                       onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
//                       className="w-full flex items-start gap-3 p-4 text-left hover:bg-muted/50 transition"
//                     >
//                       <span className="text-sm font-bold text-muted-foreground min-w-[24px]">
//                         {questions.indexOf(q) + 1}.
//                       </span>
//                       <div className="flex-1 min-w-0">
//                         <p className="font-semibold text-sm pr-6">{q.question}</p>
//                         <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full mt-2 ${getCategoryColor(q.category)}`}>
//                           {getCategoryIcon(q.category)}
//                           {q.category}
//                         </span>
//                       </div>
//                       {expandedIndex === i ? (
//                         <ChevronUp size={18} className="text-muted-foreground flex-shrink-0 mt-1" />
//                       ) : (
//                         <ChevronDown size={18} className="text-muted-foreground flex-shrink-0 mt-1" />
//                       )}
//                     </button>

//                     {/* Answer */}
//                     {expandedIndex === i && (
//                       <div className="px-4 pb-4 pt-0 border-t">
//                         <p className="text-xs font-semibold text-muted-foreground mb-2 mt-3">
//                           SAMPLE ANSWER:
//                         </p>
//                         <p className="text-sm text-muted-foreground leading-relaxed">
//                           {q.sampleAnswer}
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </motion.div>

//       </main>
//     </div>
//   );
// }

//////////
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  Sparkles, 
  ChevronLeft, 
  Code2, 
  FolderKanban, 
  Briefcase,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";

interface Resume {
  _id: string;
  title: string;
}

interface Question {
  question: string;
  category: 'Technical' | 'Project' | 'HR';
  sampleAnswer: string;
}

export default function InterviewPrepPage() {
  const router = useRouter();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [credits, setCredits] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Technical' | 'Project' | 'HR'>('All');
  const [breakdown, setBreakdown] = useState({ technical: 0, project: 0, hr: 0 });

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/login");
      return;
    }
    const parsed = JSON.parse(user);
    setCredits(parsed.credits);
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await api.get("/api/resumes");
      setResumes(res.data);
      if (res.data.length > 0) {
        setSelectedResumeId(res.data[0]._id);
      }
    } catch {
      toast.error("Failed to fetch resumes");
    } finally {
      setLoadingResumes(false);
    }
  };

  const generateQuestions = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please enter job description");
      return;
    }

    if (credits !== null && credits <= 0) {
      toast.error("No credits left. Please upgrade.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Generating 10 interview questions...");

    try {
      const res = await api.post("/api/interview-prep", {
        resumeId: selectedResumeId,
        jobDescription
      });

      setQuestions(res.data.questions || []);
      setBreakdown(res.data.breakdown || { technical: 0, project: 0, hr: 0 });
      setExpandedIndex(null);
      setActiveFilter('All');

      if (res.data?.credits !== undefined) {
        setCredits(res.data.credits);
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        user.credits = res.data.credits;
        localStorage.setItem("user", JSON.stringify(user));
      }

      toast.success(`Generated ${res.data.total || res.data.questions.length} questions!`, { id: toastId });

    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to generate questions";
      if (message.toLowerCase().includes("credit")) {
        toast.error("Not enough credits. Please upgrade.", { id: toastId });
      } else {
        toast.error(message, { id: toastId });
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = activeFilter === 'All' 
    ? questions 
    : questions.filter(q => q.category === activeFilter);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Technical': return <Code2 size={14} />;
      case 'Project': return <FolderKanban size={14} />;
      case 'HR': return <Briefcase size={14} />;
      default: return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technical': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Project': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400';
      case 'HR': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400';
      default: return '';
    }
  };

  if (loadingResumes) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      {/* HEADER */}
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-accent rounded-xl">
            <ChevronLeft size={22} />
          </Link>
          <h1 className="text-xl font-black">AI Interview Prep</h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <span className="text-md font-semibold text-muted-foreground">
            Credits:{" "}
            <span className={`font-bold ${credits !== null && credits <= 5 ? "text-red-500" : "text-primary"}`}>
              {credits ?? 0}
            </span>
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12 grid lg:grid-cols-2 gap-10">
        
        {/* LEFT PANEL */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-3xl font-black">Prepare Smarter</h2>
            <p className="text-muted-foreground">
              Generate 10 AI-powered interview questions based on your skills and projects.
            </p>
          </div>

          <div className="p-6 rounded-3xl border bg-card space-y-4 shadow-xl">
            
            {/* Resume Select */}
            <div>
              <label className="text-sm font-semibold mb-1 block">Select Resume</label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full h-12 rounded-xl border px-4 bg-input"
              >
                {resumes.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Description */}
            <div>
              <label className="text-sm font-semibold mb-1 block">Job Description</label>
              <textarea
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full min-h-[200px] p-4 rounded-xl border bg-input resize-y"
              />
            </div>

            <Button
              onClick={generateQuestions}
              disabled={loading || (credits !== null && credits <= 0)}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg"
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" size={20} />
              ) : (
                <Sparkles size={20} className="mr-2" />
              )}
              {loading ? "Generating..." : "Generate 10 Questions"}
            </Button>
          </div>
        </motion.div>

        {/* RIGHT PANEL */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-black">Questions</h2>
            {questions.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {questions.length} total
              </span>
            )}
          </div>

          {/* Filter Tabs */}
          {questions.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={activeFilter === 'All' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('All')}
              >
                All ({questions.length})
              </Button>
              <Button
                variant={activeFilter === 'Technical' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('Technical')}
                className={activeFilter === 'Technical' ? '' : 'text-blue-600'}
              >
                <Code2 size={14} className="mr-1" /> Technical ({breakdown.technical})
              </Button>
              <Button
                variant={activeFilter === 'Project' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('Project')}
                className={activeFilter === 'Project' ? '' : 'text-orange-600'}
              >
                <FolderKanban size={14} className="mr-1" /> Projects ({breakdown.project})
              </Button>
              <Button
                variant={activeFilter === 'HR' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('HR')}
                className={activeFilter === 'HR' ? '' : 'text-purple-600'}
              >
                <Briefcase size={14} className="mr-1" /> HR ({breakdown.hr})
              </Button>
            </div>
          )}

          {/* Questions List */}
          <div className="p-4 rounded-3xl border bg-card h-[600px] overflow-y-auto scroll-smooth">
            {questions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
                <Sparkles size={40} className="opacity-30" />
                <p>Paste a job description and click generate</p>
                <p className="text-xs">10 questions with sample answers will appear here</p>
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No {activeFilter} questions found.
              </div>
            ) : (
              <div className="space-y-2">
                {filteredQuestions.map((q, i) => (
                  <div key={i} className="border rounded-xl overflow-hidden">
                    {/* Question Header */}
                    <button
                      onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                      className="w-full flex items-start gap-3 p-4 text-left hover:bg-muted/50 transition"
                    >
                      <span className="text-sm font-bold text-muted-foreground min-w-[24px]">
                        {questions.indexOf(q) + 1}.
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm pr-6">{q.question}</p>
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full mt-2 ${getCategoryColor(q.category)}`}>
                          {getCategoryIcon(q.category)}
                          {q.category}
                        </span>
                      </div>
                      {expandedIndex === i ? (
                        <ChevronUp size={18} className="text-muted-foreground flex-shrink-0 mt-1" />
                      ) : (
                        <ChevronDown size={18} className="text-muted-foreground flex-shrink-0 mt-1" />
                      )}
                    </button>

                    {/* Answer */}
                    {expandedIndex === i && (
                      <div className="px-4 pb-4 pt-0 border-t">
                        <p className="text-xs font-semibold text-muted-foreground mb-2 mt-3">
                          SAMPLE ANSWER:
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {q.sampleAnswer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

      </main>
    </div>
  );
}