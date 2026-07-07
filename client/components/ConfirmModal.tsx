import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    loading?: boolean;
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, loading }: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-md overflow-hidden rounded-2xl bg-card border border-border p-6 shadow-2xl"
                >
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>

                    <h2 className="text-2xl font-black mb-2 text-foreground">{title}</h2>
                    <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                        {message}
                    </p>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-4">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="px-5 py-2.5 rounded-xl font-semibold text-muted-foreground hover:bg-accent hover:text-foreground transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all active:scale-[0.98] disabled:opacity-50 min-w-[100px]"
                        >
                            {loading && <Loader2 className="animate-spin" size={16} />}
                            Confirm
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
