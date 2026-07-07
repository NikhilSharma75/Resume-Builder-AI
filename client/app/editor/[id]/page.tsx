"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, ArrowLeft, Download, Plus, Trash2, LayoutTemplate, Palette, MoreVertical, Loader2, GripVertical, FileText, Zap } from "lucide-react";
import { User, Briefcase, GraduationCap, Code, FolderGit2, ListOrdered } from "lucide-react";
import { toast } from "sonner";
import { Reorder, motion } from "framer-motion";
import { TechyTemplate } from "@/components/resume-templates/Techy";
import { ProfessionalTemplate } from "@/components/resume-templates/Professional";
import { CreativeTemplate } from "@/components/resume-templates/Creative";
import { SimpleTemplate } from "@/components/resume-templates/Simple";
import { Type, Target, CheckCircle2, XCircle, Moon, Sun } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
    { id: 'personal', label: 'Personal', icon: <User size={18} className="mr-2" /> },
    { id: 'ats', label: 'ATS Score', icon: <Target size={18} className="mr-2" /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase size={18} className="mr-2" /> },
    { id: 'education', label: 'Education', icon: <GraduationCap size={18} className="mr-2" /> },
    { id: 'projects', label: 'Projects', icon: <FolderGit2 size={18} className="mr-2" /> },
    { id: 'skills', label: 'Skills', icon: <Code size={18} className="mr-2" /> },
    { id: 'custom', label: 'Custom Sections', icon: <FileText size={18} className="mr-2" /> },
    { id: 'sections', label: 'Sections', icon: <ListOrdered size={18} className="mr-2" /> },
    { id: 'design', label: 'Design', icon: <Type size={18} className="mr-1.5" /> },
];

export default function EditorPage() {
    const params = useParams();
    const router = useRouter();
    const [resume, setResume] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [activeSection, setActiveSection] = useState("personal");
    const [jobDescription, setJobDescription] = useState("");
    const [atsLoading, setAtsLoading] = useState(false);
    const [atsResult, setAtsResult] = useState<any>(null);
    const [enhancing, setEnhancing] = useState(false);
    const [isImproving, setIsImproving] = useState<Record<string, boolean>>({});
    const [enhancedExperiences, setEnhancedExperiences] = useState<string[]>([]);
    const [showEnhancementPreview, setShowEnhancementPreview] = useState(false);
    const [showSkillWarning, setShowSkillWarning] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [resumesCount, setResumesCount] = useState<number>(0);
    const previewParentRef = useRef<HTMLDivElement>(null);
const [credits, setCredits] = useState<number | null>(null);
    // Dynamic A4 scaling logic
    useEffect(() => {
        if (!previewParentRef.current) return;

        const updateScale = () => {
            if (!previewParentRef.current) return;
            const parentWidth = previewParentRef.current.clientWidth;
            const padding = 64; // p-8 total
            const availableWidth = parentWidth - padding;
            const scale = Math.min(1, availableWidth / 794);
            document.documentElement.style.setProperty('--preview-scale', scale.toString());
        };

        const observer = new ResizeObserver(updateScale);
        observer.observe(previewParentRef.current);
        updateScale();

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (params.id) {
            fetchUserAndCount();
            fetchResume();
        }
    }, [params.id]);

    // const fetchUserAndCount = async () => {
    //     try {
    //         const userResponse = await api.get("/auth/me");
    //         setUser(userResponse.data);

    //         const resumesResponse = await api.get("/resumes");
    //         setResumesCount(resumesResponse.data.length);
    //     } catch (error) {
    //         console.error("Failed to fetch user context");
    //     }
    // };

const fetchUserAndCount = async () => {
    try {
        const userResponse = await api.get("/api/auth/me");
        setUser(userResponse.data);

        // ✅ ADD THIS
        setCredits(userResponse.data.credits);

        const resumesResponse = await api.get("/api/resumes");
        setResumesCount(resumesResponse.data.length);
    } catch (error) {
        console.error("Failed to fetch user context");
    }
};


    const fetchResume = async () => {
        try {
            const response = await api.get(`/api/resumes/${params.id}`);
            setResume(response.data);
        } catch (error) {
            console.error("Failed to fetch resume");
            // toast.error("Failed to load resume");
        } finally {
            setLoading(false);
        }
    };

    // Auto-save effect
    useEffect(() => {
        const isLocked = !user?.isSubscribed && resumesCount >= 2;
        if (!loading && resume && !isLocked) {
            const timer = setTimeout(() => {
                saveResume();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [resume, user, resumesCount]);

    const saveResume = async (isManual = false) => {
        if (!resume) return;
        setSaving(true);
        try {
            await api.put(`/api/resumes/${params.id}`, {
                ...resume,
                isDraft: true 
            });
        } catch (error) {
            console.error("Failed to save resume");
        } finally {
            setSaving(false);
        }
    };

    const updatePersonalData = (field: string, value: string) => {
        setResume((prev: any) => ({
            ...prev,
            data: {
                ...prev.data,
                personalInfo: {
                    ...prev.data?.personalInfo,
                    [field]: value
                }
            }
        }));
    };

    const addExperience = () => {
        setResume((prev: any) => ({
            ...prev,
            data: {
                ...prev.data,
                experience: [...(prev.data?.experience || []), { company: '', position: '', startDate: '', endDate: '', description: '' }]
            }
        }));
    };

    const removeExperience = (index: number) => {
        setResume((prev: any) => {
            const newExp = [...(prev.data?.experience || [])];
            newExp.splice(index, 1);
            return {
                ...prev,
                data: { ...prev.data, experience: newExp }
            };
        });
    };

    const updateExperience = (index: number, field: string, value: string) => {
        setResume((prev: any) => {
            const newExp = [...(prev.data?.experience || [])];
            newExp[index] = { ...newExp[index], [field]: value };
            return {
                ...prev,
                data: { ...prev.data, experience: newExp }
            };
        });
    };

    const addEducation = () => {
        setResume((prev: any) => ({
            ...prev,
            data: {
                ...prev.data,
                education: [...(prev.data?.education || []), { school: '', degree: '', graduationDate: '' }]
            }
        }));
    };

    const removeEducation = (index: number) => {
        setResume((prev: any) => {
            const newEdu = [...(prev.data?.education || [])];
            newEdu.splice(index, 1);
            return {
                ...prev,
                data: { ...prev.data, education: newEdu }
            };
        });
    };

    const updateEducation = (index: number, field: string, value: string) => {
        setResume((prev: any) => {
            const newEdu = [...(prev.data?.education || [])];
            newEdu[index] = { ...newEdu[index], [field]: value };
            return {
                ...prev,
                data: { ...prev.data, education: newEdu }
            };
        });
    };

    const addProject = () => {
        setResume((prev: any) => ({
            ...prev,
            data: {
                ...prev.data,
                projects: [...(prev.data?.projects || []), { title: '', description: '', githubLink: '', deployedLink: '' }]
            }
        }));
    };

    const removeProject = (index: number) => {
        setResume((prev: any) => {
            const newProjects = [...(prev.data?.projects || [])];
            newProjects.splice(index, 1);
            return {
                ...prev,
                data: { ...prev.data, projects: newProjects }
            };
        });
    };

    const updateProject = (index: number, field: string, value: string) => {
        setResume((prev: any) => {
            const newProjects = [...(prev.data?.projects || [])];
            newProjects[index] = { ...newProjects[index], [field]: value };
            return {
                ...prev,
                data: { ...prev.data, projects: newProjects }
            };
        });
    };

    const addSkill = () => {
        setResume((prev: any) => ({
            ...prev,
            data: {
                ...prev.data,
                skills: [...(prev.data?.skills || []), ""]
            }
        }));
    };

    const removeSkill = (index: number) => {
        setResume((prev: any) => {
            const newSkills = [...(prev.data?.skills || [])];
            newSkills.splice(index, 1);
            return {
                ...prev,
                data: { ...prev.data, skills: newSkills }
            };
        });
    };

    const updateSkill = (index: number, value: string) => {
        setResume((prev: any) => {
            const newSkills = [...(prev.data?.skills || [])];
            newSkills[index] = value;
            return {
                ...prev,
                data: { ...prev.data, skills: newSkills }
            };
        });
    };

    const addCustomSection = () => {
        const id = `custom_${Math.random().toString(36).substr(2, 6)}`;
        setResume((prev: any) => ({
            ...prev,
            data: {
                ...prev.data,
                customSections: [...(prev.data?.customSections || []), { id, title: 'New Section', content: '' }],
                sectionsOrder: [...(prev.data?.sectionsOrder || ['summary', 'experience', 'education', 'projects', 'skills']), id]
            }
        }));
    };

    const removeCustomSection = (id: string) => {
        setResume((prev: any) => ({
            ...prev,
            data: {
                ...prev.data,
                customSections: (prev.data?.customSections || []).filter((s: any) => s.id !== id),
                sectionsOrder: (prev.data?.sectionsOrder || []).filter((sid: string) => sid !== id)
            }
        }));
    };

    const updateCustomSection = (id: string, field: string, value: string) => {
        setResume((prev: any) => ({
            ...prev,
            data: {
                ...prev.data,
                customSections: (prev.data?.customSections || []).map((s: any) => s.id === id ? { ...s, [field]: value } : s)
            }
        }));
    };

    const updateDesignSetting = (field: string, value: string) => {
        setResume((prev: any) => ({
            ...prev,
            data: {
                ...prev.data,
                settings: {
                    ...prev.data?.settings,
                    [field]: value
                }
            }
        }));
    };

    const fetchAtsScore = async () => {
        if (!jobDescription.trim()) {
            toast.error("Please enter a job description.");
            return;
        }
        if ((credits ?? 0) <= 0) {
    toast.error("No credits left.");
    return;
}

        setAtsLoading(true);
        setAtsResult(null);

        try {
            const response = await api.post("api/resumes/ats-score", {
                resumeData: resume.data,
                jobDescription
            });
            setAtsResult(response.data);
            if (response.data.score < 70) {
                setShowSkillWarning(true);
            } else {
                setShowSkillWarning(false);
            }
            toast.success("ATS Score calculated successfully!");
        } catch (error: any) {
            console.error("Failed to fetch ATS score:", error);
            toast.error("Failed to calculate ATS score. Please try again later.");
        } finally {
            setAtsLoading(false);
        }
    };

  const handleImproveText = async (
    text: string,
    tone: string,
    fieldId: string,
    onUpdate: (text: string) => void
) => {
    // ✅ 1. Empty check
    if (!text.trim()) {
        toast.error("Please enter some text first.");
        return;
    }

    // ✅ 2. Credits check (separate)
    if ((credits ?? 0) <= 0) {
        toast.error("No credits left. Upgrade to continue.");
        return;
    }

    setIsImproving(prev => ({ ...prev, [fieldId]: true }));

    try {
        const response = await api.post("/ai/improve-text", { text, tone });
        onUpdate(response.data.improvedText);

        toast.success("Text improved successfully!");

        // ✅ refresh credits
        fetchUserAndCount();

    } catch (error: any) {
        if (error.response?.status === 403) {
            toast.error(error.response.data.message || "Upgrade to Pro.");
        } else {
            toast.error("Failed to improve text.");
        }
    } finally {
        setIsImproving(prev => ({ ...prev, [fieldId]: false }));
    }
};

    // const renderAIButtons = (fieldId: string, text: string, onUpdate: (text: string) => void) => (
    //     <div className="flex gap-2 mt-2 justify-end">
    //         <Button size="sm" variant="ghost" onClick={() => handleImproveText(text, 'grammar', fieldId, onUpdate)} disabled={isImproving[fieldId]} className="h-7 px-2 text-[10px] font-bold uppercase tracking-wider border border-border bg-secondary/30 hover:bg-secondary/80">
    //             {isImproving[fieldId] ? <Loader2 size={12} className="animate-spin mr-1" /> : <Zap size={12} className="mr-1 text-primary" />} Grammar
    //         </Button>
    //         <Button size="sm" variant="ghost" onClick={() => handleImproveText(text, 'professional', fieldId, onUpdate)} disabled={isImproving[fieldId]} className="h-7 px-2 text-[10px] font-bold uppercase tracking-wider border border-border bg-secondary/30 hover:bg-secondary/80">
    //             {isImproving[fieldId] ? <Loader2 size={12} className="animate-spin mr-1" /> : <Briefcase size={12} className="mr-1 text-blue-500" />} Professional
    //         </Button>
    //         <Button size="sm" variant="ghost" onClick={() => handleImproveText(text, 'concise', fieldId, onUpdate)} disabled={isImproving[fieldId]} className="h-7 px-2 text-[10px] font-bold uppercase tracking-wider border border-border bg-secondary/30 hover:bg-secondary/80">
    //             {isImproving[fieldId] ? <Loader2 size={12} className="animate-spin mr-1" /> : <Target size={12} className="mr-1 text-amber-500" />} Concise
    //         </Button>
    //     </div>
    // );

const renderAIButtons = (
    fieldId: string,
    text: string,
    onUpdate: (text: string) => void
) => (
    <div className="flex gap-2 mt-2 justify-end">
        <Button
            size="sm"
            variant="ghost"
            onClick={() => handleImproveText(text, 'grammar', fieldId, onUpdate)}
            disabled={isImproving[fieldId] || (credits ?? 0) <= 0}
            className="h-7 px-2 text-[10px] font-bold uppercase tracking-wider border border-border bg-secondary/30 hover:bg-secondary/80"
        >
            {isImproving[fieldId]
                ? <Loader2 size={12} className="animate-spin mr-1" />
                : <Zap size={12} className="mr-1 text-primary" />}
            Grammar
        </Button>

        <Button
            size="sm"
            variant="ghost"
            onClick={() => handleImproveText(text, 'professional', fieldId, onUpdate)}
            disabled={isImproving[fieldId] || (credits ?? 0) <= 0}
            className="h-7 px-2 text-[10px] font-bold uppercase tracking-wider border border-border bg-secondary/30 hover:bg-secondary/80"
        >
            {isImproving[fieldId]
                ? <Loader2 size={12} className="animate-spin mr-1" />
                : <Briefcase size={12} className="mr-1 text-blue-500" />}
            Professional
        </Button>

        <Button
            size="sm"
            variant="ghost"
            onClick={() => handleImproveText(text, 'concise', fieldId, onUpdate)}
            disabled={isImproving[fieldId] || (credits ?? 0) <= 0}
            className="h-7 px-2 text-[10px] font-bold uppercase tracking-wider border border-border bg-secondary/30 hover:bg-secondary/80"
        >
            {isImproving[fieldId]
                ? <Loader2 size={12} className="animate-spin mr-1" />
                : <Target size={12} className="mr-1 text-amber-500" />}
            Concise
        </Button>
    </div>
);


    const enhanceExperience = async () => {
        if ((credits ?? 0) <= 0) {
    toast.error("No credits left.");
    return;
}
        if (!jobDescription.trim() || !resume) return;

        if (!user?.isSubscribed && resumesCount >= 2) {
            toast.error("Upgrade to Pro to use AI enhancements.");
            return;
        }

        setEnhancing(true);
        try {
            const response = await api.post("/resumes/enhance-experience", {
                resumeData: resume.data,
                jobDescription
            });
            setEnhancedExperiences(response.data.enhancedExperiences);
            setShowEnhancementPreview(true);
            toast.success("Experience descriptions enhanced!");
        } catch (error: any) {
            console.error("Failed to enhance experience:", error);
            toast.error("Failed to enhance experience. Please try again.");
        } finally {
            setEnhancing(false);
        }
    };

    const applyEnhancements = () => {
        if (!enhancedExperiences.length || !resume) return;

        setResume((prev: any) => ({
            ...prev,
            data: {
                ...prev.data,
                experience: prev.data.experience.map((exp: any, i: number) => ({
                    ...exp,
                    description: enhancedExperiences[i] || exp.description
                }))
            }
        }));

        setShowEnhancementPreview(false);
        setAtsResult(null); // Clear score as it needs re-evaluation
        toast.success("Applied AI enhancements to your resume!");
    };

    const handleExport = async () => {
        setExporting(true);
        try {
            // First save to ensure latest version and mark as not draft (optional but good for tracking)
            await api.put(`/resumes/${params.id}`, { ...resume, isDraft: false });

            // Call PDF generation API
            const response = await api.get(`/resumes/${params.id}/pdf`, {
                responseType: 'blob'
            });

            // Create a blob URL and trigger download
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${resume.title || 'resume'}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success("PDF generated successfully!");
        } catch (error: any) {
            console.error("Export failed", error);
            toast.error("Failed to generate PDF. Please try again.");
        } finally {
            setExporting(false);
        }
    };

    const updateTemplate = (templateId: string) => {
        setResume((prev: any) => ({
            ...prev,
            selectedTemplate: templateId
        }));
    };

    // ...

    if (loading || !resume) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    <p className="mt-2 text-sm text-muted-foreground">Loading your resume...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col bg-background text-foreground transition-colors duration-500">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-border bg-background/50 backdrop-blur-md px-6 py-3">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <input
                        type="text"
                        value={resume.title}
                        onChange={(e) => setResume({ ...resume, title: e.target.value })}
                        className="border-none bg-transparent text-lg font-semibold focus:outline-none focus:ring-0 w-64 text-foreground"
                        placeholder="Resume Title"
                    />
                </div>
                <div className="flex items-center gap-3">
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
                    <button
                        onClick={() => setActiveSection('ats')}
                        className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${activeSection === 'ats'
                            ? 'bg-amber-500 text-black border-none shadow-lg shadow-amber-500/30 font-black'
                            : 'border-amber-500/30 bg-amber-500/5 text-amber-500 hover:bg-amber-500/10 hover:border-amber-500/50 font-bold'
                            } text-[10px] uppercase tracking-wider`}
                    >
                        <Target size={14} />
                        ATS Score
                    </button>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-secondary rounded-full border border-border">
                        <div className={`w-2 h-2 rounded-full ${saving ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                        <span className="text-[10px] font-medium text-muted-foreground">
                            {saving ? "Saving Draft..." : "Draft Saved"}
                        </span>
                    </div>
                    <ThemeToggle />
                      
                    <Button variant="outline" size="sm" onClick={handleExport} disabled={exporting} className="bg-primary text-primary-foreground hover:bg-primary/90 border-none px-6 rounded-full font-bold">
                        {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download size={16} className="mr-2" />}
                        {exporting ? "Generating..." : "Download PDF"}
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* Locked Overlay */}
                {!loading && !user?.isSubscribed && resumesCount >= 2 && (
                    <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-md p-8 rounded-[2rem] bg-card border border-border shadow-2xl"
                        >
                            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary">
                                <Zap size={32} />
                            </div>
                            <h2 className="text-2xl font-bold mb-4 text-foreground">Editing is Locked</h2>
                            <p className="text-muted-foreground mb-8 leading-relaxed">
                                You have reached the limit of 2 free resumes. Upgrade to Pro to continue editing your resumes and access advanced AI features.
                            </p>
                            <div className="flex flex-col gap-3">
                                <Button
                                    onClick={async () => {
                                        try {
                                            const response = await api.post("/subscriptions/checkout");
                                            if (response.data.url) window.location.href = response.data.url;
                                        } catch (error) {
                                            toast.error("Failed to start checkout");
                                        }
                                    }}
                                    className="h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl"
                                >
                                    Upgrade to Pro
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => router.push('/dashboard')}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    Back to Dashboard
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Editor Sidebar */}
                <div className="w-1/2 overflow-y-auto border-r border-border bg-card p-8">
                    <div className="mb-6 flex space-x-2 border-b border-border pb-2 overflow-x-auto">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`flex items-center px-4 py-2 text-sm font-medium rounded-full capitalize whitespace-nowrap transition-all ${activeSection === item.id
                                        ? (item.id === 'ats' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-primary text-white shadow-lg shadow-primary/20')
                                        : (item.id === 'ats' ? 'text-amber-500/80 hover:text-amber-400 hover:bg-amber-500/5 border border-amber-500/20' : 'text-muted-foreground hover:text-foreground hover:bg-secondary')
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {activeSection === 'personal' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <h3 className="text-xl font-bold text-foreground">Personal Information</h3>
                            <Input
                                label="Full Name"
                                value={resume.data?.personalInfo?.fullName || ''}
                                onChange={(e) => updatePersonalData('fullName', e.target.value)}
                            />
                            <Input
                                label="Job Title"
                                value={resume.data?.personalInfo?.jobTitle || ''}
                                onChange={(e) => updatePersonalData('jobTitle', e.target.value)}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Email"
                                    value={resume.data?.personalInfo?.email || ''}
                                    onChange={(e) => updatePersonalData('email', e.target.value)}
                                />
                                <Input
                                    label="Phone"
                                    value={resume.data?.personalInfo?.phone || ''}
                                    onChange={(e) => updatePersonalData('phone', e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="GitHub Link (Optional)"
                                    value={resume.data?.personalInfo?.github || ''}
                                    onChange={(e) => updatePersonalData('github', e.target.value)}
                                    placeholder="https://github.com/username"
                                />
                                <Input
                                    label="LinkedIn Link (Optional)"
                                    value={resume.data?.personalInfo?.linkedin || ''}
                                    onChange={(e) => updatePersonalData('linkedin', e.target.value)}
                                    placeholder="https://linkedin.com/in/username"
                                />
                            </div>
                            {resume?.selectedTemplate === 'modern' && (
                                <div className="flex items-center gap-6 p-6 rounded-2xl bg-secondary/20 border border-border/50">
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-2xl bg-secondary flex items-center justify-center overflow-hidden border-2 border-dashed border-border group-hover:border-primary transition-all">
                                            {resume.data?.personalInfo?.photo ? (
                                                <img src={resume.data.personalInfo.photo} className="w-full h-full object-cover" alt="Profile" />
                                            ) : (
                                                <div className="flex flex-col items-center text-muted-foreground">
                                                    <Target size={24} className="mb-1" />
                                                    <span className="text-[10px] font-bold uppercase">No Photo</span>
                                                </div>
                                            )}
                                        </div>
                                        <input 
                                            type="file" 
                                            id="photo-upload" 
                                            className="hidden" 
                                            accept="image/*" 
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        updatePersonalData('photo', reader.result as string);
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                        <label 
                                            htmlFor="photo-upload" 
                                            className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-xl shadow-lg cursor-pointer hover:scale-110 transition-transform active:scale-95"
                                        >
                                            <Plus size={16} />
                                        </label>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-foreground">Profile Picture</h4>
                                        <p className="text-xs text-muted-foreground mt-1 mb-3">Add a photo to make your resume more personal.</p>
                                        <div className="flex flex-col gap-2">
                                            <Input
                                                label="Or enter Image URL"
                                                value={resume.data?.personalInfo?.photo?.startsWith('data:image') ? '' : (resume.data?.personalInfo?.photo || '')}
                                                onChange={(e) => updatePersonalData('photo', e.target.value)}
                                                placeholder="https://example.com/photo.jpg"
                                                className="h-10 text-xs"
                                            />
                                            {resume.data?.personalInfo?.photo && (
                                                <button 
                                                    onClick={() => updatePersonalData('photo', '')}
                                                    className="self-start text-[10px] font-bold uppercase text-red-500 hover:text-red-600 transition-colors"
                                                >
                                                    Remove Photo
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-1 gap-4">
                                <Input
                                    label="Location"
                                    value={resume.data?.personalInfo?.location || ''}
                                    onChange={(e) => updatePersonalData('location', e.target.value)}
                                    placeholder="City, Country"
                                />
                            </div>
                            <div className="w-full">
                                <label className="mb-2 block text-sm font-semibold text-muted-foreground">
                                    Summary
                                </label>
                                <textarea
                                    className="flex min-h-[120px] w-full rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    value={resume.data?.personalInfo?.summary || ''}
                                    onChange={(e) => updatePersonalData('summary', e.target.value)}
                                    placeholder="Briefly describe your professional background and key achievements..."
                                />
                                {renderAIButtons('summary', resume.data?.personalInfo?.summary || '', (newText) => updatePersonalData('summary', newText))}
                            </div>
                        </div>
                    )}

                    {activeSection === 'experience' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-foreground">Work Experience</h3>
                                <Button size="sm" onClick={addExperience} variant="outline"><Plus size={16} className="mr-1" /> Add</Button>
                            </div>

                            {resume.data?.experience?.map((exp: any, index: number) => (
                                <div key={index} className="rounded-2xl border border-border p-6 bg-secondary/20 relative group transition-all hover:bg-secondary/30">
                                    <button onClick={() => removeExperience(index)} className="absolute top-2 right-2 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 size={16} />
                                    </button>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <Input
                                            label="Company"
                                            value={exp.company}
                                            onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                        />
                                        <Input
                                            label="Position"
                                            value={exp.position}
                                            onChange={(e) => updateExperience(index, 'position', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <Input
                                            label="Start Date"
                                            value={exp.startDate}
                                            placeholder="e.g. Jan 2020"
                                            onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                                        />
                                        <Input
                                            label="End Date"
                                            value={exp.endDate}
                                            placeholder="e.g. Present"
                                            onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label className="mb-2 block text-sm font-semibold text-foreground">
                                            Description
                                        </label>
                                        <textarea
                                            className="flex min-h-[120px] w-full rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            value={exp.description}
                                            onChange={(e) => updateExperience(index, 'description', e.target.value)}
                                            placeholder="Describe your role, responsibilities and key achievements..."
                                        />
                                        {renderAIButtons(`exp_${index}`, exp.description || '', (newText) => updateExperience(index, 'description', newText))}
                                    </div>
                                </div>
                            ))}

                            {(!resume.data?.experience || resume.data.experience.length === 0) && (
                                <div className="text-center py-8 text-muted-foreground">
                                    No experience added yet.
                                </div>
                            )}
                        </div>
                    )}

                    {activeSection === 'education' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-foreground">Education</h3>
                                <Button size="sm" onClick={addEducation} variant="outline"><Plus size={16} className="mr-1" /> Add</Button>
                            </div>

                             {resume.data?.education?.map((edu: any, index: number) => (
                                <div key={index} className="rounded-2xl border border-border p-6 bg-secondary/20 relative group transition-all hover:bg-secondary/30">
                                    <button onClick={() => removeEducation(index)} className="absolute top-2 right-2 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 size={16} />
                                    </button>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <Input
                                            label="School / University"
                                            value={edu.school}
                                            onChange={(e) => updateEducation(index, 'school', e.target.value)}
                                        />
                                        <Input
                                            label="Degree"
                                            value={edu.degree}
                                            onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                        />
                                    </div>
                                    <Input
                                        label="Graduation Date"
                                        value={edu.graduationDate}
                                        placeholder="e.g. May 2018"
                                        onChange={(e) => updateEducation(index, 'graduationDate', e.target.value)}
                                    />
                                </div>
                            ))}
                            {(!resume.data?.education || resume.data.education.length === 0) && (
                                <div className="text-center py-8 text-muted-foreground">
                                    No education added yet.
                                </div>
                            )}
                        </div>
                    )}

                    {activeSection === 'projects' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-foreground">Projects</h3>
                                <Button size="sm" onClick={addProject} variant="outline"><Plus size={16} className="mr-1" /> Add Project</Button>
                            </div>

                            {resume.data?.projects?.map((proj: any, index: number) => (
                                <div key={index} className="rounded-2xl border border-border p-6 bg-secondary/20 relative group transition-all hover:bg-secondary/30">
                                    <button onClick={() => removeProject(index)} className="absolute top-2 right-2 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 size={16} />
                                    </button>
                                    <div className="space-y-4">
                                        <Input
                                            label="Project Title"
                                            value={proj.title}
                                            onChange={(e) => updateProject(index, 'title', e.target.value)}
                                            placeholder="e.g. E-commerce Platform"
                                        />
                                         <div className="w-full">
                                            <label className="mb-2 block text-sm font-semibold text-foreground">
                                                Description
                                            </label>
                                            <textarea
                                                className="flex min-h-[80px] w-full rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                                value={proj.description}
                                                onChange={(e) => updateProject(index, 'description', e.target.value)}
                                                placeholder="Describe your project, technologies used, and your role..."
                                            />
                                            {renderAIButtons(`proj_${index}`, proj.description || '', (newText) => updateProject(index, 'description', newText))}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                label="GitHub Link (Optional)"
                                                value={proj.githubLink}
                                                onChange={(e) => updateProject(index, 'githubLink', e.target.value)}
                                                placeholder="https://github.com/..."
                                            />
                                            <Input
                                                label="Deployed Link (Optional)"
                                                value={proj.deployedLink}
                                                onChange={(e) => updateProject(index, 'deployedLink', e.target.value)}
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!resume.data?.projects || resume.data.projects.length === 0) && (
                                <div className="text-center py-8 text-muted-foreground">
                                    No projects added yet.
                                </div>
                            )}
                        </div>
                    )}

                    {activeSection === 'skills' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-foreground">Skills</h3>
                                <Button size="sm" onClick={addSkill} variant="outline"><Plus size={16} className="mr-1" /> Add</Button>
                            </div>

                            <div className="grid gap-4">
                                {resume.data?.skills?.map((skill: string, index: number) => (
                                    <div key={index} className="flex gap-2 items-center">
                                        <Input
                                            value={skill}
                                            onChange={(e) => updateSkill(index, e.target.value)}
                                            placeholder="e.g. Project Management"
                                        />
                                        <Button variant="ghost" size="icon" onClick={() => removeSkill(index)} className="text-muted-foreground hover:text-red-500">
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            {(!resume.data?.skills || resume.data.skills.length === 0) && (
                                <div className="text-center py-8 text-muted-foreground">
                                    No skills added yet.
                                </div>
                            )}
                        </div>
                    )}

                    {activeSection === 'custom' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-foreground">Custom Sections</h3>
                                <Button size="sm" onClick={addCustomSection} variant="outline"><Plus size={16} className="mr-1" /> Add Section</Button>
                            </div>

                             <div className="space-y-4">
                                {(resume.data?.customSections || []).map((section: any) => (
                                    <div key={section.id} className="rounded-2xl border border-border p-6 bg-secondary/20 relative group transition-all hover:bg-secondary/30">
                                        <button onClick={() => removeCustomSection(section.id)} className="absolute top-2 right-2 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="space-y-4">
                                            <Input
                                                label="Section Title"
                                                value={section.title}
                                                placeholder="e.g. Certifications, Languages, Awards"
                                                onChange={(e) => updateCustomSection(section.id, 'title', e.target.value)}
                                            />
                                             <div className="w-full">
                                                <label className="mb-2 block text-sm font-semibold text-foreground">
                                                    Content
                                                </label>
                                                <textarea
                                                    className="flex min-h-[120px] w-full rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                                    value={section.content}
                                                    onChange={(e) => updateCustomSection(section.id, 'content', e.target.value)}
                                                    placeholder="Type or paste your section content here..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {(!resume.data?.customSections || resume.data.customSections.length === 0) && (
                                    <div className="text-center py-12 border border-dashed border-border rounded-2xl bg-secondary/10">
                                        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground">Add custom sections to highlight your achievements or additional information.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeSection === 'sections' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="flex flex-col gap-2">
                                <h3 className="text-xl font-bold text-foreground">Section Order</h3>
                                <p className="text-sm text-muted-foreground">Drag and drop to reorder sections in your resume.</p>
                            </div>

                            <Reorder.Group
                                axis="y"
                                values={resume.data?.sectionsOrder || ['summary', 'experience', 'education', 'projects', 'skills']}
                                onReorder={(newOrder) => {
                                    setResume((prev: any) => ({
                                        ...prev,
                                        data: {
                                            ...prev.data,
                                            sectionsOrder: newOrder
                                        }
                                    }));
                                }}
                                className="space-y-3"
                            >
                                {(resume.data?.sectionsOrder || ['summary', 'experience', 'education', 'projects', 'skills']).map((section: string) => (
                                    <Reorder.Item
                                        key={section}
                                        value={section}
                                        className="flex items-center justify-between p-4 bg-secondary/20 border border-border rounded-xl cursor-grab active:cursor-grabbing hover:bg-secondary/30 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <GripVertical size={18} className="text-muted-foreground" />
                                            <span className="capitalize font-medium text-foreground">
                                                {section === 'summary' ? 'About Me / Summary' :
                                                    section.startsWith('custom_') ? (resume.data?.customSections || []).find((s: any) => s.id === section)?.title || 'Custom Section' :
                                                        section}
                                            </span>
                                        </div>
                                        <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/60">Drag to move</div>
                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>
                        </div>
                    )}

                    {activeSection === 'design' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <h3 className="text-xl font-bold text-foreground mb-6">Typography Settings</h3>

                            <div className="space-y-4 rounded-2xl border border-border p-6 bg-secondary/20">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground block">Font Family</label>
                                    <select
                                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none cursor-pointer"
                                        value={resume.data?.settings?.fontFamily || 'times'}
                                        onChange={(e) => updateDesignSetting('fontFamily', e.target.value)}
                                    >
                                        <option value="times">Times New Roman</option>
                                        <option value="arial">Arial</option>
                                        <option value="calibri">Calibri</option>
                                        <option value="georgia">Georgia</option>
                                        <option value="garamond">Garamond</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground block pt-4 border-t border-border">Text Size</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[{ key: 'small', label: 'Small (12px)' }, { key: 'medium', label: 'Medium (14px)' }, { key: 'large', label: 'Large (16px)' }].map((size) => (
                                            <button
                                                key={size.key}
                                                onClick={() => updateDesignSetting('fontSize', size.key)}
                                                className={`px-4 py-3 text-sm font-medium rounded-xl border transition-all ${(resume.data?.settings?.fontSize || 'medium') === size.key
                                                        ? 'bg-primary/20 border-primary text-primary'
                                                        : 'border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary'
                                                    }`}
                                            >
                                                {size.label}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2 italic">Base body text size. Headings and labels scale proportionally.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'ats' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <h3 className="text-xl font-bold text-foreground mb-2">ATS Score Checker</h3>
                            <p className="text-sm text-muted-foreground mb-6">Paste the job description below to see how well your resume matches the role.</p>

                            <div className="w-full">
                                <label className="mb-2 block text-sm font-semibold text-foreground">
                                    Job Description / Profile
                                </label>
                                <textarea
                                    className="flex min-h-[200px] w-full rounded-xl border border-border bg-secondary/30 px-4 py-3 text-base leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Paste the full job description here..."
                                />
                            </div>

                           <Button
    onClick={fetchAtsScore}
    disabled={atsLoading || !jobDescription.trim() || (credits ?? 0) <= 0}
    className="w-full py-6 text-base font-bold bg-primary hover:bg-primary/90 text-white"
>
                                {atsLoading ? (
                                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing Resume...</>
                                ) : (
                                    <><Target className="mr-2 h-5 w-5" /> Check ATS Score</>
                                )}
                            </Button>

                            {atsResult && (
                                <div className="mt-10 space-y-8 animate-in slide-in-from-bottom-6 duration-700 pb-20">
                                    <div className="rounded-2xl border border-border bg-secondary/20 p-8 flex flex-col items-center justify-center text-center shadow-2xl">
                                        <div className="relative mb-6 flex items-center justify-center w-40 h-40 rounded-full border-8 border-secondary">
                                            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                                <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="8" fill="none" className="text-secondary translate-x-1 translate-y-1" />
                                                <circle
                                                    cx="80" cy="80" r="72"
                                                    stroke="currentColor"
                                                    strokeWidth="8"
                                                    fill="none"
                                                    strokeDasharray="452.3"
                                                    strokeDashoffset={452.3 - (452.3 * atsResult.score) / 100}
                                                    className={`translate-x-1 translate-y-1 transition-all duration-1000 ease-out ${atsResult.score >= 80 ? 'text-emerald-500' :
                                                            atsResult.score >= 60 ? 'text-amber-500' : 'text-red-500'
                                                        }`}
                                                />
                                            </svg>
                                            <span className="text-5xl font-black text-foreground">{atsResult.score}</span>
                                        </div>
                                        <h4 className="text-2xl font-bold text-foreground">Overall ATS Score</h4>
                                        <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-[250px] mx-auto">
                                            {atsResult.score >= 80 ? "Great match! This resume aligns well with the job description." :
                                                atsResult.score >= 60 ? "Good start, but some improvements are needed to match the role better." :
                                                    "Needs work. This resume is missing key requirements from the job description."}
                                        </p>
                                    </div>

                                    {atsResult.matchingKeywords && atsResult.matchingKeywords.length > 0 && (
                                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8">
                                            <h4 className="text-lg font-bold text-emerald-400 mb-5 flex items-center gap-2">
                                                <CheckCircle2 className="h-5 w-5" /> Matching Keywords
                                            </h4>
                                            <div className="flex flex-wrap gap-3">
                                                {atsResult.matchingKeywords.map((kw: string, i: number) => (
                                                    <span key={i} className="px-4 py-1.5 bg-emerald-500/10 text-emerald-300 rounded-lg text-xs font-semibold border border-emerald-500/20 shadow-sm">
                                                        {kw}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {atsResult.missingKeywords && atsResult.missingKeywords.length > 0 && (
                                        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8">
                                            <h4 className="text-lg font-bold text-red-400 mb-5 flex items-center gap-2">
                                                <XCircle className="h-5 w-5" /> Missing Keywords
                                            </h4>
                                            <div className="flex flex-wrap gap-3">
                                                {atsResult.missingKeywords.map((kw: string, i: number) => (
                                                    <span key={i} className="px-4 py-1.5 bg-red-500/10 text-red-300 rounded-lg text-xs font-semibold border border-red-500/20 shadow-sm">
                                                        {kw}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {showSkillWarning && atsResult.score < 70 && (
                                        <div className="rounded-2xl border-2 border-amber-500/50 bg-amber-500/10 p-6 shadow-2xl animate-in zoom-in duration-300 relative overflow-hidden backdrop-blur-sm">
                                            <button
                                                onClick={() => setShowSkillWarning(false)}
                                                className="absolute top-4 right-4 text-amber-500 hover:text-amber-400 transition-colors"
                                            >
                                                <MoreVertical size={16} className="rotate-90" />
                                            </button>

                                            <div className="flex items-start gap-4">
                                                <div className="bg-amber-500 text-black p-2 rounded-lg shrink-0">
                                                    <Target size={20} />
                                                </div>
                                                <div className="space-y-2">
                                                    <h4 className="text-lg font-bold text-amber-500">How to increase your score?</h4>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                                        If you lack certain skills mentioned in the job description, the best way to increase your score is to <span className="text-amber-500 font-bold underline">learn those skills</span> and then add them to your resume.
                                                    </p>
                                                    <div className="pt-2 border-t border-amber-500/20">
                                                        <p className="text-[11px] text-amber-500/80 italic font-medium">
                                                            Important: We don't suggest adding skills you don't actually have. Honesty is key for long-term career success.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {atsResult.suggestions && (
                                        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-8 relative overflow-hidden group">
                                            <div className="flex flex-col gap-4">
                                                <div>
                                                    <h4 className="text-lg font-bold text-blue-400 mb-3">AI Suggestions</h4>
                                                    <p className="text-sm text-foreground/80 leading-relaxed font-medium">{atsResult.suggestions}</p>
                                                </div>

                                                <div className="pt-4 border-t border-blue-500/10 flex flex-col items-center">
                                                    <p className="text-xs text-blue-400/60 mb-3 italic">Want to instantly optimize your experience descriptions for this role?</p>
                                                    <Button
                                                        onClick={enhanceExperience}
                                                        disabled={enhancing}
                                                        className="animate-blink bg-amber-500 hover:bg-amber-600 text-black font-bold h-12 px-8 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all hover:scale-105"
                                                    >
                                                        {enhancing ? (
                                                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enhancing...</>
                                                        ) : (
                                                            <><Palette className="mr-2 h-4 w-4" /> AI Enhancer</>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {showEnhancementPreview && (
                                         <div className="rounded-2xl border-2 border-amber-500/30 bg-card p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
                                            <div className="flex items-center justify-between mb-6">
                                                <h4 className="text-xl font-bold text-amber-500 flex items-center gap-2">
                                                    <Palette className="h-5 w-5" /> Preview Enhancements
                                                </h4>
                                                <div className="flex gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => setShowEnhancementPreview(false)} className="text-muted-foreground hover:text-foreground">Cancel</Button>
                                                    <Button size="sm" onClick={applyEnhancements} className="bg-amber-500 hover:bg-amber-600 text-black font-bold">Apply to Resume</Button>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                {resume.data.experience.map((exp: any, i: number) => (
                                                    <div key={i} className="space-y-3 pb-6 border-b border-border last:border-0 last:pb-0">
                                                        <div className="flex justify-between items-baseline">
                                                            <h5 className="text-sm font-bold text-foreground">{exp.position} at {exp.company}</h5>
                                                        </div>
                                                        <div className="grid grid-cols-1 gap-4">
                                                            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-xs">
                                                                <span className="block text-[10px] uppercase tracking-wider text-red-500/60 font-black mb-2">Original</span>
                                                                <p className="text-muted-foreground line-through opacity-50">{exp.description}</p>
                                                            </div>
                                                            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs ring-2 ring-emerald-500/10">
                                                                <span className="block text-[10px] uppercase tracking-wider text-emerald-400 font-black mb-2 italic">AI Enhanced</span>
                                                                <p className="text-foreground text-sm leading-relaxed">{enhancedExperiences[i] || exp.description}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-8 flex justify-center">
                                                <Button
                                                    onClick={applyEnhancements}
                                                    className="w-full py-6 bg-amber-500 hover:bg-amber-600 text-black font-black text-lg shadow-xl"
                                                >
                                                    INTEGRATE INTO RESUME
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                </div>

                {/* Info Panel (Preview) */}
                <div ref={previewParentRef} className="w-1/2 flex flex-col items-center justify-start overflow-y-auto bg-secondary/30 p-8 custom-scrollbar relative">
                    {/* Perspective Wrapper to handle A4 Scaling */}
                    <div className="w-full flex justify-center py-8">
                        <div
                            className="bg-white shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-sm animate-in fade-in zoom-in duration-500 origin-top"
                            style={{
                                width: '794px',
                                minHeight: '1123px',
                                // Calculate scale based on parent width (50% of screen minus padding)
                                transform: 'scale(var(--preview-scale, 1))',
                                transformOrigin: 'top center',
                                marginBottom: 'calc(1123px * (var(--preview-scale, 1) - 1))'
                            }}
                        >
                            {/* Final Template Render */}
                            {resume?.selectedTemplate === 'professional' ? (
                                <ProfessionalTemplate data={resume.data} />
                            ) : resume?.selectedTemplate === 'creative' ? (
                                <CreativeTemplate data={resume.data} />
                            ) : resume?.selectedTemplate === 'simple' ? (
                                <SimpleTemplate data={resume.data} />
                            ) : (
                                <TechyTemplate data={resume.data} />
                            )}
                        </div>
                    </div>

                    {/* CSS to handle the scale variable dynamically without JS observers if possible, 
                        but for true carbon copy, we'll use a small script in useEffect */}
                    <style jsx global>{`
                        :root {
                            --preview-scale: 0.75;
                        }
                        @media (max-width: 1400px) { :root { --preview-scale: 0.6; } }
                        @media (max-width: 1200px) { :root { --preview-scale: 0.5; } }
                        @media (max-width: 1000px) { :root { --preview-scale: 0.4; } }
                    `}</style>

                    <div className="sticky bottom-0 w-full max-w-md bg-background/80 backdrop-blur-md border border-border p-4 rounded-xl shadow-2xl">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-foreground">
                            <Palette size={16} /> Select Template
                        </h4>
                        <div className="grid grid-cols-4 gap-2">
                            {['modern', 'professional', 'creative', 'simple'].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => updateTemplate(t)}
                                    className={`px-2 py-2 text-[10px] font-bold uppercase rounded-md border-2 transition-all ${resume?.selectedTemplate === t ? 'border-primary bg-primary/20 text-primary' : 'border-transparent bg-secondary text-muted-foreground hover:border-border'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
