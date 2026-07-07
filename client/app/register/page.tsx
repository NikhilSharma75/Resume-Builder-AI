"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { ThemeToggle } from "@/components/ThemeToggle";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post("/api/auth/register", { name, email, password });
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data));
            toast.success("Account created successfully!");
            router.push("/dashboard");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-background text-foreground transition-colors duration-300 selection:bg-primary/30">
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-grid-foreground/[0.02]" />
                <div className="absolute -bottom-[20%] -left-[10%] h-[50vw] w-[50vw] rounded-full bg-primary/10 blur-[120px]" />
                <div className="absolute top-[20%] right-[10%] h-[30vw] w-[30vw] rounded-full bg-indigo-500/10 blur-[120px]" />
            </div>

            {/* Theme Toggle Button */}
            <div className="absolute top-8 right-8 z-50">
                <ThemeToggle />
            </div>

            <div className="container relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12">
                <Link href="/" className="absolute top-8 left-8 flex items-center text-muted-foreground hover:text-foreground transition-colors group">
                    <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/80 group-hover:bg-secondary transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                    </div>
                    <span className="font-medium">Back to Home</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-[420px]"
                >
                    <div className="mb-10 text-center">
                        <motion.div 
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-purple-600 shadow-xl shadow-primary/20 ring-4 ring-background"
                        >
                            <span className="text-3xl font-bold text-white">R</span>
                        </motion.div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-4xl">Create an account</h1>
                        <p className="mt-3 text-muted-foreground font-medium">Start building your professional future today</p>
                    </div>

                    <div className="rounded-3xl border border-border bg-card/50 p-8 shadow-2xl backdrop-blur-xl ring-1 ring-border/50">
                        <form className="space-y-6" onSubmit={handleSubmit}>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground/80 ml-1">Full Name</label>
                                    <Input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="John Doe"
                                        className="h-12 border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all rounded-xl"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground/80 ml-1">Email Address</label>
                                    <Input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="h-12 border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all rounded-xl"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground/80 ml-1">Password</label>
                                    <div className="relative group">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="h-12 border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all rounded-xl pr-12"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 h-12 text-base font-bold rounded-xl transition-all active:scale-[0.98]" 
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Create My Account"}
                            </Button>
                        </form>

                        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/login" className="font-bold text-primary hover:text-primary/80 transition-colors">
                                Sign in instead
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
