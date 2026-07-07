"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";

import api from "@/lib/api";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/auth/forgotpassword", { email });
            setSubmitted(true);
            toast.success("Reset link sent!");
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

            <Link href="/login" className="absolute top-8 left-8 flex items-center text-muted-foreground hover:text-foreground transition-colors group">
                <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/80 group-hover:bg-secondary transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                </div>
                <span className="font-medium">Back to Login</span>
            </Link>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10 space-y-8 rounded-3xl border border-border bg-card/50 p-8 shadow-2xl backdrop-blur-xl ring-1 ring-border/50"
            >
                {!submitted ? (
                    <>
                        <div className="text-center">
                            <motion.div 
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-purple-600 shadow-xl shadow-primary/20"
                            >
                                <Mail className="h-8 w-8 text-white" />
                            </motion.div>
                            <h1 className="text-3xl font-extrabold tracking-tight">Reset Password</h1>
                            <p className="mt-3 text-muted-foreground font-medium">Enter your email address and we'll send you a link to reset your password.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground/80 ml-1">Email Address</label>
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-12 border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all rounded-xl"
                                />
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 h-12 text-base font-bold rounded-xl transition-all active:scale-[0.98]"
                                disabled={loading}
                            >
                                {loading ? "Sending..." : "Send Reset Link"}
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
                        <h2 className="text-3xl font-extrabold">Check your email</h2>
                        <p className="text-muted-foreground font-medium">If an account exists for <span className="text-foreground font-bold">{email}</span>, we have sent a password reset link.</p>
                        <Button 
                            variant="outline" 
                            className="w-full h-12 rounded-xl font-bold border-2 hover:bg-secondary transition-all" 
                            onClick={() => setSubmitted(false)}
                        >
                            Try another email
                        </Button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
