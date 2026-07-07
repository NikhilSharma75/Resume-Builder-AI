"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Briefcase, Building2, Link as LinkIcon, FileText, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Resume {
    _id: string;
    title: string;
}

interface JobFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    loading: boolean;
    resumes: Resume[];
    initialData?: any;
}

const statuses = [
    { id: 'to-apply', name: 'To Apply' },
    { id: 'applied', name: 'Applied' },
    { id: 'interviewing', name: 'Interviewing' },
    { id: 'offered', name: 'Offered' },
    { id: 'rejected', name: 'Rejected' },
];

export default function JobFormModal({ isOpen, onClose, onSubmit, loading, resumes, initialData }: JobFormModalProps) {
    const [formData, setFormData] = useState({
        companyName: "",
        position: "",
        resume: "",
        status: "to-apply",
        notes: ""
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                companyName: initialData.companyName || "",
                position: initialData.position || "",
                resume: initialData.resume?._id || initialData.resume || "",
                status: initialData.status || "to-apply",
                notes: initialData.notes || ""
            });
        } else {
            setFormData({
                companyName: "",
                position: "",
                resume: resumes[0]?._id || "",
                status: "to-apply",
                notes: ""
            });
        }
    }, [initialData, resumes]);

    const handleSubmit = () => {
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-2xl"
                >
                    {/* Header */}
                    <div className="relative border-b border-border/50 p-8">
                        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
                        <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <Briefcase size={22} />
                            </div>
                            {initialData ? 'Update Job' : 'Add New Job'}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-2 font-medium">Track your application and link it to a resume version.</p>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Building2 size={12} className="text-primary" /> Company Name
                                </label>
                                <Input
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    placeholder="e.g. Google"
                                    className="bg-secondary/50 border-border h-12 rounded-xl text-sm focus-visible:ring-primary/30"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Briefcase size={12} className="text-primary" /> Position
                                </label>
                                <Input
                                    value={formData.position}
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                    placeholder="e.g. Frontend Engineer"
                                    className="bg-secondary/50 border-border h-12 rounded-xl text-sm focus-visible:ring-primary/30"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <FileText size={12} className="text-primary" /> Select Resume Version
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.resume}
                                    onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                                    className="w-full h-12 bg-secondary/50 border border-border rounded-xl px-4 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground font-medium"
                                >
                                    <option value="" disabled className="bg-card">Select a resume...</option>
                                    {resumes.map((r) => (
                                        <option key={r._id} value={r._id} className="bg-card">
                                            {r.title}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Application Status</label>
                            <div className="flex flex-wrap gap-2">
                                {statuses.map((s) => (
                                    <button
                                        key={s.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, status: s.id as any })}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                            formData.status === s.id
                                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105'
                                                : 'bg-secondary/50 border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
                                        }`}
                                    >
                                        {s.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Notes (Optional)</label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Add keywords, interviewer names, or next steps..."
                                className="w-full min-h-[100px] bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground resize-none"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-border/50 p-8 flex justify-end gap-4 bg-secondary/10">
                        <Button
                            onClick={onClose}
                            variant="ghost"
                            className="rounded-xl hover:bg-secondary h-12 px-6 font-bold"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading || !formData.companyName.trim() || !formData.position.trim() || !formData.resume}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white px-10 rounded-xl h-12 font-black shadow-xl shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {initialData ? 'Updating...' : 'Adding...'}</> : (initialData ? 'Update Job' : 'Add to Tracker')}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
