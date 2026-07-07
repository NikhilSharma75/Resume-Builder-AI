"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Sparkles,
    ChevronLeft,
    FileText,
    Building2,
    Briefcase,
    MessageSquareText,
    Loader2,
    Copy,
    CheckCircle2,
    RefreshCw,
    Download,
    Layout
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { RichTextEditor } from "@/components/RichTextEditor";

interface Resume {
    _id: string;
    title: string;
    updatedAt: string;
}

export default function CoverLetterPage() {
    const router = useRouter();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loadingResumes, setLoadingResumes] = useState(true);
    const [generating, setGenerating] = useState(false);

    // Form State
    const [selectedResumeId, setSelectedResumeId] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [generatedCoverLetter, setGeneratedCoverLetter] = useState("");
    const [copied, setCopied] = useState(false);
const [credits, setCredits] = useState<number | null>(null);
   useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
        router.push("/login");
        return;
    }

    const parsed = JSON.parse(userData);
    setCredits(parsed.credits); // ✅ ADD THIS

    fetchResumes();
}, [router]);

    const fetchResumes = async () => {
        try {
            const response = await api.get("/api/resumes");
            setResumes(response.data);
            if (response.data.length > 0) {
                setSelectedResumeId(response.data[0]._id);
            }
        } catch (error) {
            toast.error("Failed to fetch resumes");
        } finally {
            setLoadingResumes(false);
        }
    };

 const handleGenerate = async () => {
    if (!selectedResumeId) {
        toast.error("Please select a resume first");
        return;
    }

    // ✅ block if no credits
    if (credits !== null && credits <= 0) {
        toast.error("No credits left. Please upgrade.");
        return;
    }

    setGenerating(true);
    const toastId = toast.loading("Generating your personalized cover letter...");

    try {
        const response = await api.post("/api/resumes/generate-cover-letter", {
            resumeId: selectedResumeId,
            jobTitle,
            companyName,
            jobDescription
        });

        // ✅ UPDATE CREDITS FROM BACKEND
        if (response.data?.credits !== undefined) {
            setCredits(response.data.credits);

            // optional: keep localStorage in sync
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            user.credits = response.data.credits;
            localStorage.setItem("user", JSON.stringify(user));
        }

        const formattedContent = response.data.coverLetter
            .split('\n\n')
            .map((para: string) => `<p>${para.replace(/\n/g, '<br>')}</p>`)
            .join('');

        setGeneratedCoverLetter(formattedContent);

        toast.success("Cover letter generated!", { id: toastId });

    } catch (error: any) {
        const message = error.response?.data?.message || "Failed to generate cover letter";

        // ✅ CREDIT ERROR HANDLE
        if (message.toLowerCase().includes("credit")) {
            toast.error("Not enough credits. Please upgrade.", { id: toastId });
        } else {
            toast.error(message, { id: toastId });
        }

    } finally {
        setGenerating(false);
    }
};

    const stripHtml = (html: string) => {
        if (typeof window === "undefined") return html;
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

    const copyToClipboard = () => {
        const text = stripHtml(generatedCoverLetter);
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadTxt = () => {
        const text = stripHtml(generatedCoverLetter);
        const element = document.createElement("a");
        const file = new Blob([text], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${companyName || 'Cover_Letter'}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
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
            {/* Header */}
            <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-accent rounded-xl transition-all">
                        <ChevronLeft size={24} className="text-muted-foreground" />
                    </Link>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
                            AI Cover Letter
                        </h1>
                    </div>
                
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                   <span className="text-md font-semibold text-muted-foreground">
    Credits:{" "}
    <span
        className={`font-bold ${
            credits !== null && credits <= 5
                ? "text-red-500"
                : "text-primary"
        }`}
    >
        {credits ?? 0}
    </span>
</span>
                </div>
                
            </header>

            <main className="mx-auto max-w-7xl px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Input Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8 input-panel no-print"
                    >
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black tracking-tighter">Your Profile & Target</h2>
                            <p className="text-muted-foreground">Fill in the details below. Our AI will analyze your resume and craft the perfect pitch for your target job.</p>
                        </div>

                        <div className="p-8 rounded-3xl border border-border bg-card shadow-xl shadow-primary/5 space-y-6">
                            {/* Resume Selector */}
                            <div className="space-y-3">
                                <label className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <FileText size={14} className="text-primary" /> Select Resume
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedResumeId}
                                        onChange={(e) => setSelectedResumeId(e.target.value)}
                                        className="w-full h-12 px-4 rounded-xl bg-input dark:bg-slate-900 border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                                    >
                                        {resumes.map((resume) => (
                                            <option key={resume._id} value={resume._id} className="dark:bg-[#0b0c0e]">
                                                {resume.title}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                        <Layout size={16} />
                                    </div>
                                </div>
                            </div>

                            {/* Job Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <Briefcase size={14} className="text-primary" /> Job Title
                                    </label>
                                    <Input
                                        placeholder="e.g. Senior Frontend Engineer"
                                        value={jobTitle}
                                        onChange={(e) => setJobTitle(e.target.value)}
                                        className="h-12 rounded-xl border-border bg-input dark:bg-[#0c0c0e]"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <Building2 size={14} className="text-primary" /> Company
                                    </label>
                                    <Input
                                        placeholder="e.g. Google, Stripe"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        className="h-12 rounded-xl border-border bg-input dark:bg-[#0c0c0e]"
                                    />
                                </div>
                            </div>

                            {/* Job Description */}
                            <div className="space-y-3">
                                <label className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <MessageSquareText size={14} className="text-primary" /> Job Description (Optional)
                                </label>
                                <textarea
                                    placeholder="Paste the job requirements here for a more tailored cover letter..."
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    className="w-full min-h-[160px] p-4 rounded-2xl bg-input dark:bg-[#0c0c0e] border border-border text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-y"
                                />
                            </div>

                            <Button
                                onClick={handleGenerate}
                                disabled={generating || !selectedResumeId}
                                className="w-full h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-lg font-bold shadow-2xl shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] gap-3"
                            >
                                {generating ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} /> Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} className="fill-white" /> Generate Cover Letter
                                    </>
                                )}
                            </Button>
                        </div>
                    </motion.div>

                    {/* Result Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col h-full result-panel"
                    >
                        <div className="mb-8 flex items-center justify-between">
                            <h2 className="text-3xl font-black tracking-tighter">Your Cover Letter</h2>
                            {generatedCoverLetter && (
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={copyToClipboard}
                                        className="rounded-xl h-10 px-4 gap-2 border-border"
                                    >
                                        {copied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                                        {copied ? "Copied" : "Copy"}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.print()}
                                        className="rounded-xl h-10 px-4 gap-2 border-border"
                                    >
                                        <Download size={16} /> Print/PDF
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={downloadTxt}
                                        className="rounded-xl h-10 px-4 gap-2 border-border"
                                    >
                                        <Download size={16} /> Save .txt
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 relative group  overflow-y-auto scroll-smooth">
                            <AnimatePresence mode="wait">
                                {!generatedCoverLetter && !generating ? (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-full min-h-[500px] flex flex-col items-center justify-center p-12 text-center rounded-3xl border-2 border-dashed border-border bg-card/50"
                                    >
                                        <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
                                            <Sparkles size={40} className="text-primary opacity-50" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">Ready to impress?</h3>
                                        <p className="text-muted-foreground text-sm max-w-[280px]">Fill in the details on the left and click generate to see the magic happen.</p>
                                    </motion.div>
                                ) : generating ? (
                                    <motion.div
                                        key="generating"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-full min-h-[500px] flex flex-col items-center justify-center p-12 text-center rounded-3xl border-2 border-dashed border-primary/30 bg-card/50"
                                    >
                                        <div className="relative mb-8">
                                            <div className="absolute inset-0 blur-3xl bg-primary/20 animate-pulse rounded-full" />
                                            <Loader2 size={60} className="text-primary animate-spin relative z-10" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">Crafting your story...</h3>
                                        <p className="text-muted-foreground text-sm max-w-[280px]">Our AI is synthesizing your career achievements with the job requirements.</p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="h-full min-h-[500px] flex flex-col group"
                                    >
                                        <div className="p-4 bg-muted/50 dark:bg-slate-900/50 border-x border-t border-border rounded-t-3xl flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic">Interactive Workspace</span>
                                            <span className="text-[10px] text-muted-foreground font-medium underline cursor-help">Perfectly tailored for success</span>
                                        </div>
                                        <div className="flex-1 bg-card dark:bg-[#0c0c0e] border-x border-border">
                                            <RichTextEditor
                                                content={generatedCoverLetter}
                                                onChange={setGeneratedCoverLetter}
                                                placeholder="Your AI generated cover letter will appear here..."
                                            />
                                        </div>
                                        <div className="p-6 bg-muted/30 dark:bg-slate-900/30 border border-border rounded-b-3xl flex items-center justify-center gap-4 no-print">
                                           <Button
    variant="ghost"
    size="sm"
    onClick={handleGenerate}
    disabled={generating || (credits !== null && credits <= 0)} // ✅ ADD THIS
    className="text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/10 transition-colors gap-2"
>
    <RefreshCw size={14} /> Re-generate with AI
</Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </main>
            <style jsx global>{`
                @media print {
                    header, footer, nav, button, .no-print, .input-panel {
                        display: none !important;
                    }
                    main {
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    .result-panel {
                        width: 100% !important;
                        position: absolute;
                        top: 0;
                        left: 0;
                    }
                    .tiptap {
                        padding: 0 !important;
                        border: none !important;
                        font-size: 12pt;
                        line-height: 1.5;
                        color: black;
                        background: white;
                    }
                }
            `}</style>
        </div>
    );
}

