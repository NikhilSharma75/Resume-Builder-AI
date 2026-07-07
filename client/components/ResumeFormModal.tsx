"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Palette, LayoutTemplate } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ResumeFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    creating: boolean;
}

const templates = [
    {
        id: 'modern',
        name: 'Modern',
        description: 'Clean and minimalist design for tech professionals.',
    },
    {
        id: 'professional',
        name: 'Professional',
        description: 'Traditional layout suitable for corporate roles.',
    },
    {
        id: 'creative',
        name: 'Creative',
        description: 'Bold colors and unique layout for designers.',
    },
    {
        id: 'simple',
        name: 'Simple',
        description: 'Basic text-focused layout, great for ATS.',
    }
];

export default function ResumeFormModal({ isOpen, onClose, onSubmit, creating }: ResumeFormModalProps) {
    const [formData, setFormData] = useState({
        title: "My Resume",
        selectedTemplate: "modern"
    });

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
                        <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 text-foreground">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <LayoutTemplate size={22} />
                            </div>
                            Create New Resume
                        </h2>
                        <p className="text-sm text-muted-foreground mt-2 font-medium">Provide a title and choose a template to get started.</p>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Resume Title</label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Software Engineer Resume"
                                className="bg-secondary/50 border-border h-12 rounded-xl text-foreground focus-visible:ring-primary/30"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Palette size={12} className="text-primary" /> Select a Template
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                {templates.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setFormData({ ...formData, selectedTemplate: t.id })}
                                        className={`p-5 rounded-2xl border-2 text-left transition-all ${formData.selectedTemplate === t.id
                                            ? 'border-primary bg-primary/5 text-primary scale-[1.02] shadow-sm'
                                            : 'border-border bg-secondary/30 text-muted-foreground hover:border-primary/30 hover:bg-secondary/50'}`}
                                    >
                                        <div className={`font-black text-xs uppercase tracking-wider mb-2 ${formData.selectedTemplate === t.id ? 'text-primary' : 'text-foreground'}`}>{t.name}</div>
                                        <div className="text-[10px] line-clamp-2 opacity-70 leading-relaxed font-medium">{t.description}</div>
                                    </button>
                                ))}
                            </div>
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
                            disabled={creating || !formData.title.trim()}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white px-10 rounded-xl h-12 font-black shadow-xl shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {creating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : "Start Building"}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
