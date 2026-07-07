"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Lock, CheckCircle2, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { useRouter, useParams } from "next/navigation";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const params = useParams();
    const token = params.token;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        setLoading(true);
        try {
            await api.put(`/api/auth/resetpassword/${token}`, { password });
            setSuccess(true);
            toast.success("Password reset successfully!");
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 transition-colors duration-300">
             {/* Dynamic Background */}
             <div className="fixed inset-0 z-0 pointer-events-none text-muted-foreground/5">
                <div className="absolute inset-0 bg-grid-foreground/[0.02]" />
                <div className="absolute -top-[20%] -left-[10%] h-[50vw] w-[50vw] rounded-full bg-primary/10 blur-[120px]" />
                <div className="absolute bottom-[20%] right-[10%] h-[30vw] w-[30vw] rounded-full bg-purple-500/10 blur-[120px]" />
            </div>

            {/* Theme Toggle Button */}
            <div className="absolute top-8 right-8 z-50">
                <ThemeToggle />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10 space-y-8 rounded-3xl border border-border bg-card/50 p-8 shadow-2xl backdrop-blur-xl ring-1 ring-border/50"
            >
                {!success ? (
                    <>
                        <div className="text-center">
                            <motion.div 
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-purple-600 shadow-xl shadow-primary/20"
                            >
                                <Lock className="h-8 w-8 text-white" />
                            </motion.div>
                            <h1 className="text-3xl font-extrabold tracking-tight">New Password</h1>
                            <p className="mt-3 text-muted-foreground font-medium">Please enter your new password below.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground/80 ml-1">New Password</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-12 border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground/80 ml-1">Confirm Password</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="h-12 border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all rounded-xl"
                                />
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 h-12 text-base font-bold rounded-xl transition-all active:scale-[0.98]"
                                disabled={loading}
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </Button>
                        </form>
                    </>
                ) : (
                    <div className="text-center space-y-6">
                        <motion.div 
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-green-500 shadow-inner"
                        >
                            <CheckCircle2 className="h-10 w-10 animate-in zoom-in" />
                        </motion.div>
                        <h2 className="text-3xl font-extrabold">Password updated</h2>
                        <p className="text-muted-foreground font-medium">Your password has been reset successfully. Redirecting you to login...</p>
                        <Button 
                            className="w-full h-12 rounded-xl font-bold transition-all" 
                            onClick={() => router.push("/login")}
                        >
                            Go to Login <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
