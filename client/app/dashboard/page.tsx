// "use client";

// import { Suspense } from "react";
// import { useEffect, useState, useRef, cloneElement } from "react";
// import { redirect, useRouter } from "next/navigation";
// import Link from "next/link";
// import api from "@/lib/api";
// import { Button } from "@/components/ui/button";
// import {
//     Plus,
//     FileText,
//     Trash2,
//     Edit,
//     Loader2,
//     ExternalLink,
//     Clock,
//     Layout,
//     ShieldCheck,
//     Zap,
//     Copy,
//     Search,
//     Sparkles,
//     Target,
//     CheckCircle2,
//     Crown,
//     ArrowRight,
//     X,
//     Upload,
//     Wand2,
//     LogOut,
// } from "lucide-react";
// import { FiX, FiEdit2, FiTrash2, FiStar } from "react-icons/fi";
// import { FaRegCommentDots } from "react-icons/fa";
// import { MdOutlineRateReview } from "react-icons/md";
// import { useSearchParams } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast } from "sonner";
// import ResumeFormModal from "@/components/ResumeFormModal";
// import JobFormModal from "@/components/JobFormModal";
// import ConfirmModal from "@/components/ConfirmModal";
// import { Briefcase as BriefcaseIcon, Building2, Kanban, ChevronRight, MoreHorizontal, Menu } from "lucide-react";
// import { ThemeToggle } from "@/components/ThemeToggle";

// interface Resume {
//     _id: string;
//     title: string;
//     updatedAt: string;
//     isDraft: boolean;
//     selectedTemplate: string;
// }

// interface Job {
//     _id: string;
//     companyName: string;
//     position: string;
//     resume: any;
//     status: 'to-apply' | 'applied' | 'interviewing' | 'offered' | 'rejected';
//     notes?: string;
//     updatedAt: string;
// }

// const Dashboard = () => {
//     const router = useRouter();
//     const [resumes, setResumes] = useState<Resume[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [user, setUser] = useState<any>(null);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//     const [feedbackList, setFeedbackList] = useState<any[]>([]);
//     const [feedbackListLoading, setFeedbackListLoading] = useState(false);
//     const [isFeedbackListOpen, setIsFeedbackListOpen] = useState(false);
//     const jobBoardRef = useRef<HTMLDivElement | null>(null);
//     // Create Modal State
//     const [isCreateOpen, setIsCreateOpen] = useState(false);
//     const [creating, setCreating] = useState(false);
//     const [isPolling, setIsPolling] = useState(false);
//     const [showPromoPopup, setShowPromoPopup] = useState(false);

//     const [confirmConfig, setConfirmConfig] = useState<{
//         isOpen: boolean;
//         title: string;
//         message: string;
//         onConfirm: () => void;
//     }>({
//         isOpen: false,
//         title: "",
//         message: "",
//         onConfirm: () => { },
//     });
//     const closeConfirm = () => setConfirmConfig(prev => ({ ...prev, isOpen: false }));

//     // Job Tracker State
//     const [jobs, setJobs] = useState<Job[]>([]);
//     const [isJobModalOpen, setIsJobModalOpen] = useState(false);
//     const [jobLoading, setJobLoading] = useState(false);
//     const [editingJob, setEditingJob] = useState<Job | null>(null);
//     const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
//     const [feedbackText, setFeedbackText] = useState("");
//     const [rating, setRating] = useState(5);
//     const [feedbackLoading, setFeedbackLoading] = useState(false);
//     const [editingId, setEditingId] = useState<string | null>(null);
//     const [editText, setEditText] = useState("");
//     const [editRating, setEditRating] = useState(5);
//     const searchParams = useSearchParams();
//     const [activeSection, setActiveSection] = useState("dashboard");
//     const [activeResumeDropdown, setActiveResumeDropdown] = useState<string | null>(null);
//     const dashboardRef = useRef<HTMLDivElement | null>(null);
//     const feedbackRef = useRef<HTMLDivElement | null>(null);

//     // File Upload State
//     const fileInputRef = useRef<HTMLInputElement>(null);
//     const [uploadingResume, setUploadingResume] = useState(false);
//     const currentUser = user?._id;
//     const fetchAllFeedback = async () => {
//         setFeedbackListLoading(true);
//         try {
//             const res = await api.get("/api/feedback/me");
//             setFeedbackList(res.data.data);
//         } catch (error) {
//             toast.error("Failed to fetch feedback");
//         } finally {
//             setFeedbackListLoading(false);
//         }
//     };

//     useEffect(() => {
//         const handleScroll = () => {
//             const scrollY = window.scrollY;

//             const dashboardTop = dashboardRef.current?.offsetTop || 0;
//             const jobTop = jobBoardRef.current?.offsetTop || 0;

//             if (scrollY >= jobTop - 100) {
//                 setActiveSection("job");
//             } else {
//                 setActiveSection("dashboard");
//             }
//         };

//         window.addEventListener("scroll", handleScroll);
//         return () => window.removeEventListener("scroll", handleScroll);
//     }, []);

//  const handleLogout = () => {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         toast.success("Logged out successfully");
//         router.push("/login");
//     };

//     const handleDeleteFeedback = async (id: string) => {
//         setIsFeedbackListOpen(false);
//         setConfirmConfig({
//             isOpen: true,
//             title: "Delete Feedback",
//             message: "Delete this feedback?",
//             onConfirm: async () => {
//                 try {
//                     await api.delete(`/api/feedback/${id}`);
//                     setFeedbackList((prev) => prev.filter((f) => f._id !== id));
//                     toast.success("Feedback deleted");
//                 } catch (error) {
//                     toast.error("Failed to delete feedback");
//                 } finally {
//                     closeConfirm();
//                 }
//             }
//         });
//     };

//     const startEditing = (fb: any) => {
//         setEditingId(fb._id);
//         setEditText(fb.comment);
//         setEditRating(fb.rating || 5);
//     };

//     const handleUpdateFeedback = async () => {
//         try {
//             const res = await api.put(`/api/feedback/${editingId}`, {
//                 comment: editText,
//                 rating: editRating,
//             });

//             setFeedbackList((prev: any) =>
//                 prev.map((fb: any) =>
//                     fb._id === editingId ? res.data.data : fb
//                 )
//             );

//             setEditingId(null);
//             toast.success("Feedback updated!");
//         } catch {
//             toast.error("Failed to update feedback");
//         }
//     };

//     const submitFeedback = async () => {

//         if (!feedbackText.trim()) {
//             toast.error("Please write your feedback");
//             return;
//         }

//         setFeedbackLoading(true);

//         try {

//             const user = JSON.parse(localStorage.getItem("user") || "{}");

//             await api.post("/api/feedback", {
//                 userId: user._id,
//                 comment: feedbackText,
//                 rating: rating
//             });

//             toast.success("Feedback submitted successfully!");

//             setFeedbackText("");
//             setRating(5);
//             setIsFeedbackOpen(false);

//         } catch (error) {

//             console.error(error);
//             toast.error("Failed to submit feedback");

//         } finally {

//             setFeedbackLoading(false);

//         }
//     };
//     useEffect(() => {
//         const paymentStatus = searchParams.get("payment");
//         if (paymentStatus === "success") {
//             toast.success("Payment successful! Updating your account...");
//             startPollingProfile();
//             router.replace("/dashboard");
//         } else if (paymentStatus === "cancelled") {
//             toast.error("Payment was cancelled.");
//             router.replace("/dashboard");
//         }
//     }, [searchParams]);

//     const startPollingProfile = async () => {
//         setIsPolling(true);
//         let attempts = 0;
//         const maxAttempts = 10;

//         const poll = setInterval(async () => {
//             attempts++;
//             try {
//                 await api.post("/api/subscriptions/sync");
//                 const response = await api.get("/api/auth/me");
//                 if (response.data.isSubscribed) {
//                     setUser(response.data);
//                     localStorage.setItem("user", JSON.stringify(response.data));
//                     toast.success("Welcome to Pro! Your subscription is now active.");
//                     setIsPolling(false);
//                     clearInterval(poll);
//                     fetchResumes();
//                 } else if (attempts >= maxAttempts) {
//                     setIsPolling(false);
//                     clearInterval(poll);
//                     toast.info("Subscription is being processed. Please refresh in a moment.");
//                 }
//             } catch (error) {
//                 console.error("Polling failed");
//             }
//         }, 1000);
//     };

//     useEffect(() => {
//         const userData = localStorage.getItem("user");
//         if (!userData) {
//             router.push("/login");
//             return;
//         }
//         fetchProfile();
//         fetchResumes();
//         fetchJobs();
//     }, [router]);

//     const fetchProfile = async () => {
//         try {
//             const response = await api.get("/api/auth/me");
//             const userData = response.data;
//             setUser(userData);
//             localStorage.setItem("user", JSON.stringify(userData));
//             const hasSeenPromo = sessionStorage.getItem("hasSeenPromo");
//             if (!userData.isSubscribed && !hasSeenPromo) {
//                 setTimeout(() => setShowPromoPopup(true), 1500);
//             }
//         } catch (error) {
//             console.error("Failed to fetch profile");
//             const userData = localStorage.getItem("user");
//             if (userData) setUser(JSON.parse(userData));
//         }
//     };

//     const fetchResumes = async () => {
//         try {
//             const response = await api.get("/api/resumes");
//             setResumes(response.data);
//         } catch (error) {
//             toast.error("Failed to fetch resumes");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleCreateResume = async (data: any) => {
//         if (!data.title.trim()) {
//             toast.error("Please enter a resume title");
//             return;
//         }
//         setCreating(true);
//         try {
//             const response = await api.post("/api/resumes", {
//                 title: data.title,
//                 selectedTemplate: data.selectedTemplate || 'modern'
//             });
//             toast.success("Resume created successfully!");
//             setIsCreateOpen(false);
//             router.push(`/editor/${response.data._id}`);
//         } catch (error: any) {
//             const message = error.response?.data?.message || "Failed to create resume";
//             toast.error(message);
//         } finally {
//             setCreating(false);
//         }
//     };

//     const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (!file) return;

//         // Validation
//         const allowedTypes = [
//             'application/pdf',
//             'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//             'text/plain'
//         ];

//         if (!allowedTypes.includes(file.type)) {
//             toast.error("Invalid file format. Please upload PDF, DOCX, or TXT.");
//             if (fileInputRef.current) fileInputRef.current.value = '';
//             return;
//         }

//         if (file.size > 5 * 1024 * 1024) {
//             toast.error("File size exceeds 5MB limit.");
//             if (fileInputRef.current) fileInputRef.current.value = '';
//             return;
//         }

//         setUploadingResume(true);
//         const toastId = toast.loading("Processing your resume...");

//         try {
//             const formData = new FormData();
//             formData.append('resume', file);

//             const response = await api.post("/api/resumes/upload", formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });

//             toast.success("Resume data extracted successfully!", { id: toastId });
//             router.push(`/editor/${response.data._id}`);
//         } catch (error: any) {
//             const message = error.response?.data?.message || "Failed to upload and parse resume";
//             toast.error(message, { id: toastId });
//         } finally {
//             setUploadingResume(false);
//             if (fileInputRef.current) fileInputRef.current.value = '';
//         }
//     };

//     const deleteResume = async (id: string, e: React.MouseEvent) => {
//         e.stopPropagation();
//         setConfirmConfig({
//             isOpen: true,
//             title: "Delete Resume",
//             message: "Are you sure you want to delete this resume?",
//             onConfirm: async () => {
//                 try {
//                     await api.delete(`/api/resumes/${id}`);
//                     setResumes((prev) => prev.filter((r) => r._id !== id));
//                     toast.success("Resume deleted");
//                 } catch (error) {
//                     toast.error("Failed to delete resume");
//                 } finally {
//                     closeConfirm();
//                 }
//             }
//         });
//     };

//     const duplicateResume = async (id: string, e: React.MouseEvent) => {
//         e.stopPropagation();
//         if (!user?.isSubscribed && resumes.length >= 2) {
//             toast.error("Free limit reached. Upgrade to Pro to duplicate.");
//             return;
//         }
//         try {
//             const response = await api.post(`/api/resumes/${id}/duplicate`);
//             setResumes([response.data, ...resumes]);
//             toast.success("Resume duplicated");
//         } catch (error: any) {
//             const message = error.response?.data?.message || "Failed to duplicate resume";
//             toast.error(message);
//         }
//     };

//     const handleUpgrade = async () => {
//         try {
//             const response = await api.post("/api/subscriptions/checkout");
//             if (response.data.url) {
//                 window.location.href = response.data.url;
//             }
//         } catch (error: any) {
//             toast.error("Failed to start checkout session");
//         }
//     };

//     const fetchJobs = async () => {
//         try {
//             const response = await api.get("/api/jobs");
//             setJobs(response.data);
//         } catch (error) {
//             console.error("Failed to fetch jobs");
//         }
//     };

//     const handleCreateJob = async (data: any) => {
//         setJobLoading(true);
//         try {
//             if (editingJob) {
//                 const response = await api.put(`/api/jobs/${editingJob._id}`, data);
//                 setJobs(jobs.map(j => j._id === editingJob._id ? response.data : j));
//                 toast.success("Job updated successfully!");
//             } else {
//                 const response = await api.post("/api/jobs", data);
//                 setJobs([response.data, ...jobs]);
//                 toast.success("Job added to tracker!");
//             }
//             setIsJobModalOpen(false);
//             setEditingJob(null);
//         } catch (error: any) {
//             toast.error("Failed to save job");
//         } finally {
//             setJobLoading(false);
//         }
//     };

//     const deleteJob = async (id: string) => {
//         setConfirmConfig({
//             isOpen: true,
//             title: "Remove Job",
//             message: "Remove this job from tracker?",
//             onConfirm: async () => {
//                 try {
//                     await api.delete(`/api/jobs/${id}`);
//                     setJobs((prev) => prev.filter(j => j._id !== id));
//                     toast.success("Job removed");
//                 } catch (error) {
//                     toast.error("Failed to delete job");
//                 } finally {
//                     closeConfirm();
//                 }
//             }
//         });
//     };

//     const updateJobStatus = async (id: string, newStatus: string) => {
//         try {
//             const response = await api.put(`/api/jobs/${id}`, { status: newStatus });
//             setJobs(jobs.map(j => j._id === id ? response.data : j));
//             const statusName = columns.find(c => c.id === newStatus)?.name || newStatus;
//             toast.success(`Moved to ${statusName}`);
//         } catch (error) {
//             toast.error("Failed to move job");
//         }
//     };

//     const getNextStatus = (currentStatus: string) => {
//         const currentIndex = columns.findIndex(c => c.id === currentStatus);
//         if (currentIndex !== -1 && currentIndex < columns.length - 1) {
//             return columns[currentIndex + 1];
//         }
//         return null;
//     };

//     const getPrevStatus = (currentStatus: string) => {
//         const currentIndex = columns.findIndex(c => c.id === currentStatus);
//         if (currentIndex > 0) {
//             return columns[currentIndex - 1];
//         }
//         return null;
//     };

//     const columns = [
//         { id: 'to-apply', name: 'To Apply', color: 'text-gray-400', bg: 'bg-white/5', icon: <Target size={14} /> },
//         { id: 'applied', name: 'Applied', color: 'text-blue-400', bg: 'bg-blue-500/10', icon: <BriefcaseIcon size={14} /> },
//         { id: 'interviewing', name: 'Interviewing', color: 'text-amber-400', bg: 'bg-amber-500/10', icon: <Sparkles size={14} /> },
//         { id: 'offered', name: 'Offered', color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: <ShieldCheck size={14} /> },
//         { id: 'rejected', name: 'Rejected', color: 'text-red-400', bg: 'bg-red-500/10', icon: <Trash2 size={14} /> },
//     ];

//     const filteredResumes = resumes.filter(r =>
//         r.title.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     if (loading) {
//         return (
//             <div className="flex h-screen items-center justify-center bg-background text-foreground">
//                 <Loader2 className="animate-spin h-8 w-8 text-primary" />
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
//             {/* Sidebar Overlay for mobile */}
//             {isSidebarOpen && (
//                 <div
//                     className="fixed inset-0 z-30 bg-black/50 md:hidden"
//                     onClick={() => setIsSidebarOpen(false)}
//                 />
//             )}

//             {/* Sidebar */}
//             <aside className={`fixed top-0 left-0 z-40 h-screen w-64 border-r border-border bg-card transition-all duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
//                 <div className="flex h-full flex-col p-6">
//                     <Link href="/dashboard" className="mb-10 flex items-center gap-3 text-2xl font-black">
//                         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
//                             R
//                         </div>
//                         Resumen
//                     </Link>


//                     <nav className="flex-1 space-y-2">

//                         {/* Dashboard */}
//                         <button
//                             onClick={() => {
//                                 dashboardRef.current?.scrollIntoView({ behavior: "smooth" });
//                                 setActiveSection("dashboard");
//                             }}
//                             className={`flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium transition
//         ${activeSection === "dashboard"
//                                     ? "bg-primary/10 text-primary"
//                                     : "text-muted-foreground hover:bg-accent hover:text-foreground"
//                                 }`}
//                         >
//                             <Layout size={18} /> Dashboard
//                         </button>

//                         {/* Job Board */}
//                         <button
//                             onClick={() => {
//                                 jobBoardRef.current?.scrollIntoView({ behavior: "smooth" });
//                                 setActiveSection("job");
//                             }}
//                             className={`flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium transition
//         ${activeSection === "job"
//                                     ? "bg-primary/10 text-primary"
//                                     : "text-muted-foreground hover:bg-accent hover:text-foreground"
//                                 }`}
//                         >
//                             <Kanban size={18} /> Job Board
//                         </button>

//                         {/* AI Cover Letter */}
//                         <Link
//                             href="/dashboard/cover-letter"
//                             className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
//                         >
//                             <Sparkles size={18} className="text-primary" /> AI Cover Letter
//                         </Link>
//   <Link
//                             href="/dashboard/interview"
//                             className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
//                         >
//                             <Wand2 size={18} className="text-primary" /> AI Interview Prep
//                         </Link>
//                         {/* Create Resume */}
//                         <button
//                             onClick={() => {
//                                 setIsCreateOpen(true);
//                             }}
//                             className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
//                         >
//                             <Plus size={18} /> Create Resume
//                         </button>


//                         <button
//                             onClick={() => router.push("/dashboard/jobsearch")}
//                             className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
//                         >
//                             <Search size={18} />
//                             Job Search
//                         </button>
//                         {/* Leave Feedback */}
//                         <button
//                             onClick={() => setIsFeedbackOpen(true)}
//                             className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
//                         >
//                             <FaRegCommentDots size={18} /> Leave Feedback
//                         </button>
//                         <button
//                             onClick={() => {
//                                 setIsFeedbackListOpen(true);
//                                 fetchAllFeedback();
//                             }}
//                             className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
//                         >
//                             <MdOutlineRateReview size={18} /> Manage Feedback
//                         </button>
//                     </nav>

//                     <div className="mt-auto space-y-4">

//                         <div className="flex items-center gap-2">
//                             {user?.isSubscribed && <Crown size={16} className="text-yellow-500 fill-yellow-500" />}
//                             <span className={`text-xs uppercase tracking-widest font-bold ${user?.isSubscribed ? 'text-primary' : 'text-muted-foreground'}`}>
//                                 {user?.isSubscribed ? 'Pro Account' : 'Standard Account'}
//                             </span>
//                         </div>
//                         <div className="flex items-center gap-3">
//                             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-lg shadow-primary/20">
//                                 {user?.name?.[0] || 'U'}
//                             </div>
//                             <div className="flex flex-col">
//                                 <span className="text-sm font-medium">{user?.name}</span>
//                             </div>
//                         </div>                                
//                     </div>
//                 </div>
//             </aside>

//             {/* Main Content */}
//             <div className="md:ml-64 transition-all duration-300">
//                 {/* Header */}
//                 <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
//                     <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="rounded-lg p-2 text-muted-foreground hover:bg-accent md:hidden">
//                         <Menu size={24} />
//                     </button>
//                     <div className="hidden md:block text-2xl font-bold text-foreground">Dashboard</div>
//                     <div className="flex items-center gap-4">
//                         {!user?.isSubscribed && (
//                             <Button
//                                 onClick={handleUpgrade}
//                                 className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white font-bold text-xs h-9 px-4 rounded-xl shadow-lg shadow-primary/20"
//                             >
//                                 <Zap size={14} className="mr-2" /> Upgrade
//                             </Button>
//                         )}
//                         <ThemeToggle />
//                         <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-lg shadow-primary/20">
//                             {user?.name?.[0] || 'U'}
//                         </div>
//                         <Button
//   onClick={handleLogout}
//   className="rounded-xl font-bold h-10 px-6 gap-2 bg-primary hover:bg-red-600 text-white shadow-lg"
// >
//   <LogOut size={16} /> Logout
// </Button>
                    
//                     </div>
//                 </header>

//                 <main className="mx-auto max-w-7xl relative z-10 px-8 py-12">
//                     {/* Hero / Welcome Section */}
//                      <input
//         type="file"
//         ref={fileInputRef}
//         className="hidden"
//         accept=".pdf,.doc,.docx,.txt"
//         onChange={handleFileUpload}
//     />
    
//                     <div className="mb-16">
//                         <motion.div
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             className="flex flex-col gap-6"
//                         >
//                             {/* TEXT SECTION */}
//                             <div ref={dashboardRef} className="max-w-3xl">
//                                 <h1 className="text-5xl font-black tracking-tighter leading-tight mb-2 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                                     Welcome, {user?.name.split(" ")[0]}

//                                     {user?.isSubscribed && (
//                                         <span className="ml-3 inline-flex items-center gap-1.5 px-3 py-1 bg-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full text-white align-middle shadow-lg shadow-primary/30">
//                                             <Crown size={12} className="fill-white" />
//                                             PRO
//                                         </span>
//                                     )}
//                                 </h1>

//                                 <p className="text-lg text-muted-foreground leading-relaxed">
//                                     Ready to build something great today? Your next career milestone starts
//                                     with a perfectly crafted resume.
//                                 </p>
//                             </div>




//                             {/* BUTTONS SECTION */}
//                             <div className="flex flex-wrap items-center gap-4">

//                                 {/* Create */}
//                                 <Button
//                                     onClick={() => {
//                                         if (!user?.isSubscribed && resumes.length >= 2) {
//                                             toast.error("Free limit reached. Upgrade to Pro for unlimited resumes.");
//                                             return;
//                                         }
//                                         setIsCreateOpen(true);
//                                     }}
//                                     className="h-12 px-8 whitespace-nowrap rounded-2xl bg-primary text-primary-foreground hover:bg-primary/95 text-base font-bold shadow-xl transition-all hover:scale-[1.03]"
//                                 >
//                                     <div className="flex items-center gap-3">
//                                         <div className="h-7 w-7 flex items-center justify-center rounded-full bg-white/20">
//                                             <Plus size={18} className="text-white" />
//                                         </div>
//                                         Create New Resume
//                                     </div>
//                                 </Button>

//                                 {/* Upload */}
//                                 <Button
//                                     onClick={() => {
//                                         if (!user?.isSubscribed && resumes.length >= 2) {
//                                             toast.error("Free limit reached. Upgrade to Pro for unlimited resumes.");
//                                             return;
//                                         }
//                                         fileInputRef.current?.click();
//                                     }}
//                                     disabled={uploadingResume}
//                                     className="h-12 px-8 whitespace-nowrap rounded-2xl bg-secondary border border-border/50 text-foreground hover:bg-accent text-base font-bold shadow-xl shadow-black/5 transition-all hover:scale-[1.03]"
//                                 >
//                                     <div className="flex items-center gap-3">
//                                         <div className="h-7 w-7 flex items-center justify-center rounded-full bg-primary/10">
//                                             {uploadingResume ? (
//                                                 <Loader2 className="animate-spin text-primary" size={18} />
//                                             ) : (
//                                                 <Upload size={18} className="text-primary" />
//                                             )}
//                                         </div>
//                                         {uploadingResume ? "Processing..." : "Upload Resume"}
//                                     </div>
//                                 </Button>

//                                 {/* Cover Letter */}
//                                 <Button
//                                     onClick={() => router.push("/dashboard/cover-letter")}
//                                     className="h-12 px-8 whitespace-nowrap rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 hover:opacity-95 text-base font-bold text-white shadow-xl shadow-indigo-500/20 transition-all hover:scale-[1.03]"
//                                 >
//                                     <div className="flex items-center gap-3">
//                                         <div className="h-7 w-7 flex items-center justify-center rounded-full bg-white/10">
//                                             <Sparkles size={18} className="fill-white" />
//                                         </div>
//                                         AI Cover Letter
//                                     </div>
//                                 </Button>

//     {/* Ai Interview Prep */}
//                                 <Button
//                                     onClick={() => router.push("/dashboard/interview")}
//                                     className="h-12 px-8 whitespace-nowrap rounded-2xl bg-secondary border border-border/50 text-foreground hover:bg-accent text-base font-bold shadow-xl shadow-black/5 transition-all hover:scale-[1.03]"
//                                 >
//                                     <div className="flex items-center gap-3">
//                                         <div className="h-7 w-7 flex items-center justify-center rounded-full bg-white/10">
//                                             <Wand2 size={18} className="text-primary" />
//                                         </div>
//                                         AI Interview Prep
//                                     </div>
//                                 </Button>
//                             </div>
//                         </motion.div>

//                         {/* Quick Stats */}
//                         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12">
//                             {[
//                                 {
//                                     icon: <FileText className="text-blue-400" />,
//                                     label: "Total Resumes",
//                                     value: user?.isSubscribed ? resumes.length : `${resumes.length}/2`,
//                                     subLabel: !user?.isSubscribed ? "Free Limit" : "Unlimited"
//                                 },
//                                 { icon: <Clock className="text-amber-400" />, label: "Last Edited", value: resumes[0] ? new Date(resumes[0].updatedAt).toLocaleDateString() : 'N/A' },
//                                 { icon: <Zap className="text-purple-400" />, label: "Active Drafts", value: resumes.filter(r => r.isDraft).length },
//                                 { icon: <ShieldCheck className="text-emerald-400" />, label: "ATS Health", value: "Optimal" }
//                             ].map((stat, i) => (
//                                 <motion.div
//                                     key={i}
//                                     initial={{ opacity: 0, scale: 0.9 }}
//                                     animate={{ opacity: 1, scale: 1 }}
//                                     transition={{ delay: i * 0.1 }}
//                                     className="p-6 rounded-2xl border border-border bg-card flex items-center gap-4 shadow-sm"
//                                 >
//                                     <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
//                                         {stat.icon}
//                                     </div>
//                                     <div>
//                                         <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none mb-1">{stat.label}</p>
//                                         <p className="text-xl font-bold text-foreground">{stat.value}</p>
//                                         {(stat as any).subLabel && <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">{(stat as any).subLabel}</p>}
//                                     </div>
//                                 </motion.div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Resumes Section */}
//                     <div className="space-y-8">
//                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-8">
//                             <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
//                                 <Layout size={24} className="text-primary" />
//                                 Recent Projects
//                             </h2>
//                             <div className="relative w-full md:w-80">
//                                 <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
//                                 <input
//                                     type="text"
//                                     placeholder="Search resumes..."
//                                     value={searchQuery}
//                                     onChange={(e) => setSearchQuery(e.target.value)}
//                                     className="w-full h-11 bg-input border border-border rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
//                                 />
//                             </div>
//                         </div>

//                         {filteredResumes.length === 0 ? (
//                             <motion.div
//                                 initial={{ opacity: 0 }}
//                                 animate={{ opacity: 1 }}
//                                 className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-border bg-card py-32 text-center"
//                             >
//                                 <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-secondary text-muted-foreground ring-1 ring-border">
//                                     <FileText size={48} />
//                                 </div>
//                                 <h3 className="text-3xl font-bold text-foreground mb-2">
//                                     {searchQuery ? "No matches found" : "No resumes found"}
//                                 </h3>
//                                 <p className="mt-2 max-w-md text-muted-foreground text-lg">
//                                     {searchQuery
//                                         ? `Could not find any resume matching "${searchQuery}"`
//                                         : "Start your professional journey. Create your first resume with our precision designs."}
//                                 </p>
//                                 {!searchQuery && (
//                                     <Button
//                                         onClick={() => setIsCreateOpen(true)}
//                                         size="lg"
//                                         className="mt-10 h-14 px-10 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
//                                     >
//                                         Create Your First Resume
//                                     </Button>
//                                 )}
//                             </motion.div>
//                         ) : (
//                             <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
//                                 <AnimatePresence>
//                                     {filteredResumes.map((resume, index) => (
//                                         <motion.div
//                                             key={resume._id}
//                                             layout
//                                             initial={{ opacity: 0, y: 20 }}
//                                             animate={{ opacity: 1, y: 0 }}
//                                             exit={{ opacity: 0, scale: 0.9 }}
//                                             transition={{ delay: index * 0.05 }}
//                                             className="group relative flex flex-col rounded-[2rem] border border-border bg-card transition-all hover:border-primary/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden"
//                                         >
//                                             <div className="aspect-[1.4/1] w-full bg-secondary p-6 relative overflow-hidden">
//                                                 <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
//                                                 <div className="relative h-full w-full bg-background rounded-xl p-4 flex flex-col gap-2 shadow-2xl border border-border opacity-60">
//                                                     <div className="h-3 w-1/2 bg-muted rounded-full" />
//                                                     <div className="h-2 w-1/4 bg-muted rounded-full" />
//                                                     <div className="mt-4 flex flex-col gap-1.5">
//                                                         <div className="h-1.5 w-full bg-muted rounded-full" />
//                                                         <div className="h-1.5 w-full bg-muted rounded-full" />
//                                                         <div className="h-1.5 w-3/4 bg-muted rounded-full" />
//                                                     </div>
//                                                 </div>
//                                                 <div className="absolute top-4 right-4 z-10">
//                                                     <button
//                                                         onClick={(e) => {
//                                                             e.stopPropagation();
//                                                             setActiveResumeDropdown(activeResumeDropdown === resume._id ? null : resume._id);
//                                                         }}
//                                                         className="h-10 w-10 flex items-center justify-center rounded-xl bg-background/80 backdrop-blur-md border border-border text-foreground hover:bg-accent transition-all shadow-lg shadow-black/20"
//                                                     >
//                                                         <MoreHorizontal size={20} />
//                                                     </button>

//                                                     <AnimatePresence>
//                                                         {activeResumeDropdown === resume._id && (
//                                                             <>
//                                                                 <div
//                                                                     className="fixed inset-0 z-10"
//                                                                     onClick={() => setActiveResumeDropdown(null)}
//                                                                 />
//                                                                 <motion.div
//                                                                     initial={{ opacity: 0, scale: 0.95, y: -10 }}
//                                                                     animate={{ opacity: 1, scale: 1, y: 0 }}
//                                                                     exit={{ opacity: 0, scale: 0.95, y: -10 }}
//                                                                     className="absolute right-0 mt-2 w-48 rounded-2xl border border-border bg-card p-2 shadow-2xl z-20 overflow-hidden"
//                                                                 >
//                                                                     <button
//                                                                         onClick={() => {
//                                                                             router.push(`/editor/${resume._id}`);
//                                                                             setActiveResumeDropdown(null);
//                                                                         }}
//                                                                         className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
//                                                                     >
//                                                                         <Edit size={16} className="text-primary" /> Edit Resume
//                                                                     </button>
//                                                                     <button
//                                                                         onClick={(e) => {
//                                                                             duplicateResume(resume._id, e);
//                                                                             setActiveResumeDropdown(null);
//                                                                         }}
//                                                                         className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
//                                                                     >
//                                                                         <Copy size={16} className="text-primary" /> Duplicate
//                                                                     </button>
//                                                                     <div className="my-1 border-t border-border/50" />
//                                                                     <button
//                                                                         onClick={(e) => {
//                                                                             deleteResume(resume._id, e);
//                                                                             setActiveResumeDropdown(null);
//                                                                         }}
//                                                                         className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
//                                                                     >
//                                                                         <Trash2 size={16} /> Delete
//                                                                     </button>
//                                                                 </motion.div>
//                                                             </>
//                                                         )}
//                                                     </AnimatePresence>
//                                                 </div>

//                                                 <div
//                                                     className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100 backdrop-blur-[2px] cursor-pointer"
//                                                     onClick={() => router.push(`/editor/${resume._id}`)}
//                                                 >
//                                                     <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-2xl">
//                                                         <ExternalLink size={30} />
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="p-6">
//                                                 <div className="flex items-start justify-between mb-4">
//                                                     <div className="min-w-0">
//                                                         <h3 className="font-bold text-xl text-foreground truncate group-hover:text-primary transition-colors">{resume.title}</h3>
//                                                         <div className="flex items-center gap-2 mt-1">
//                                                             <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{resume.selectedTemplate} template</span>
//                                                         </div>
//                                                     </div>
//                                                     <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${resume.isDraft ? 'bg-amber-500/5 text-amber-500 border-amber-500/20' : 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20'}`}>
//                                                         {resume.isDraft ? 'Draft' : 'Final'}
//                                                     </div>
//                                                 </div>
//                                                 <div className="flex items-center justify-between border-t border-border pt-4">
//                                                     <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
//                                                         <Clock size={12} />
//                                                         {new Date(resume.updatedAt).toLocaleDateString()}
//                                                     </div>
//                                                     <Button onClick={() => router.push(`/editor/${resume._id}`)} variant="link" className="h-auto p-0 text-primary hover:text-primary/80 font-bold text-xs gap-1">
//                                                         Open Editor <ExternalLink size={12} />
//                                                     </Button>
//                                                 </div>
//                                             </div>
//                                         </motion.div>
//                                     ))}
//                                 </AnimatePresence>
//                             </div>
//                         )}
//                     </div>

//                     {/* Job Tracker Section */}
//                     <div ref={jobBoardRef} className="mt-24 space-y-8">
//                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-8">
//                             <div>
//                                 <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
//                                     <Kanban size={24} className="text-primary" />
//                                     Job Tracker
//                                 </h2>
//                                 <p className="text-sm text-muted-foreground mt-1">Manage your applications and see your progress at a glance.</p>
//                             </div>
//                             <Button
//                                 onClick={() => { setEditingJob(null); setIsJobModalOpen(true); }}
//                                 className="bg-secondary hover:bg-purple-700  text-foreground border border-border rounded-xl px-6 h-11 transition-all flex items-center gap-2"
//                             >
//                                 <Plus size={18} /> Add Job Application
//                             </Button>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-5 gap-6 overflow-x-auto pb-4 custom-scrollbar">
//                             {columns.map((column) => (
//                                 <div key={column.id} className="flex flex-col gap-4 min-w-[280px]">
//                                     <div className={`flex items-center justify-between px-3 py-2 rounded-xl ${column.bg} border border-border/40 backdrop-blur-sm transition-all`}>
//                                         <div className="flex items-center gap-2">
//                                             <div className="text-foreground/70">
//                                                 {cloneElement(column.icon as React.ReactElement, { size: 12 })}
//                                             </div>
//                                             <span className={`text-[8px] font-bold uppercase tracking-[0.15em] ${column.color}`}>{column.name}</span>
//                                         </div>
//                                         <span className="text-[8px] font-bold text-muted-foreground bg-background/50 px-1.5 py-0.5 rounded-md border border-border/30">
//                                             {jobs.filter(j => j.status === column.id).length}
//                                         </span>
//                                     </div>

//                                     <div className="space-y-4 min-h-[500px] rounded-2xl bg-card border border-border p-3">
//                                         {jobs.filter(j => j.status === column.id).map((job) => {
//                                             const nextStatus = getNextStatus(job.status);
//                                             const prevStatus = getPrevStatus(job.status);
//                                             return (
//                                                 <motion.div
//                                                     key={job._id}
//                                                     layoutId={job._id}
//                                                     initial={{ opacity: 0, y: 10 }}
//                                                     animate={{ opacity: 1, y: 0 }}
//                                                     className="p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all group relative overflow-hidden"
//                                                 >
//                                                     <div className="flex justify-between items-start mb-3">
//                                                         <div className="min-w-0 flex-1">
//                                                             <h4 className="font-bold text-sm text-foreground truncate tracking-tight group-hover:text-primary transition-colors">{job.position}</h4>
//                                                             <p className="text-[9px] text-muted-foreground flex items-center gap-1.5 mt-0.5 font-medium uppercase tracking-wider">
//                                                                 {job.companyName}
//                                                             </p>
//                                                         </div>
//                                                         <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
//                                                             <button onClick={() => { setEditingJob(job); setIsJobModalOpen(true); }} className="h-6 w-6 rounded-md bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-foreground border border-border/50 transition-all">
//                                                                 <Edit size={12} />
//                                                             </button>
//                                                             <button onClick={() => deleteJob(job._id)} className="h-6 w-6 rounded-md bg-destructive/10 flex items-center justify-center text-destructive/80 hover:bg-destructive border border-destructive/10 transition-all">
//                                                                 <Trash2 size={12} />
//                                                             </button>
//                                                         </div>
//                                                     </div>

//                                                     <div className="flex items-center gap-2 py-1.5 px-2 rounded-lg bg-secondary/50 border border-border/30 mb-3">
//                                                         <FileText size={10} className="text-primary/70" />
//                                                         <p className="text-[9px] text-muted-foreground font-medium truncate">
//                                                             {job.resume?.title || "No resume linked"}
//                                                         </p>
//                                                     </div>

//                                                     <div className="flex items-center justify-between pt-3 border-t border-border/30">
//                                                         <div className="flex items-center gap-1">
//                                                             {prevStatus && (
//                                                                 <button onClick={() => updateJobStatus(job._id, prevStatus.id)} title={`Move to ${prevStatus.name}`} className="h-7 w-7 rounded-md flex items-center justify-center bg-secondary text-muted-foreground hover:text-foreground border border-border/30 transition-all">
//                                                                     <ChevronRight size={14} className="rotate-180" />
//                                                                 </button>
//                                                             )}
//                                                             {nextStatus && (
//                                                                 <button onClick={() => updateJobStatus(job._id, nextStatus.id)} className={`px-2.5 h-7 rounded-md flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest ${nextStatus.color} ${nextStatus.bg} border border-border/40 hover:brightness-105 transition-all`}>
//                                                                     {nextStatus.name} <ChevronRight size={10} />
//                                                                 </button>
//                                                             )}
//                                                         </div>
//                                                         <div className="text-[8px] font-bold text-muted-foreground/50 tabular-nums">
//                                                             {new Date(job.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
//                                                         </div>
//                                                     </div>
//                                                 </motion.div>
//                                             );
//                                         })}

//                                         {jobs.filter(j => j.status === column.id).length === 0 && (
//                                             <div className="h-full flex flex-col items-center justify-center opacity-20 py-20 px-4 text-center">
//                                                 <BriefcaseIcon size={24} className="mb-2" />
//                                                 <span className="text-[10px] font-bold uppercase tracking-widest">No Applications</span>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Upgrade Banner */}
//                     {!user?.isSubscribed && (
//                         <motion.div
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: 0.4 }}
//                             className="mt-24 p-8 rounded-[2.5rem] bg-gradient-to-r from-primary/20 via-primary/5 to-transparent border border-primary/20 relative overflow-hidden"
//                         >
//                             <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
//                                 <Crown size={160} className="text-primary rotate-12" />
//                             </div>
//                             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
//                                 <div className="max-w-xl text-center md:text-left">
//                                     <h3 className="text-3xl font-black tracking-tight mb-2">Ready to go Pro?</h3>
//                                     <p className="text-muted-foreground text-lg leading-relaxed">
//                                         Unlock unlimited resumes and AI features for just <span className="text-foreground font-bold">$7/mo</span>.
//                                     </p>
//                                     <div className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start">
//                                         {["Unlimited Resumes", "AI Bullet Enhancer", "Pro Templates", "Priority Export"].map(feature => (
//                                             <div key={feature} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-xl border border-primary/10">
//                                                 <CheckCircle2 size={12} /> {feature}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                                 <Button onClick={handleUpgrade} className="h-16 px-12 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xl shadow-[0_0_30px_rgba(124,58,237,0.4)] shrink-0 group">
//                                     Get Pro Access <ArrowRight size={24} className="ml-2 transition-transform group-hover:translate-x-1" />
//                                 </Button>
//                             </div>
//                         </motion.div>
//                     )}

//                     {/* Features Section */}
//                     <div className="mt-32 pt-20 border-t border-border">
//                         <div className="text-center mb-16">
//                             <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">Built for Success</h3>
//                             <h2 className="text-4xl font-black tracking-tighter text-foreground">Everything you need to land the job</h2>
//                         </div>
//                         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//                             {[
//                                 { title: "AI Bullet Enhancer", desc: "Upgrade your impact with AI-powered revisions designed to grab a recruiter's attention.", icon: <Sparkles className="h-8 w-8 text-primary" /> },
//                                 { title: "ATS Scoring Engine", desc: "Rigorous testing against hiring algorithms to ensure you bypass the automated filters.", icon: <ShieldCheck className="h-8 w-8 text-emerald-400" /> },
//                                 { title: "Job Application Tracker", desc: "A built-in Kanban board to manage your pipeline and link resumes to specific jobs.", icon: <Layout className="h-8 w-8 text-blue-400" /> },
//                                 { title: "Ultra-Fast Generation", desc: "Puppeteer-powered PDF rendering ensures pixel-perfect results in less than a second.", icon: <Zap className="h-8 w-8 text-yellow-400" /> }
//                             ].map((feature, i) => (
//                                 <div key={i} className="p-8 rounded-[2rem] bg-card border border-border hover:bg-accent transition-all group">
//                                     <div className="mb-6 h-14 w-14 rounded-2xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
//                                         {feature.icon}
//                                     </div>
//                                     <h4 className="text-lg font-bold text-foreground mb-2">{feature.title}</h4>
//                                     <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </main>
//             </div>


//             <AnimatePresence>
//                 {isFeedbackOpen && (

//                     <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">

//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             exit={{ opacity: 0 }}
//                             className="absolute inset-0 bg-black/70"
//                             onClick={() => setIsFeedbackOpen(false)}
//                         />

//                         <motion.div
//                             initial={{ scale: 0.9, opacity: 0 }}
//                             animate={{ scale: 1, opacity: 1 }}
//                             exit={{ scale: 0.9, opacity: 0 }}
//                             className="relative w-full max-w-md rounded-2xl border border-border bg-card p-8"
//                         >

//                             <h3 className="text-xl font-bold mb-4">
//                                 Share Your Experience
//                             </h3>

//                             <div className="mb-4">

//                                 <label className="text-sm font-medium">
//                                     Rating
//                                 </label>

//                                 <select
//                                     value={rating}
//                                     onChange={(e) => setRating(Number(e.target.value))}
//                                     className="w-full mt-2 p-2 border rounded-md"
//                                 >
//                                     <option value={5}>⭐⭐⭐⭐⭐</option>
//                                     <option value={4}>⭐⭐⭐⭐</option>
//                                     <option value={3}>⭐⭐⭐</option>
//                                     <option value={2}>⭐⭐</option>
//                                     <option value={1}>⭐</option>
//                                 </select>

//                             </div>

//                             <textarea
//                                 value={feedbackText}
//                                 onChange={(e) => setFeedbackText(e.target.value)}
//                                 placeholder="Tell us how the website helped you..."
//                                 className="w-full h-32 p-3 rounded-xl border border-border 
//   bg-white text-black placeholder-gray-500
//   dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"

//                             />

//                             <div className="flex gap-3 mt-6">

//                                 <Button
//                                     onClick={submitFeedback}
//                                     disabled={feedbackLoading}
//                                     className="flex-1"
//                                 >

//                                     {feedbackLoading ? "Submitting..." : "Submit Feedback"}

//                                 </Button>

//                                 <Button
//                                     variant="ghost"
//                                     onClick={() => setIsFeedbackOpen(false)}
//                                 >

//                                     Cancel

//                                 </Button>

//                             </div>

//                         </motion.div>
//                     </div>

//                 )}
//             </AnimatePresence>
//             <AnimatePresence>
//                 {isFeedbackListOpen && (
//                     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

//                         {/* Overlay */}
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             exit={{ opacity: 0 }}
//                             onClick={() => setIsFeedbackListOpen(false)}
//                             className="absolute inset-0 bg-black/60 backdrop-blur-sm"
//                         />

//                         {/* Modal */}
//                         <motion.div
//                             initial={{ scale: 0.92, opacity: 0 }}
//                             animate={{ scale: 1, opacity: 1 }}
//                             exit={{ scale: 0.92, opacity: 0 }}
//                             transition={{ duration: 0.2 }}
//                             className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl"
//                         >
//                             {/* Header */}
//                             <div className="flex items-center justify-between mb-6">
//                                 <h3 className="text-xl font-bold">Manage Feedback</h3>
//                                 <button
//                                     onClick={() => setIsFeedbackListOpen(false)}
//                                     className="text-muted-foreground hover:text-foreground"
//                                 >
//                                     <FiX size={20} />
//                                 </button>
//                             </div>

//                             {/* Content */}
//                             {feedbackListLoading ? (
//                                 <div className="flex justify-center py-10">
//                                     <Loader2 className="animate-spin h-6 w-6 text-primary" />
//                                 </div>
//                             ) : feedbackList.length === 0 ? (
//                                 <p className="text-center text-muted-foreground">
//                                     No feedback available yet.
//                                 </p>
//                             ) : (
//                                 <div className="space-y-4">
//                                     {feedbackList.map((fb) => {

//                                         const isOwner =
//                                             (typeof fb.user === "object"
//                                                 ? fb.user._id
//                                                 : fb.user
//                                             )?.toString() === currentUser?.toString();
//                                         return (
//                                             <div
//                                                 key={fb._id}
//                                                 className="group relative p-4 rounded-xl border border-border bg-secondary flex justify-between gap-4"
//                                             >
//                                                 <div className="flex-1">

//                                                     {/* Name */}
//                                                     <p className="text-sm font-semibold text-foreground">
//                                                         {fb.user?.name || "You"}
//                                                     </p>

//                                                     {/* EDIT MODE */}
//                                                     {editingId === fb._id ? (
//                                                         <>
//                                                             <textarea
//                                                                 value={editText}
//                                                                 onChange={(e) => setEditText(e.target.value)}
//                                                                 className="w-full mt-2 p-2 text-sm border rounded-lg"
//                                                             />

//                                                             {/* Star Rating */}
//                                                             <div className="flex gap-1 mt-2">
//                                                                 {[1, 2, 3, 4, 5].map((num) => (
//                                                                     <FiStar
//                                                                         key={num}
//                                                                         size={18}
//                                                                         onClick={() => setEditRating(num)}
//                                                                         className={`cursor-pointer ${num <= editRating
//                                                                             ? "text-yellow-500 fill-yellow-500"
//                                                                             : "text-gray-400"
//                                                                             }`}
//                                                                     />
//                                                                 ))}
//                                                             </div>

//                                                             <div className="flex gap-2 mt-3">
//                                                                 <button
//                                                                     onClick={handleUpdateFeedback}
//                                                                     className="px-3 py-1 text-xs bg-primary text-white rounded-lg"
//                                                                 >
//                                                                     Save
//                                                                 </button>
//                                                                 <button
//                                                                     onClick={() => setEditingId(null)}
//                                                                     className="px-3 py-1 text-xs border rounded-lg"
//                                                                 >
//                                                                     Cancel
//                                                                 </button>
//                                                             </div>
//                                                         </>
//                                                     ) : (
//                                                         <>
//                                                             {/* Comment */}
//                                                             <p className="text-sm text-muted-foreground mt-1">
//                                                                 {fb.comment}
//                                                             </p>

//                                                             {/* Rating */}
//                                                             <div className="flex gap-1 mt-2">
//                                                                 {[...Array(fb.rating || 0)].map((_, i) => (
//                                                                     <FiStar
//                                                                         key={i}
//                                                                         size={14}
//                                                                         className="text-yellow-500 fill-yellow-500"
//                                                                     />
//                                                                 ))}
//                                                             </div>
//                                                         </>
//                                                     )}
//                                                 </div>

//                                                 {/* ACTION BUTTONS */}
//                                                 {isOwner && (
//                                                     <div className="flex gap-2 items-start">

//                                                         {/* Edit */}
//                                                         <button
//                                                             onClick={() => startEditing(fb)}
//                                                             className="h-9 w-9 flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
//                                                         >
//                                                             <FiEdit2 size={16} />
//                                                         </button>

//                                                         {/* Delete */}
//                                                         <button
//                                                             onClick={() => handleDeleteFeedback(fb._id)}
//                                                             className="h-9 w-9 flex items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20"
//                                                         >
//                                                             <FiTrash2 size={16} />
//                                                         </button>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         );
//                                     })}
//                                 </div>
//                             )}

//                             {/* Footer */}
//                             <button
//                                 onClick={() => setIsFeedbackListOpen(false)}
//                                 className="w-full mt-6 py-2 text-sm border rounded-lg hover:bg-secondary transition"
//                             >
//                                 Close
//                             </button>
//                         </motion.div>
//                     </div>
//                 )}
//             </AnimatePresence>
//             {/* Modals */}
//             <ConfirmModal
//                 isOpen={confirmConfig.isOpen}
//                 onClose={closeConfirm}
//                 onConfirm={confirmConfig.onConfirm}
//                 title={confirmConfig.title}
//                 message={confirmConfig.message}
//             />
//             <JobFormModal
//                 isOpen={isJobModalOpen}
//                 onClose={() => { setIsJobModalOpen(false); setEditingJob(null); }}
//                 onSubmit={handleCreateJob}
//                 loading={jobLoading}
//                 resumes={resumes}
//                 initialData={editingJob}
//             />

//             <ResumeFormModal
//                 isOpen={isCreateOpen}
//                 onClose={() => setIsCreateOpen(false)}
//                 onSubmit={handleCreateResume}
//                 creating={creating}
//             />

//             {/* Promo Popup */}
//             <AnimatePresence>
//                 {showPromoPopup && (
//                     <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             exit={{ opacity: 0 }}
//                             onClick={() => { setShowPromoPopup(false); sessionStorage.setItem("hasSeenPromo", "true"); }}
//                             className="absolute inset-0 bg-black/80 backdrop-blur-md"
//                         />
//                         <motion.div
//                             initial={{ opacity: 0, scale: 0.9, y: 20 }}
//                             animate={{ opacity: 1, scale: 1, y: 0 }}
//                             exit={{ opacity: 0, scale: 0.9, y: 20 }}
//                             className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-2xl"
//                         >
//                             <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/20 to-transparent" />
//                             <button
//                                 onClick={() => { setShowPromoPopup(false); sessionStorage.setItem("hasSeenPromo", "true"); }}
//                                 className="absolute top-6 right-6 z-10 rounded-full bg-secondary p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
//                             >
//                                 <X size={20} />
//                             </button>
//                             <div className="relative p-10 pt-16 text-center">
//                                 <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-inner">
//                                     <Crown size={40} className="fill-primary/20" />
//                                 </div>
//                                 <h2 className="mb-2 text-3xl font-black tracking-tight text-foreground">Unlock Your Full Potential</h2>
//                                 <p className="mb-8 text-muted-foreground leading-relaxed">
//                                     Upgrade to <span className="text-foreground font-bold">Pro</span> for only <span className="text-primary font-bold">$7/mo</span> and get unlimited resumes, AI bullet enhancement, and premium ATS-proof templates.
//                                 </p>
//                                 <div className="mb-10 flex flex-col gap-4 text-left">
//                                     {[
//                                         { icon: <Zap size={16} />, text: "Unlimited Resumes & Edits" },
//                                         { icon: <Sparkles size={16} />, text: "AI-Powered Achievement Rewriting" },
//                                         { icon: <ShieldCheck size={16} />, text: "Priority ATS Scoring Engine" }
//                                     ].map((feature, i) => (
//                                         <div key={i} className="flex items-center gap-4 rounded-2xl bg-secondary p-4 border border-border">
//                                             <div className="text-primary">{feature.icon}</div>
//                                             <span className="text-sm font-medium text-foreground">{feature.text}</span>
//                                         </div>
//                                     ))}
//                                 </div>
//                                 <div className="flex flex-col gap-3">
//                                     <Button
//                                         onClick={() => { handleUpgrade(); setShowPromoPopup(false); sessionStorage.setItem("hasSeenPromo", "true"); }}
//                                         className="h-14 w-full rounded-2xl bg-primary text-xl font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
//                                     >
//                                         Go Pro Now — $7/mo
//                                     </Button>
//                                     <button
//                                         onClick={() => { setShowPromoPopup(false); sessionStorage.setItem("hasSeenPromo", "true"); }}
//                                         className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-300"
//                                     >
//                                         Maybe later
//                                     </button>
//                                 </div>
//                             </div>
//                         </motion.div>
//                     </div>
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// }

// // ✅ Suspense wrapper fixes the useSearchParams() server boundary error
// export default function Page() {
//     return (
//         <Suspense fallback={
//             <div className="flex h-screen items-center justify-center bg-background text-foreground">
//                 <Loader2 className="animate-spin h-8 w-8 text-primary" />
//             </div>
//         }>
//             <Dashboard />
//         </Suspense>
//     );
// }


////////
"use client";

import { Suspense } from "react";
import { useEffect, useState, useRef, cloneElement } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
    Plus,
    FileText,
    Trash2,
    Edit,
    Loader2,
    ExternalLink,
    Clock,
    Layout,
    ShieldCheck,
    Zap,
    Copy,
    Search,
    Sparkles,
    Target,
    CheckCircle2,
    Crown,
    ArrowRight,
    X,
    Upload,
    Wand2,
    LogOut,
} from "lucide-react";
import { FiX, FiEdit2, FiTrash2, FiStar } from "react-icons/fi";
import { FaRegCommentDots } from "react-icons/fa";
import { MdOutlineRateReview } from "react-icons/md";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import ResumeFormModal from "@/components/ResumeFormModal";
import JobFormModal from "@/components/JobFormModal";
import ConfirmModal from "@/components/ConfirmModal";
import { Briefcase as BriefcaseIcon, Building2, Kanban, ChevronRight, MoreHorizontal, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface Resume {
    _id: string;
    title: string;
    updatedAt: string;
    isDraft: boolean;
    selectedTemplate: string;
}

interface Job {
    _id: string;
    companyName: string;
    position: string;
    resume: any;
    status: 'to-apply' | 'applied' | 'interviewing' | 'offered' | 'rejected';
    notes?: string;
    updatedAt: string;
}

const Dashboard = () => {
    const router = useRouter();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [feedbackList, setFeedbackList] = useState<any[]>([]);
    const [feedbackListLoading, setFeedbackListLoading] = useState(false);
    const [isFeedbackListOpen, setIsFeedbackListOpen] = useState(false);
    const jobBoardRef = useRef<HTMLDivElement | null>(null);
    // Create Modal State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [isPolling, setIsPolling] = useState(false);
    const [showPromoPopup, setShowPromoPopup] = useState(false);
    const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);

    const [confirmConfig, setConfirmConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => { },
    });
    const closeConfirm = () => setConfirmConfig(prev => ({ ...prev, isOpen: false }));

    // Job Tracker State
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);
    const [jobLoading, setJobLoading] = useState(false);
    const [editingJob, setEditingJob] = useState<Job | null>(null);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [feedbackText, setFeedbackText] = useState("");
    const [rating, setRating] = useState(5);
    const [feedbackLoading, setFeedbackLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState("");
    const [editRating, setEditRating] = useState(5);
    const searchParams = useSearchParams();
    const [activeSection, setActiveSection] = useState("dashboard");
    const [activeResumeDropdown, setActiveResumeDropdown] = useState<string | null>(null);
    const dashboardRef = useRef<HTMLDivElement | null>(null);
    const feedbackRef = useRef<HTMLDivElement | null>(null);

    // File Upload State
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingResume, setUploadingResume] = useState(false);
    const currentUser = user?._id;

    const fetchAllFeedback = async () => {
        setFeedbackListLoading(true);
        try {
            const res = await api.get("/api/feedback/me");
            setFeedbackList(res.data.data);
        } catch (error) {
            toast.error("Failed to fetch feedback");
        } finally {
            setFeedbackListLoading(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const dashboardTop = dashboardRef.current?.offsetTop || 0;
            const jobTop = jobBoardRef.current?.offsetTop || 0;

            if (scrollY >= jobTop - 100) {
                setActiveSection("job");
            } else {
                setActiveSection("dashboard");
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // 🛠️ FIX: Logout order reversed so redirect happens first
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login"); // Redirect immediately
        toast.success("Logged out successfully"); // Toast triggers after navigation starts
    };

    const handleDeleteFeedback = async (id: string) => {
        setIsFeedbackListOpen(false);
        setConfirmConfig({
            isOpen: true,
            title: "Delete Feedback",
            message: "Delete this feedback?",
            onConfirm: async () => {
                try {
                    await api.delete(`/api/feedback/${id}`);
                    setFeedbackList((prev) => prev.filter((f) => f._id !== id));
                    toast.success("Feedback deleted");
                } catch (error) {
                    toast.error("Failed to delete feedback");
                } finally {
                    closeConfirm();
                }
            }
        });
    };

    const startEditing = (fb: any) => {
        setEditingId(fb._id);
        setEditText(fb.comment);
        setEditRating(fb.rating || 5);
    };

    const handleUpdateFeedback = async () => {
        try {
            const res = await api.put(`/api/feedback/${editingId}`, {
                comment: editText,
                rating: editRating,
            });

            setFeedbackList((prev: any) =>
                prev.map((fb: any) =>
                    fb._id === editingId ? res.data.data : fb
                )
            );

            setEditingId(null);
            toast.success("Feedback updated!");
        } catch {
            toast.error("Failed to update feedback");
        }
    };

    const submitFeedback = async () => {
        if (!feedbackText.trim()) {
            toast.error("Please write your feedback");
            return;
        }

        setFeedbackLoading(true);

        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            await api.post("/api/feedback", {
                userId: user._id,
                comment: feedbackText,
                rating: rating
            });

            toast.success("Feedback submitted successfully!");
            setFeedbackText("");
            setRating(5);
            setIsFeedbackOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit feedback");
        } finally {
            setFeedbackLoading(false);
        }
    };

    useEffect(() => {
        const paymentStatus = searchParams.get("payment");
        if (paymentStatus === "success") {
            toast.success("Payment successful! Updating your account...");
            startPollingProfile();
            router.replace("/dashboard");
        } else if (paymentStatus === "cancelled") {
            toast.error("Payment was cancelled.");
            router.replace("/dashboard");
        }
    }, [searchParams]);

    const startPollingProfile = async () => {
        setIsPolling(true);
        setHasShownSuccessToast(false);
        let attempts = 0;
        const maxAttempts = 10;

        const poll = setInterval(async () => {
            attempts++;
            try {
                await api.post("/api/subscriptions/sync");
                const response = await api.get("/api/auth/me");
                
                if (response.data.isSubscribed) {
                    setUser(response.data);
                    localStorage.setItem("user", JSON.stringify(response.data));
                    
                    if (!hasShownSuccessToast) {
                        toast.success("Welcome to Pro! Your subscription is now active.");
                        setHasShownSuccessToast(true);
                    }
                    
                    setIsPolling(false);
                    clearInterval(poll);
                    fetchResumes();
                } else if (attempts >= maxAttempts) {
                    setIsPolling(false);
                    clearInterval(poll);
                    toast.info("Subscription is being processed. Please refresh in a moment.");
                }
            } catch (error) {
                console.error("Polling failed");
            }
        }, 1000);
    };

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) {
            router.push("/login");
            return;
        }
        fetchProfile();
        fetchResumes();
    }, [router]);

    const fetchProfile = async () => {
        try {
            const response = await api.get("/api/auth/me");
            const userData = response.data;
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
            const hasSeenPromo = sessionStorage.getItem("hasSeenPromo");
            if (!userData.isSubscribed && !hasSeenPromo) {
                setTimeout(() => setShowPromoPopup(true), 1500);
            }
        } catch (error) {
            console.error("Failed to fetch profile");
            const userData = localStorage.getItem("user");
            if (userData) setUser(JSON.parse(userData));
        }
    };

    const fetchResumes = async () => {
        try {
            const response = await api.get("/api/resumes");
            setResumes(response.data);
        } catch (error) {
            toast.error("Failed to fetch resumes");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateResume = async (data: any) => {
        if (!data.title.trim()) {
            toast.error("Please enter a resume title");
            return;
        }
        setCreating(true);
        try {
            const response = await api.post("/api/resumes", {
                title: data.title,
                selectedTemplate: data.selectedTemplate || 'modern'
            });
            toast.success("Resume created successfully!");
            setIsCreateOpen(false);
            router.push(`/editor/${response.data._id}`);
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to create resume";
            toast.error(message);
        } finally {
            setCreating(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
        ];

        if (!allowedTypes.includes(file.type)) {
            toast.error("Invalid file format. Please upload PDF, DOCX, or TXT.");
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size exceeds 5MB limit.");
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setUploadingResume(true);
        const toastId = toast.loading("Processing your resume...");

        try {
            const formData = new FormData();
            formData.append('resume', file);
            const response = await api.post("/api/resumes/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success("Resume data extracted successfully!", { id: toastId });
            router.push(`/editor/${response.data._id}`);
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to upload and parse resume";
            toast.error(message, { id: toastId });
        } finally {
            setUploadingResume(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const deleteResume = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setConfirmConfig({
            isOpen: true,
            title: "Delete Resume",
            message: "Are you sure you want to delete this resume?",
            onConfirm: async () => {
                try {
                    await api.delete(`/api/resumes/${id}`);
                    setResumes((prev) => prev.filter((r) => r._id !== id));
                    toast.success("Resume deleted");
                } catch (error) {
                    toast.error("Failed to delete resume");
                } finally {
                    closeConfirm();
                }
            }
        });
    };

    const duplicateResume = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user?.isSubscribed && resumes.length >= 2) {
            toast.error("Free limit reached. Upgrade to Pro to duplicate.");
            return;
        }
        try {
            const response = await api.post(`/api/resumes/${id}/duplicate`);
            setResumes([response.data, ...resumes]);
            toast.success("Resume duplicated");
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to duplicate resume";
            toast.error(message);
        }
    };

    const handleUpgrade = async () => {
        try {
            const response = await api.post("/api/subscriptions/checkout");
            if (response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (error: any) {
            toast.error("Failed to start checkout session");
        }
    };

    const fetchJobs = async () => {
        try {
            const response = await api.get("/api/jobs");
            setJobs(response.data);
        } catch (error) {
            console.error("Failed to fetch jobs");
        }
    };

    const handleCreateJob = async (data: any) => {
        setJobLoading(true);
        try {
            if (editingJob) {
                const response = await api.put(`/api/jobs/${editingJob._id}`, data);
                setJobs(jobs.map(j => j._id === editingJob._id ? response.data : j));
                toast.success("Job updated successfully!");
            } else {
                const response = await api.post("/api/jobs", data);
                setJobs([response.data, ...jobs]);
                toast.success("Job added to tracker!");
            }
            setIsJobModalOpen(false);
            setEditingJob(null);
        } catch (error: any) {
            toast.error("Failed to save job");
        } finally {
            setJobLoading(false);
        }
    };

    const deleteJob = async (id: string) => {
        setConfirmConfig({
            isOpen: true,
            title: "Remove Job",
            message: "Remove this job from tracker?",
            onConfirm: async () => {
                try {
                    await api.delete(`/api/jobs/${id}`);
                    setJobs((prev) => prev.filter(j => j._id !== id));
                    toast.success("Job removed");
                } catch (error) {
                    toast.error("Failed to delete job");
                } finally {
                    closeConfirm();
                }
            }
        });
    };

    const updateJobStatus = async (id: string, newStatus: string) => {
        try {
            const response = await api.put(`/api/jobs/${id}`, { status: newStatus });
            setJobs(jobs.map(j => j._id === id ? response.data : j));
            const statusName = columns.find(c => c.id === newStatus)?.name || newStatus;
            toast.success(`Moved to ${statusName}`);
        } catch (error) {
            toast.error("Failed to move job");
        }
    };

    const getNextStatus = (currentStatus: string) => {
        const currentIndex = columns.findIndex(c => c.id === currentStatus);
        if (currentIndex !== -1 && currentIndex < columns.length - 1) {
            return columns[currentIndex + 1];
        }
        return null;
    };

    const getPrevStatus = (currentStatus: string) => {
        const currentIndex = columns.findIndex(c => c.id === currentStatus);
        if (currentIndex > 0) {
            return columns[currentIndex - 1];
        }
        return null;
    };

    const columns = [
        { id: 'to-apply', name: 'To Apply', color: 'text-gray-400', bg: 'bg-white/5', icon: <Target size={14} /> },
        { id: 'applied', name: 'Applied', color: 'text-blue-400', bg: 'bg-blue-500/10', icon: <BriefcaseIcon size={14} /> },
        { id: 'interviewing', name: 'Interviewing', color: 'text-amber-400', bg: 'bg-amber-500/10', icon: <Sparkles size={14} /> },
        { id: 'offered', name: 'Offered', color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: <ShieldCheck size={14} /> },
        { id: 'rejected', name: 'Rejected', color: 'text-red-400', bg: 'bg-red-500/10', icon: <Trash2 size={14} /> },
    ];

    const filteredResumes = resumes.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background text-foreground">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
            {/* Sidebar Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 z-40 h-screen w-64 border-r border-border bg-card transition-all duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="flex h-full flex-col p-6">
                    <Link href="/dashboard" className="mb-10 flex items-center gap-3 text-2xl font-black">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                            R
                        </div>
                        Resumen
                    </Link>


                    <nav className="flex-1 space-y-2">

                        {/* Dashboard */}
                        <button
                            onClick={() => {
                                dashboardRef.current?.scrollIntoView({ behavior: "smooth" });
                                setActiveSection("dashboard");
                            }}
                            className={`flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium transition
        ${activeSection === "dashboard"
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                }`}
                        >
                            <Layout size={18} /> Dashboard
                        </button>

                        {/* Job Board */}
                        <button
                            onClick={() => {
                                jobBoardRef.current?.scrollIntoView({ behavior: "smooth" });
                                setActiveSection("job");
                            }}
                            className={`flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium transition
        ${activeSection === "job"
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                }`}
                        >
                            <Kanban size={18} /> Job Board
                        </button>

                        {/* AI Cover Letter */}
                        <Link
                            href="/dashboard/cover-letter"
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                        >
                            <Sparkles size={18} className="text-primary" /> AI Cover Letter
                        </Link>
                        <Link
                            href="/dashboard/interview"
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                        >
                            <Wand2 size={18} className="text-primary" /> AI Interview Prep
                        </Link>
                        {/* Create Resume */}
                        <button
                            onClick={() => {
                                setIsCreateOpen(true);
                            }}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                        >
                            <Plus size={18} /> Create Resume
                        </button>


                        <button
                            onClick={() => router.push("/dashboard/jobsearch")}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                        >
                            <Search size={18} />
                            Job Search
                        </button>
                        {/* Leave Feedback */}
                        <button
                            onClick={() => setIsFeedbackOpen(true)}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                        >
                            <FaRegCommentDots size={18} /> Leave Feedback
                        </button>
                        <button
                            onClick={() => {
                                setIsFeedbackListOpen(true);
                                fetchAllFeedback();
                            }}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                        >
                            <MdOutlineRateReview size={18} /> Manage Feedback
                        </button>
                    </nav>

                    <div className="mt-auto space-y-4">

                        <div className="flex items-center gap-2">
                            {user?.isSubscribed && <Crown size={16} className="text-yellow-500 fill-yellow-500" />}
                            <span className={`text-xs uppercase tracking-widest font-bold ${user?.isSubscribed ? 'text-primary' : 'text-muted-foreground'}`}>
                                {user?.isSubscribed ? 'Pro Account' : 'Standard Account'}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-lg shadow-primary/20">
                                {user?.name?.[0] || 'U'}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">{user?.name}</span>
                            </div>
                        </div>                                
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="md:ml-64 transition-all duration-300">
                {/* Header */}
                <header className="sticky top-0 z-30 flex h-16 md:h-20 items-center justify-between border-b border-border bg-background/80 px-4 md:px-6 backdrop-blur-md">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="rounded-lg p-2 text-muted-foreground hover:bg-accent md:hidden">
                        <Menu size={24} />
                    </button>
                    <div className="hidden md:block text-2xl font-bold text-foreground">Dashboard</div>
                    <div className="flex items-center gap-2 md:gap-4">
                        {!user?.isSubscribed && (
                            <Button
                                onClick={handleUpgrade}
                                className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white font-bold text-xs h-8 md:h-9 px-3 md:px-4 rounded-xl shadow-lg shadow-primary/20"
                            >
                                <Zap size={14} className="mr-1 md:mr-2" /> Upgrade
                            </Button>
                        )}
                        <ThemeToggle />
                        <div className="hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-lg shadow-primary/20">
                            {user?.name?.[0] || 'U'}
                        </div>
                        <Button
                            onClick={handleLogout}
                            className="rounded-xl font-bold h-8 md:h-10 px-3 md:px-6 gap-1 md:gap-2 bg-primary hover:bg-red-600 text-white shadow-lg text-xs md:text-sm"
                        >
                            <LogOut size={14} className="md:hidden" />
                            <span className="hidden md:inline"><LogOut size={16} /> Logout</span>
                        </Button>
                    
                    </div>
                </header>

                <main className="mx-auto max-w-7xl relative z-10 px-4 md:px-8 py-8 md:py-12">
                    {/* Hero / Welcome Section */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileUpload}
                    />
    
                    <div className="mb-12 md:mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col gap-6"
                        >
                            {/* TEXT SECTION */}
                            <div ref={dashboardRef} className="max-w-3xl">
                                <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight mb-2 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                                    Welcome, {user?.name.split(" ")[0]}

                                    {user?.isSubscribed && (
                                        <span className="ml-2 md:ml-3 inline-flex items-center gap-1.5 px-2 md:px-3 py-1 bg-primary text-[8px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] rounded-full text-white align-middle shadow-lg shadow-primary/30">
                                            <Crown size={10} className="fill-white" />
                                            PRO
                                        </span>
                                    )}
                                </h1>

                                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                                    Ready to build something great today? Your next career milestone starts
                                    with a perfectly crafted resume.
                                </p>
                            </div>

                            {/* BUTTONS SECTION - Fully Responsive */}
                            <div className="flex flex-wrap items-center gap-3 md:gap-4">
                                {/* Create */}
                                <Button
                                    onClick={() => {
                                        if (!user?.isSubscribed && resumes.length >= 2) {
                                            toast.error("Free limit reached. Upgrade to Pro for unlimited resumes.");
                                            return;
                                        }
                                        setIsCreateOpen(true);
                                    }}
                                    className="h-10 md:h-12 px-5 md:px-8 whitespace-nowrap rounded-2xl bg-primary text-primary-foreground hover:bg-primary/95 text-sm md:text-base font-bold shadow-xl transition-all hover:scale-[1.03]"
                                >
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <div className="h-6 w-6 md:h-7 md:w-7 flex items-center justify-center rounded-full bg-white/20">
                                            <Plus size={16} className="text-white" />
                                        </div>
                                        <span className="hidden sm:inline">Create New Resume</span>
                                        <span className="sm:hidden">Create</span>
                                    </div>
                                </Button>

                                {/* Upload */}
                                <Button
                                    onClick={() => {
                                        if (!user?.isSubscribed && resumes.length >= 2) {
                                            toast.error("Free limit reached. Upgrade to Pro for unlimited resumes.");
                                            return;
                                        }
                                        fileInputRef.current?.click();
                                    }}
                                    disabled={uploadingResume}
                                    className="h-10 md:h-12 px-5 md:px-8 whitespace-nowrap rounded-2xl bg-secondary border border-border/50 text-foreground hover:bg-accent text-sm md:text-base font-bold shadow-xl shadow-black/5 transition-all hover:scale-[1.03]"
                                >
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <div className="h-6 w-6 md:h-7 md:w-7 flex items-center justify-center rounded-full bg-primary/10">
                                            {uploadingResume ? (
                                                <Loader2 className="animate-spin text-primary" size={16} />
                                            ) : (
                                                <Upload size={16} className="text-primary" />
                                            )}
                                        </div>
                                        {uploadingResume ? "Processing..." : <span className="hidden sm:inline">Upload Resume</span>}
                                        {uploadingResume ? null : <span className="sm:hidden">Upload</span>}
                                    </div>
                                </Button>

                                {/* Cover Letter */}
                                <Button
                                    onClick={() => router.push("/dashboard/cover-letter")}
                                    className="h-10 md:h-12 px-5 md:px-8 whitespace-nowrap rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 hover:opacity-95 text-sm md:text-base font-bold text-white shadow-xl shadow-indigo-500/20 transition-all hover:scale-[1.03]"
                                >
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <div className="h-6 w-6 md:h-7 md:w-7 flex items-center justify-center rounded-full bg-white/10">
                                            <Sparkles size={16} className="fill-white" />
                                        </div>
                                        <span className="hidden sm:inline">AI Cover Letter</span>
                                        <span className="sm:hidden">AI Letter</span>
                                    </div>
                                </Button>

                                {/* Ai Interview Prep */}
                                <Button
                                    onClick={() => router.push("/dashboard/interview")}
                                    className="h-10 md:h-12 px-5 md:px-8 whitespace-nowrap rounded-2xl bg-secondary border border-border/50 text-foreground hover:bg-accent text-sm md:text-base font-bold shadow-xl shadow-black/5 transition-all hover:scale-[1.03]"
                                >
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <div className="h-6 w-6 md:h-7 md:w-7 flex items-center justify-center rounded-full bg-white/10">
                                            <Wand2 size={16} className="text-primary" />
                                        </div>
                                        <span className="hidden sm:inline">AI Interview Prep</span>
                                        <span className="sm:hidden">AI Prep</span>
                                    </div>
                                </Button>
                            </div>
                        </motion.div>

                        {/* Quick Stats - Mobile Responsive Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-8 md:mt-12">
                            {[
                                {
                                    icon: <FileText className="text-blue-400" />,
                                    label: "Total Resumes",
                                    value: user?.isSubscribed ? resumes.length : `${resumes.length}/2`,
                                    subLabel: !user?.isSubscribed ? "Free Limit" : "Unlimited"
                                },
                                { icon: <Clock className="text-amber-400" />, label: "Last Edited", value: resumes[0] ? new Date(resumes[0].updatedAt).toLocaleDateString() : 'N/A' },
                                { icon: <Zap className="text-purple-400" />, label: "Active Drafts", value: resumes.filter(r => r.isDraft).length },
                                { icon: <ShieldCheck className="text-emerald-400" />, label: "ATS Health", value: "Optimal" }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-3 md:p-6 rounded-2xl border border-border bg-card flex items-center gap-3 md:gap-4 shadow-sm"
                                >
                                    <div className="h-8 w-8 md:h-12 md:w-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                                        {stat.icon}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-[8px] md:text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none mb-0.5 md:mb-1 truncate">{stat.label}</p>
                                        <p className="text-base md:text-xl font-bold text-foreground truncate">{stat.value}</p>
                                        {(stat as any).subLabel && <p className="text-[7px] md:text-[9px] text-muted-foreground font-bold uppercase tracking-wider truncate">{(stat as any).subLabel}</p>}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Resumes Section - Mobile Responsive */}
                    <div className="space-y-6 md:space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6 md:pb-8">
                            <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-3">
                                <Layout size={20} className="text-primary" />
                                Recent Projects
                            </h2>
                            <div className="relative w-full md:w-80">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search resumes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-10 md:h-11 bg-input border border-border rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                            </div>
                        </div>

                        {filteredResumes.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center rounded-[2rem] md:rounded-[2.5rem] border-2 border-dashed border-border bg-card py-16 md:py-32 px-4 text-center"
                            >
                                <div className="mb-6 inline-flex h-16 w-16 md:h-24 md:w-24 items-center justify-center rounded-3xl bg-secondary text-muted-foreground ring-1 ring-border">
                                    <FileText size={32} />
                                </div>
                                <h3 className="text-xl md:text-3xl font-bold text-foreground mb-2">
                                    {searchQuery ? "No matches found" : "No resumes found"}
                                </h3>
                                <p className="mt-2 max-w-md text-muted-foreground text-sm md:text-lg">
                                    {searchQuery
                                        ? `Could not find any resume matching "${searchQuery}"`
                                        : "Start your professional journey. Create your first resume with our precision designs."}
                                </p>
                                {!searchQuery && (
                                    <Button
                                        onClick={() => setIsCreateOpen(true)}
                                        size="lg"
                                        className="mt-8 md:mt-10 h-12 md:h-14 px-8 md:px-10 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                                    >
                                        Create Your First Resume
                                    </Button>
                                )}
                            </motion.div>
                        ) : (
                            <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                <AnimatePresence>
                                    {filteredResumes.map((resume, index) => (
                                        <motion.div
                                            key={resume._id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group relative flex flex-col rounded-[2rem] border border-border bg-card transition-all hover:border-primary/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden"
                                        >
                                            <div className="aspect-[1.4/1] w-full bg-secondary p-4 md:p-6 relative overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <div className="relative h-full w-full bg-background rounded-xl p-3 md:p-4 flex flex-col gap-2 shadow-2xl border border-border opacity-60">
                                                    <div className="h-2.5 w-1/2 bg-muted rounded-full" />
                                                    <div className="h-1.5 w-1/4 bg-muted rounded-full" />
                                                    <div className="mt-3 md:mt-4 flex flex-col gap-1.5">
                                                        <div className="h-1 w-full bg-muted rounded-full" />
                                                        <div className="h-1 w-full bg-muted rounded-full" />
                                                        <div className="h-1 w-3/4 bg-muted rounded-full" />
                                                    </div>
                                                </div>
                                                <div className="absolute top-3 md:top-4 right-3 md:right-4 z-10">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveResumeDropdown(activeResumeDropdown === resume._id ? null : resume._id);
                                                        }}
                                                        className="h-8 w-8 md:h-10 md:w-10 flex items-center justify-center rounded-xl bg-background/80 backdrop-blur-md border border-border text-foreground hover:bg-accent transition-all shadow-lg shadow-black/20"
                                                    >
                                                        <MoreHorizontal size={16} />
                                                    </button>

                                                    <AnimatePresence>
                                                        {activeResumeDropdown === resume._id && (
                                                            <>
                                                                <div
                                                                    className="fixed inset-0 z-10"
                                                                    onClick={() => setActiveResumeDropdown(null)}
                                                                />
                                                                <motion.div
                                                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                                    className="absolute right-0 mt-2 w-44 md:w-48 rounded-2xl border border-border bg-card p-2 shadow-2xl z-20 overflow-hidden"
                                                                >
                                                                    <button
                                                                        onClick={() => {
                                                                            router.push(`/editor/${resume._id}`);
                                                                            setActiveResumeDropdown(null);
                                                                        }}
                                                                        className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs md:text-sm font-medium text-foreground hover:bg-accent transition-colors"
                                                                    >
                                                                        <Edit size={14} className="text-primary" /> Edit Resume
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            duplicateResume(resume._id, e);
                                                                            setActiveResumeDropdown(null);
                                                                        }}
                                                                        className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs md:text-sm font-medium text-foreground hover:bg-accent transition-colors"
                                                                    >
                                                                        <Copy size={14} className="text-primary" /> Duplicate
                                                                    </button>
                                                                    <div className="my-1 border-t border-border/50" />
                                                                    <button
                                                                        onClick={(e) => {
                                                                            deleteResume(resume._id, e);
                                                                            setActiveResumeDropdown(null);
                                                                        }}
                                                                        className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs md:text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
                                                                    >
                                                                        <Trash2 size={14} /> Delete
                                                                    </button>
                                                                </motion.div>
                                                            </>
                                                        )}
                                                    </AnimatePresence>
                                                </div>

                                                <div
                                                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100 backdrop-blur-[2px] cursor-pointer"
                                                    onClick={() => router.push(`/editor/${resume._id}`)}
                                                >
                                                    <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-2xl">
                                                        <ExternalLink size={20} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-4 md:p-6">
                                                <div className="flex items-start justify-between mb-3 md:mb-4">
                                                    <div className="min-w-0 flex-1 mr-2">
                                                        <h3 className="font-bold text-base md:text-xl text-foreground truncate group-hover:text-primary transition-colors">{resume.title}</h3>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate">{resume.selectedTemplate} template</span>
                                                        </div>
                                                    </div>
                                                    <div className={`px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg text-[7px] md:text-[9px] font-black uppercase tracking-widest border shrink-0 ${resume.isDraft ? 'bg-amber-500/5 text-amber-500 border-amber-500/20' : 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20'}`}>
                                                        {resume.isDraft ? 'Draft' : 'Final'}
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between border-t border-border pt-3 md:pt-4">
                                                    <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-[11px] text-muted-foreground">
                                                        <Clock size={10} />
                                                        {new Date(resume.updatedAt).toLocaleDateString()}
                                                    </div>
                                                    <Button onClick={() => router.push(`/editor/${resume._id}`)} variant="link" className="h-auto p-0 text-primary hover:text-primary/80 font-bold text-[10px] md:text-xs gap-1">
                                                        Open Editor <ExternalLink size={10} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Job Tracker Section - Fully Mobile Swipe Responsive */}
                    <div ref={jobBoardRef} className="mt-16 md:mt-24 space-y-6 md:space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6 md:pb-8">
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-3">
                                    <Kanban size={20} className="text-primary" />
                                    Job Tracker
                                </h2>
                                <p className="text-xs md:text-sm text-muted-foreground mt-1">Manage your applications and see your progress at a glance.</p>
                            </div>
                            <Button
                                onClick={() => { setEditingJob(null); setIsJobModalOpen(true); }}
                                className="bg-secondary hover:bg-purple-700 text-foreground border border-border rounded-xl px-4 md:px-6 h-10 md:h-11 transition-all flex items-center gap-1.5 md:gap-2 text-sm"
                            >
                                <Plus size={16} /> <span className="hidden sm:inline">Add Job Application</span><span className="sm:hidden">Add</span>
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 overflow-x-auto pb-6 custom-scrollbar touch-pan-x">
                            {columns.map((column) => (
                                <div key={column.id} className="flex flex-col gap-4 min-w-[260px] md:min-w-[280px] w-full">
                                    <div className={`flex items-center justify-between px-3 py-2 rounded-xl ${column.bg} border border-border/40 backdrop-blur-sm transition-all`}>
                                        <div className="flex items-center gap-2">
                                            <div className="text-foreground/70">
                                                {cloneElement(column.icon as React.ReactElement, { size: 12 })}
                                            </div>
                                            <span className={`text-[8px] font-bold uppercase tracking-[0.15em] ${column.color}`}>{column.name}</span>
                                        </div>
                                        <span className="text-[8px] font-bold text-muted-foreground bg-background/50 px-1.5 py-0.5 rounded-md border border-border/30">
                                            {jobs.filter(j => j.status === column.id).length}
                                        </span>
                                    </div>

                                    <div className="space-y-4 min-h-[300px] md:min-h-[500px] rounded-2xl bg-card border border-border p-3">
                                        {jobs.filter(j => j.status === column.id).map((job) => {
                                            const nextStatus = getNextStatus(job.status);
                                            const prevStatus = getPrevStatus(job.status);
                                            return (
                                                <motion.div
                                                    key={job._id}
                                                    layoutId={job._id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="p-3 md:p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all group relative overflow-hidden"
                                                >
                                                    <div className="flex justify-between items-start mb-2 md:mb-3">
                                                        <div className="min-w-0 flex-1 mr-1">
                                                            <h4 className="font-bold text-xs md:text-sm text-foreground truncate tracking-tight group-hover:text-primary transition-colors">{job.position}</h4>
                                                            <p className="text-[8px] md:text-[9px] text-muted-foreground flex items-center gap-1.5 mt-0.5 font-medium uppercase tracking-wider truncate">
                                                                {job.companyName}
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                                                            <button onClick={() => { setEditingJob(job); setIsJobModalOpen(true); }} className="h-5 w-5 md:h-6 md:w-6 rounded-md bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-foreground border border-border/50 transition-all">
                                                                <Edit size={10} />
                                                            </button>
                                                            <button onClick={() => deleteJob(job._id)} className="h-5 w-5 md:h-6 md:w-6 rounded-md bg-destructive/10 flex items-center justify-center text-destructive/80 hover:bg-destructive border border-destructive/10 transition-all">
                                                                <Trash2 size={10} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-1.5 md:gap-2 py-1 px-1.5 md:px-2 rounded-lg bg-secondary/50 border border-border/30 mb-2 md:mb-3 overflow-hidden">
                                                        <FileText size={8} className="text-primary/70 shrink-0" />
                                                        <p className="text-[7px] md:text-[9px] text-muted-foreground font-medium truncate">
                                                            {job.resume?.title || "No resume linked"}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-2 md:pt-3 border-t border-border/30 flex-wrap gap-1">
                                                        <div className="flex items-center gap-1">
                                                            {prevStatus && (
                                                                <button onClick={() => updateJobStatus(job._id, prevStatus.id)} title={`Move to ${prevStatus.name}`} className="h-5 w-5 md:h-7 md:w-7 rounded-md flex items-center justify-center bg-secondary text-muted-foreground hover:text-foreground border border-border/30 transition-all">
                                                                    <ChevronRight size={10} className="rotate-180" />
                                                                </button>
                                                            )}
                                                            {nextStatus && (
                                                                <button onClick={() => updateJobStatus(job._id, nextStatus.id)} className={`px-1.5 md:px-2.5 h-5 md:h-7 rounded-md flex items-center gap-1 text-[6px] md:text-[8px] font-bold uppercase tracking-widest ${nextStatus.color} ${nextStatus.bg} border border-border/40 hover:brightness-105 transition-all`}>
                                                                    {nextStatus.name} <ChevronRight size={8} />
                                                                </button>
                                                            )}
                                                        </div>
                                                        <div className="text-[7px] md:text-[8px] font-bold text-muted-foreground/50 tabular-nums">
                                                            {new Date(job.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}

                                        {jobs.filter(j => j.status === column.id).length === 0 && (
                                            <div className="h-full flex flex-col items-center justify-center opacity-20 py-12 md:py-20 px-4 text-center">
                                                <BriefcaseIcon size={20} className="mb-2" />
                                                <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest">No Applications</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upgrade Banner - Mobile Responsive */}
                    {!user?.isSubscribed && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mt-16 md:mt-24 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-r from-primary/20 via-primary/5 to-transparent border border-primary/20 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none hidden md:block">
                                <Crown size={160} className="text-primary rotate-12" />
                            </div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                                <div className="max-w-xl text-center md:text-left">
                                    <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Ready to go Pro?</h3>
                                    <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                                        Unlock unlimited resumes and AI features for just <span className="text-foreground font-bold">$7/mo</span>.
                                    </p>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-4 mt-6 md:mt-8">
                                        {["Unlimited Resumes", "AI Bullet Enhancer", "Pro Templates", "Priority Export"].map(feature => (
                                            <div key={feature} className="flex items-center gap-1.5 md:gap-2 text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 md:px-4 py-1.5 md:py-2 rounded-xl border border-primary/10">
                                                <CheckCircle2 size={10} /> {feature}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Button onClick={handleUpgrade} className="h-12 md:h-16 px-8 md:px-12 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg md:text-xl shadow-[0_0_30px_rgba(124,58,237,0.4)] shrink-0 group w-full md:w-auto">
                                    Get Pro Access <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Features Section - Mobile Responsive */}
                    <div className="mt-20 md:mt-32 pt-12 md:pt-20 border-t border-border">
                        <div className="text-center mb-10 md:mb-16 px-4">
                            <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-primary mb-4">Built for Success</h3>
                            <h2 className="text-2xl md:text-4xl font-black tracking-tighter text-foreground">Everything you need to land the job</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 px-4 md:px-0">
                            {[
                                { title: "AI Bullet Enhancer", desc: "Upgrade your impact with AI-powered revisions designed to grab a recruiter's attention.", icon: <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-primary" /> },
                                { title: "ATS Scoring Engine", desc: "Rigorous testing against hiring algorithms to ensure you bypass the automated filters.", icon: <ShieldCheck className="h-6 w-6 md:h-8 md:w-8 text-emerald-400" /> },
                                { title: "Job Application Tracker", desc: "A built-in Kanban board to manage your pipeline and link resumes to specific jobs.", icon: <Layout className="h-6 w-6 md:h-8 md:w-8 text-blue-400" /> },
                                { title: "Ultra-Fast Generation", desc: "Puppeteer-powered PDF rendering ensures pixel-perfect results in less than a second.", icon: <Zap className="h-6 w-6 md:h-8 md:w-8 text-yellow-400" /> }
                            ].map((feature, i) => (
                                <div key={i} className="p-6 md:p-8 rounded-[2rem] bg-card border border-border hover:bg-accent transition-all group">
                                    <div className="mb-4 md:mb-6 h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                                        {feature.icon}
                                    </div>
                                    <h4 className="text-base md:text-lg font-bold text-foreground mb-2">{feature.title}</h4>
                                    <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>


            <AnimatePresence>
                {isFeedbackOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/70"
                            onClick={() => setIsFeedbackOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 md:p-8 m-4"
                        >
                            <h3 className="text-xl font-bold mb-4">
                                Share Your Experience
                            </h3>
                            <div className="mb-4">
                                <label className="text-sm font-medium">
                                    Rating
                                </label>
                                <select
                                    value={rating}
                                    onChange={(e) => setRating(Number(e.target.value))}
                                    className="w-full mt-2 p-2 border rounded-md bg-background text-foreground"
                                >
                                    <option value={5}>⭐⭐⭐⭐⭐</option>
                                    <option value={4}>⭐⭐⭐⭐</option>
                                    <option value={3}>⭐⭐⭐</option>
                                    <option value={2}>⭐⭐</option>
                                    <option value={1}>⭐</option>
                                </select>
                            </div>

                            <textarea
                                value={feedbackText}
                                onChange={(e) => setFeedbackText(e.target.value)}
                                placeholder="Tell us how the website helped you..."
                                className="w-full h-32 p-3 rounded-xl border border-border bg-background text-foreground placeholder-muted-foreground"
                            />

                            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                <Button
                                    onClick={submitFeedback}
                                    disabled={feedbackLoading}
                                    className="flex-1"
                                >
                                    {feedbackLoading ? "Submitting..." : "Submit Feedback"}
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsFeedbackOpen(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {isFeedbackListOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFeedbackListOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        {/* Modal */}
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.92, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-card p-4 md:p-6 shadow-xl"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold">Manage Feedback</h3>
                                <button
                                    onClick={() => setIsFeedbackListOpen(false)}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <FiX size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            {feedbackListLoading ? (
                                <div className="flex justify-center py-10">
                                    <Loader2 className="animate-spin h-6 w-6 text-primary" />
                                </div>
                            ) : feedbackList.length === 0 ? (
                                <p className="text-center text-muted-foreground">
                                    No feedback available yet.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {feedbackList.map((fb) => {
                                        const isOwner =
                                            (typeof fb.user === "object"
                                                ? fb.user._id
                                                : fb.user
                                            )?.toString() === currentUser?.toString();
                                        return (
                                            <div
                                                key={fb._id}
                                                className="group relative p-4 rounded-xl border border-border bg-secondary flex flex-col sm:flex-row justify-between gap-4"
                                            >
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-foreground">
                                                        {fb.user?.name || "You"}
                                                    </p>
                                                    {editingId === fb._id ? (
                                                        <>
                                                            <textarea
                                                                value={editText}
                                                                onChange={(e) => setEditText(e.target.value)}
                                                                className="w-full mt-2 p-2 text-sm border rounded-lg bg-background text-foreground"
                                                            />
                                                            <div className="flex gap-1 mt-2">
                                                                {[1, 2, 3, 4, 5].map((num) => (
                                                                    <FiStar
                                                                        key={num}
                                                                        size={18}
                                                                        onClick={() => setEditRating(num)}
                                                                        className={`cursor-pointer ${num <= editRating
                                                                            ? "text-yellow-500 fill-yellow-500"
                                                                            : "text-gray-400"
                                                                            }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <div className="flex flex-wrap gap-2 mt-3">
                                                                <button
                                                                    onClick={handleUpdateFeedback}
                                                                    className="px-3 py-1 text-xs bg-primary text-white rounded-lg"
                                                                >
                                                                    Save
                                                                </button>
                                                                <button
                                                                    onClick={() => setEditingId(null)}
                                                                    className="px-3 py-1 text-xs border rounded-lg"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="text-sm text-muted-foreground mt-1">
                                                                {fb.comment}
                                                            </p>
                                                            <div className="flex gap-1 mt-2">
                                                                {[...Array(fb.rating || 0)].map((_, i) => (
                                                                    <FiStar
                                                                        key={i}
                                                                        size={14}
                                                                        className="text-yellow-500 fill-yellow-500"
                                                                    />
                                                                ))}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                {isOwner && (
                                                    <div className="flex gap-2 items-start sm:self-start">
                                                        <button
                                                            onClick={() => startEditing(fb)}
                                                            className="h-9 w-9 flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 shrink-0"
                                                        >
                                                            <FiEdit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteFeedback(fb._id)}
                                                            className="h-9 w-9 flex items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 shrink-0"
                                                        >
                                                            <FiTrash2 size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Footer */}
                            <button
                                onClick={() => setIsFeedbackListOpen(false)}
                                className="w-full mt-6 py-2 text-sm border rounded-lg hover:bg-secondary transition"
                            >
                                Close
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Modals */}
            <ConfirmModal
                isOpen={confirmConfig.isOpen}
                onClose={closeConfirm}
                onConfirm={confirmConfig.onConfirm}
                title={confirmConfig.title}
                message={confirmConfig.message}
            />
            <JobFormModal
                isOpen={isJobModalOpen}
                onClose={() => { setIsJobModalOpen(false); setEditingJob(null); }}
                onSubmit={handleCreateJob}
                loading={jobLoading}
                resumes={resumes}
                initialData={editingJob}
            />

            <ResumeFormModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSubmit={handleCreateResume}
                creating={creating}
            />

            {/* Promo Popup - Mobile Responsive */}
            <AnimatePresence>
                {showPromoPopup && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => { setShowPromoPopup(false); sessionStorage.setItem("hasSeenPromo", "true"); }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border border-border bg-card shadow-2xl"
                        >
                            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/20 to-transparent" />
                            <button
                                onClick={() => { setShowPromoPopup(false); sessionStorage.setItem("hasSeenPromo", "true"); }}
                                className="absolute top-4 right-4 md:top-6 md:right-6 z-10 rounded-full bg-secondary p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                            >
                                <X size={18} />
                            </button>
                            <div className="relative p-6 md:p-10 pt-12 md:pt-16 text-center">
                                <div className="mx-auto mb-6 flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-inner">
                                    <Crown size={32} className="fill-primary/20" />
                                </div>
                                <h2 className="mb-2 text-2xl md:text-3xl font-black tracking-tight text-foreground">Unlock Your Full Potential</h2>
                                <p className="mb-6 md:mb-8 text-muted-foreground leading-relaxed text-sm md:text-base">
                                    Upgrade to <span className="text-foreground font-bold">Pro</span> for only <span className="text-primary font-bold">$7/mo</span> and get unlimited resumes, AI bullet enhancement, and premium ATS-proof templates.
                                </p>
                                <div className="mb-8 md:mb-10 flex flex-col gap-3 md:gap-4 text-left">
                                    {[
                                        { icon: <Zap size={14} />, text: "Unlimited Resumes & Edits" },
                                        { icon: <Sparkles size={14} />, text: "AI-Powered Achievement Rewriting" },
                                        { icon: <ShieldCheck size={14} />, text: "Priority ATS Scoring Engine" }
                                    ].map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3 md:gap-4 rounded-2xl bg-secondary p-3 md:p-4 border border-border">
                                            <div className="text-primary">{feature.icon}</div>
                                            <span className="text-xs md:text-sm font-medium text-foreground">{feature.text}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Button
                                        onClick={() => { handleUpgrade(); setShowPromoPopup(false); sessionStorage.setItem("hasSeenPromo", "true"); }}
                                        className="h-12 md:h-14 w-full rounded-2xl bg-primary text-base md:text-xl font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        Go Pro Now — $7/mo
                                    </Button>
                                    <button
                                        onClick={() => { setShowPromoPopup(false); sessionStorage.setItem("hasSeenPromo", "true"); }}
                                        className="text-xs md:text-sm font-medium text-gray-500 transition-colors hover:text-gray-300"
                                    >
                                        Maybe later
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ✅ Suspense wrapper fixes the useSearchParams() server boundary error
export default function Page() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center bg-background text-foreground">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
        }>
            <Dashboard />
        </Suspense>
    );
}