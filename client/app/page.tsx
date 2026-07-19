// "use client";

// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { ArrowRight, FileText, Sparkles, CheckCircle2, Star, Zap, LayoutTemplate, ShieldCheck, User, CreditCard, Crown, X } from "lucide-react";
// import React from "react";
// import { motion } from "framer-motion";
// import { ThemeToggle } from "@/components/ThemeToggle";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import api from "@/lib/api";

// interface FeedbackType {
//     _id: string;
//     comment: string;
//     rating?: number;
//     user: {
//         name: string;
//         email: string;
//     };
// }


// export default function Home() {
//     const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchFeedback = async () => {
//             try {
//                 const res = await api.get("/api/getallfeedback"); // change base URL if needed
//                 setFeedbacks(res.data.data.slice(0, 5));
//             } catch (error) {
//                 console.error("Error fetching feedback:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchFeedback();
//     }, []);
//     return (
//         <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary selection:text-white transition-colors duration-500">
//             {/* Navbar */}
//             <header className="sticky top-0 z-50 w-full border-b border-border bg-background/50 backdrop-blur-xl">
//                 <div className="container flex h-20 items-center justify-between">
//                     <div className="flex items-center gap-3 text-2xl font-black tracking-tighter">
//                         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-[0_0_20px_rgba(124,58,237,0.5)]">
//                             R
//                         </div>
//                         Resumen
//                     </div>
//                     <div className="flex items-center gap-4">
//                         <ThemeToggle />
//                         <Link href="/login" className="hidden text-base font-medium text-muted-foreground transition-colors hover:text-foreground sm:block">
//                             Log in
//                         </Link>
//                         <Link href="/register">
//                             <Button className="h-10 rounded-full bg-foreground px-6 font-bold text-background hover:bg-foreground/90 transition-colors">
//                                 Get Started
//                             </Button>
//                         </Link>
//                     </div>
//                 </div>
//             </header>

//             <main className="flex-1">
//                 {/* Hero Section */}
//                 <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
//                     {/* Background Effects */}
//                     <div className="absolute inset-0 z-0">
//                         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
//                         <div className="absolute inset-0 bg-grid-white/[0.03]" />
//                         <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[130px]" />
//                         <div className="absolute bottom-0 right-0 h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[150px]" />
//                     </div>

//                     <div className="container relative z-10 flex flex-col items-center text-center">

//                         <motion.h1
//                             initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
//                             animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
//                             transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
//                             className="max-w-6xl text-7xl font-black leading-[0.9] tracking-tighter sm:text-8xl md:text-9xl"
//                         >
//                             Build a resume <br />
//                             <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-gray to-gray-900">
//                                 with A4 precision.
//                             </span>
//                         </motion.h1>

//                         <motion.p
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
//                             className="mt-8 max-w-3xl text-xl text-gray-700 sm:text-2xl font-light leading-relaxed"
//                         >
//                             The most technical resume builder on the web. Create pixel-perfect **Puppeteer-rendered PDFs**, optimize impact with **Advanced AI**, and track your entire pipeline with an integrated **Job Tracker**.
//                         </motion.p>

//                         <motion.div
//                             initial={{ opacity: 0, scale: 0.95 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
//                             className="mt-12 flex flex-col items-center gap-5 sm:flex-row"
//                         >
//                             <Link href="/register" className="w-full sm:w-auto">
//                                 <Button size="lg" className="h-16 w-full rounded-full bg-primary px-10 text-xl font-bold shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-[0_0_50px_rgba(124,58,237,0.6)] sm:min-w-[240px] group relative overflow-hidden">
//                                     <span className="relative z-10">Start Building Now</span>
//                                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
//                                 </Button>
//                             </Link>
//                             <Link href="/login" className="w-full sm:w-auto">
//                                 <button className="h-16 w-full rounded-full border border-gray-500/10 bg-white/5 px-10 text-xl font-bold text-gray-500 backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20 sm:min-w-[240px]">
//                                     Browse Templates
//                                 </button>
//                             </Link>
//                         </motion.div>

//                         {/* Social Proof / Trust */}
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             transition={{ delay: 0.8 }}
//                             className="mt-16 flex items-center gap-2 text-sm text-gray-500"
//                         >
//                             <div className="flex -space-x-2">
//                                 <img src="https://i.pravatar.cc/100?img=1" alt="User" className="h-8 w-8 rounded-full border border-black" />
//                                 <img src="https://i.pravatar.cc/100?img=5" alt="User" className="h-8 w-8 rounded-full border border-black" />
//                                 <img src="https://i.pravatar.cc/100?img=8" alt="User" className="h-8 w-8 rounded-full border border-black" />
//                                 <img src="https://i.pravatar.cc/100?img=9" alt="User" className="h-8 w-8 rounded-full border border-black" />
//                             </div>
//                             <div className="flex gap-1">
//                                 {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} className="fill-yellow-500 text-yellow-500" />)}
//                             </div>
//                             <span>Aced by 10,000+ candidates</span>
//                         </motion.div>
//                     </div>
//                 </section>

//                 {/* 6-Step Visual Blueprint */}
//                 <section className="bg-background py-20 relative overflow-hidden border-t border-border">
//                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 rounded-full blur-[120px] -z-10" />
//                     <div className="container">
//                         <div className="text-center mb-12">
//                             <h2 className="text-3xl font-black tracking-tight sm:text-5xl mb-4 text-foreground">The Career Pipeline</h2>
//                             <p className="text-lg text-muted-foreground max-w-xl mx-auto">From registration to offer letter. Everything you need in one high-speed flow.</p>
//                         </div>

//                         <div className="grid gap-6 md:grid-cols-3">
//                             {[
//                                 {
//                                     step: "01",
//                                     title: "Secure Launchpad",
//                                     desc: "Login in seconds. Your data is synced and ready when you are.",
//                                     icon: <User className="text-primary" />,
//                                     details: ["Cloud Sync", "Secure Auth"]
//                                 },
//                                 {
//                                     step: "02",
//                                     title: "Expert Selection",
//                                     desc: "Recruiter-vetted, ATS-proof templates tuned for A4 precision.",
//                                     icon: <LayoutTemplate className="text-blue-400" />,
//                                     details: ["ATS-Proof", "A4 Ready"]
//                                 },
//                                 {
//                                     step: "03",
//                                     title: "Intelligence Injection",
//                                     desc: "Advanced AI transforms boring bullets into high-impact achievements.",
//                                     icon: <Sparkles className="text-yellow-400" />,
//                                     details: ["AI Impact", "Auto-Rewriting"]
//                                 },
//                                 {
//                                     step: "04",
//                                     title: "Deep Customization",
//                                     desc: "Fine-tune font sizes (10/12/14px) and custom section names.",
//                                     icon: <FileText className="text-emerald-400" />,
//                                     details: ["Full Control", "Custom Props"]
//                                 },
//                                 {
//                                     step: "05",
//                                     title: "ATS Mastery",
//                                     desc: "Check your ATS score and export pixel-perfect Puppeteer PDFs.",
//                                     icon: <ShieldCheck className="text-purple-400" />,
//                                     details: ["Score Guru", "PDF Precision"]
//                                 },
//                                 {
//                                     step: "06",
//                                     title: "Job Pipeline",
//                                     desc: "Track every application in your integrated Kanban board.",
//                                     icon: <Zap className="text-orange-400" />,
//                                     details: ["Kanban Board", "Central Sync"]
//                                 }
//                             ].map((s, i) => (
//                                 <motion.div
//                                     key={s.step}
//                                     initial={{ opacity: 0, scale: 0.95 }}
//                                     whileInView={{ opacity: 1, scale: 1 }}
//                                     viewport={{ once: true }}
//                                     transition={{ duration: 0.5, delay: i * 0.05 }}
//                                     className="p-6 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all group relative overflow-hidden shadow-sm"
//                                 >
//                                     <div className="absolute top-0 right-0 p-4 text-4xl font-black text-foreground/[0.03] group-hover:text-primary transition-colors">
//                                         {s.step}
//                                     </div>
//                                     <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
//                                         {s.icon}
//                                     </div>
//                                     <h3 className="text-xl font-bold mb-2 text-foreground">{s.title}</h3>
//                                     <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.desc}</p>
//                                     <div className="flex flex-wrap gap-2 mt-auto">
//                                         {s.details.map(d => (
//                                             <span key={d} className="px-2 py-0.5 rounded-lg bg-secondary border border-border text-[10px] font-bold text-muted-foreground uppercase">{d}</span>
//                                         ))}
//                                     </div>
//                                 </motion.div>
//                             ))}
//                         </div>
//                         <div className="mt-12 text-center">
//                             <Link href="/register">
//                                 <Button size="lg" className="rounded-full bg-foreground text-background hover:bg-foreground/90 font-bold px-8 transition-colors">
//                                     Start Your 6-Step Journey <ArrowRight size={18} className="ml-2" />
//                                 </Button>
//                             </Link>
//                         </div>
//                     </div>
//                 </section>

//                 {/* Features Section */}
//                 <section className="bg-background py-16">
//                     <div className="container">
//                         <div className="text-center mb-10">
//                             <h2 className="text-2xl font-bold tracking-tight sm:text-4xl mb-3 text-foreground">Engineered Success</h2>
//                             <p className="text-muted-foreground">Tools designed to bypass the bots and impress the humans.</p>
//                         </div>
//                         <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
//                             <FeatureCard
//                                 icon={<Sparkles className="h-8 w-8 text-primary shadow-[0_0_15px_rgba(124,58,237,0.5)]" />}
//                                 title="Advanced AI Content"
//                                 description="Instantly rewrite your job descriptions into high-impact, quantifiable achievements using our proprietary AI engine."
//                                 delay={0}
//                             />
//                             <FeatureCard
//                                 icon={<ShieldCheck className="h-8 w-8 text-emerald-400" />}
//                                 title="ATS-Proof Templates"
//                                 description="Built with clean semantic HTML structure ensuring 100% readability for Application Tracking Systems (ATS)."
//                                 delay={0.1}
//                             />
//                             <FeatureCard
//                                 icon={<FileText className="h-8 w-8 text-yellow-400" />}
//                                 title="A4 Master Layout"
//                                 description="Real-time A4 page-break detection ensures your content always fits perfectly on standard paper sizes."
//                                 delay={0.2}
//                             />
//                             <FeatureCard
//                                 icon={<LayoutTemplate className="h-8 w-8 text-blue-400" />}
//                                 title="Integrated Kanban"
//                                 description="The only resume builder with a built-in CRM for your job hunt. Track applications from 'To Apply' to 'Offer'."
//                                 delay={0.3}
//                             />
//                         </div>
//                     </div>
//                 </section>





//                 {/* Pricing / Pro Benefits */}
//                 <section id="pricing" className="py-16 border-y border-border relative overflow-hidden bg-background transition-colors duration-500">
//                     <div className="absolute inset-0 bg-primary/5 blur-[120px] -z-10" />
//                     <div className="container">
//                         <div className="text-center mb-16">
//                             <h2 className="text-3xl font-bold tracking-tight sm:text-5xl mb-4 text-foreground">Simple, Power Pricing</h2>
//                             <p className="text-muted-foreground">Basic for starting, Pro for winning.</p>
//                         </div>

//                         <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
//                             {/* Free Plan */}
//                             <motion.div
//                                 initial={{ opacity: 0, x: -20 }}
//                                 whileInView={{ opacity: 1, x: 0 }}
//                                 viewport={{ once: true }}
//                                 className="p-8 rounded-[2rem] bg-card border border-border flex flex-col shadow-sm"
//                             >
//                                 <h3 className="text-xl font-bold mb-2 text-foreground">Standard</h3>
//                                 <div className="text-4xl font-black mb-6 text-foreground">$0</div>
//                                 <ul className="space-y-4 mb-8 flex-1">
//                                     <li className="flex items-center gap-2 text-sm text-muted-foreground">
//                                         <CheckCircle2 size={16} className="text-primary" /> 2 Resumes
//                                     </li>
//                                     <li className="flex items-center gap-2 text-sm text-foreground/80">
//                                         <CheckCircle2 size={16} className="text-primary" /> All Templates
//                                     </li>
//                                     <li className="flex items-center gap-2 text-sm text-foreground/80">
//                                         <CheckCircle2 size={16} className="text-primary" /> Job Tracker access
//                                     </li>
//                                     <li className="flex items-center gap-2 text-sm text-muted-foreground/50 line-through">
//                                         AI Bullet Enhancer
//                                     </li>
//                                     <li className="flex items-center gap-2 text-sm text-muted-foreground/50 line-through">
//                                         Unlimited Resumes
//                                     </li>
//                                 </ul>
//                                 <Link href="/dashboard" className="w-full">
//                                     <Button variant="outline" className="w-full h-12 rounded-xl border-border bg-secondary hover:bg-secondary/80 text-foreground transition-colors">
//                                         Get Started
//                                     </Button>
//                                 </Link>
//                             </motion.div>

//                             {/* Pro Plan */}
//                             <motion.div
//                                 initial={{ opacity: 0, x: 20 }}
//                                 whileInView={{ opacity: 1, x: 0 }}
//                                 viewport={{ once: true }}
//                                 className="p-8 rounded-[2rem] bg-gradient-to-b from-primary/20 to-transparent border border-primary/40 flex flex-col relative"
//                             >
//                                 <div className="absolute -top-4 right-8 bg-primary px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20">
//                                     Recommended
//                                 </div>
//                                 <h3 className="text-xl font-bold mb-2 text-foreground dark:text-white">Pro</h3>
//                                 <div className="text-4xl font-black mb-6 text-foreground dark:text-white">$7<span className="text-lg font-medium text-muted-foreground dark:text-white/60">/mo</span></div>
//                                 <ul className="space-y-4 mb-8 flex-1">
//                                     <li className="flex items-center gap-2 text-sm text-foreground dark:text-white font-medium">
//                                         <Zap size={16} className="text-yellow-500 fill-yellow-500" /> Unlimited Resumes
//                                     </li>
//                                     <li className="flex items-center gap-2 text-sm text-foreground/90 dark:text-white/90">
//                                         <CheckCircle2 size={16} className="text-primary dark:text-white" /> AI Bullet Enhancer
//                                     </li>
//                                     <li className="flex items-center gap-2 text-sm text-foreground/90 dark:text-white/90">
//                                         <CheckCircle2 size={16} className="text-primary dark:text-white" /> ATS Scoring Pro
//                                     </li>
//                                     <li className="flex items-center gap-2 text-sm text-foreground/90 dark:text-white/90">
//                                         <CheckCircle2 size={16} className="text-primary dark:text-white" /> Advanced Formatting
//                                     </li>
//                                     <li className="flex items-center gap-2 text-sm text-foreground/90 dark:text-white/90">
//                                         <CheckCircle2 size={16} className="text-primary dark:text-white" /> Priority Support
//                                     </li>
//                                 </ul>
//                                 <Link href="/dashboard" className="w-full">
//                                     <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 transition-all transform hover:scale-105">
//                                         Go Pro Now
//                                     </Button>
//                                 </Link>
//                             </motion.div>
//                         </div>
//                     </div>
//                 </section>

//                 {/* Testimonials */}
//                 <section className="py-16 border-y border-border bg-secondary/20 transition-colors duration-500">
//                     <div className="container">
//                         <h2 className="text-3xl font-bold tracking-tight sm:text-5xl mb-12 text-center text-foreground uppercase tracking-widest">
//                             Loved by users
//                         </h2>

//                         {loading ? (
//                             <p className="text-center text-muted-foreground">Loading feedback...</p>
//                         ) : feedbacks.length === 0 ? (
//                             <p className="text-center text-muted-foreground">No feedback yet</p>
//                         ) : (
//                             <div className="grid gap-8 md:grid-cols-3">
//                                 {feedbacks.map((fb) => (
//                                     <TestimonialCard
//                                         key={fb._id}
//                                         quote={fb.comment}
//                                         author={fb.user?.name || "Anonymous"}
//                                         role={fb.user?.email || ""}
//                                         rating={fb.rating}
//                                     />
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </section>

//             </main>
//             {/* Footer */}
//             <footer className="border-t border-border bg-background py-12 transition-colors duration-500">
//                 <div className="container flex flex-col items-center justify-between gap-6 md:flex-row">
//                     <div className="flex items-center gap-2 text-xl font-black text-foreground">
//                         <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
//                             R
//                         </div>
//                         Resumen
//                     </div>
//                     <p className="text-sm text-muted-foreground">
//                         © 2026 Resumen AI. All rights reserved.
//                     </p>
//                     <div className="flex gap-6 text-sm text-muted-foreground">
//                         <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
//                         <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
//                     </div>
//                 </div>
//             </footer>
//         </div>
//     );
// }
// function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
//     return (
//         <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5, delay }}
//             className="group p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-1"
//         >
//             <div className="mb-6 transform group-hover:scale-110 transition-transform">{icon}</div>
//             <h3 className="text-xl font-bold mb-3 text-foreground">{title}</h3>
//             <p className="text-muted-foreground leading-relaxed">{description}</p>
//         </motion.div>
//     );
// }

// function TestimonialCard({
//     quote,
//     author,
//     role,
//     rating,
// }: {
//     quote: string;
//     author: string;
//     role: string;
//     rating?: number;
// }) {
//     return (
//         <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="p-8 rounded-[2rem] bg-card border border-border shadow-sm"
//         >
//             {/* Rating */}
//             {rating && (
//                 <div className="flex mb-4">
//                     {Array.from({ length: 5 }).map((_, i) => (
//                         <span key={i}>
//                             {i < rating ? "⭐" : "☆"}
//                         </span>
//                     ))}
//                 </div>
//             )};

//             <p className="text-lg text-foreground italic mb-6">"{quote}"</p>

//             <div className="flex items-center gap-4">
//                 <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center font-bold">
//                     {author?.charAt(0)}
//                 </div>

//                 <div>
//                     <div className="font-bold text-foreground">{author}</div>
//                     <div className="text-sm text-muted-foreground">{role}</div>
//                 </div>
//             </div>
//         </motion.div>
//     );
// }


//////
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Sparkles, CheckCircle2, Star, Zap, LayoutTemplate, ShieldCheck, User, CreditCard, Crown, X } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useEffect, useState } from "react";
import axios from "axios";
import api from "@/lib/api";

interface FeedbackType {
    _id: string;
    comment: string;
    rating?: number;
    user: {
        name: string;
        email: string;
    };
}

export default function Home() {
    const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const res = await api.get("/api/getallfeedback");
                setFeedbacks(res.data.data.slice(0, 6)); // Increased to 6 for nicer 3x2 grids
            } catch (error) {
                console.error("Error fetching feedback:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, []);

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary selection:text-white transition-colors duration-500">
            {/* Navbar */}
            <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
                <div className="container flex h-16 md:h-20 items-center justify-between px-4 md:px-6">
                    <Link href="/" className="flex items-center gap-2.5 text-xl md:text-2xl font-black tracking-tighter">
                        <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-xl bg-primary text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]">
                            R
                        </div>
                        Resumen
                    </Link>
                    <div className="flex items-center gap-3 md:gap-4">
                        <ThemeToggle />
                        <Link href="/login" className="hidden text-sm md:text-base font-medium text-muted-foreground transition-colors hover:text-foreground sm:block">
                            Log in
                        </Link>
                        <Link href="/register">
                            <Button className="h-9 md:h-10 rounded-full bg-foreground px-5 md:px-6 font-bold text-background hover:bg-foreground/90 transition-colors text-xs md:text-sm">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
                    {/* Background Effects */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                        <div className="absolute inset-0 bg-grid-white/[0.02]" />
                        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] md:h-[800px] md:w-[800px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[100px] md:blur-[130px]" />
                    </div>

                    <div className="container relative z-10 flex flex-col items-center text-center px-4 md:px-6">

                       

                        <motion.h1
                            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="max-w-4xl text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tighter"
                        >
                            Build a resume <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-purple-600">
                                with A4 precision.
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="mt-6 max-w-2xl text-base md:text-xl text-muted-foreground leading-relaxed"
                        >
                            The most technical resume builder on the web. Create pixel-perfect PDFs, 
                            optimize impact with Advanced AI, and track your entire pipeline with an integrated Job Tracker.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
                        >
                            <Link href="/register" className="w-full sm:w-auto">
                                <Button size="lg" className="h-12 md:h-14 w-full rounded-full bg-primary px-8 md:px-10 text-base md:text-lg font-bold shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-[0_0_50px_rgba(124,58,237,0.5)] sm:min-w-[200px] group relative overflow-hidden">
                                    <span className="relative z-10">Start Building Now</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                </Button>
                            </Link>
                            <Link href="/login" className="w-full sm:w-auto">
                                <Button variant="outline" size="lg" className="h-12 md:h-14 w-full rounded-full border-border bg-background/50 px-8 md:px-10 text-base md:text-lg font-bold backdrop-blur-md transition-all hover:bg-accent sm:min-w-[200px]">
                                    Browse Templates
                                </Button>
                            </Link>
                        </motion.div>

                        {/* Social Proof / Trust */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mt-12 flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground"
                        >
                            <div className="flex -space-x-2">
                                <img src="https://i.pravatar.cc/100?img=1" alt="User" className="h-8 w-8 rounded-full border-2 border-background" />
                                <img src="https://i.pravatar.cc/100?img=5" alt="User" className="h-8 w-8 rounded-full border-2 border-background" />
                                <img src="https://i.pravatar.cc/100?img=8" alt="User" className="h-8 w-8 rounded-full border-2 border-background" />
                                <img src="https://i.pravatar.cc/100?img=9" alt="User" className="h-8 w-8 rounded-full border-2 border-background" />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} className="fill-yellow-500 text-yellow-500" />)}
                                </div>
                                <span className="font-medium text-foreground/80">10,000+</span> candidates aced
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* 6-Step Visual Blueprint */}
                <section className="bg-secondary/30 py-16 md:py-24 relative overflow-hidden border-y border-border">
                    <div className="container px-4 md:px-6">
                        <div className="text-center mb-12 md:mb-16">
                            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-3 text-foreground">The Career Pipeline</h2>
                            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">From registration to offer letter. Everything you need in one high-speed flow.</p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            {[
                                { step: "01", title: "Secure Launchpad", desc: "Login in seconds. Your data is synced and ready when you are.", icon: <User className="text-primary" />, details: ["Cloud Sync", "Secure Auth"] },
                                { step: "02", title: "Expert Selection", desc: "Recruiter-vetted, ATS-proof templates tuned for A4 precision.", icon: <LayoutTemplate className="text-blue-400" />, details: ["ATS-Proof", "A4 Ready"] },
                                { step: "03", title: "Intelligence Injection", desc: "Advanced AI transforms boring bullets into high-impact achievements.", icon: <Sparkles className="text-yellow-400" />, details: ["AI Impact", "Auto-Rewriting"] },
                                { step: "04", title: "Deep Customization", desc: "Fine-tune font sizes (10/12/14px) and custom section names.", icon: <FileText className="text-emerald-400" />, details: ["Full Control", "Custom Props"] },
                                { step: "05", title: "ATS Mastery", desc: "Check your ATS score and export pixel-perfect Puppeteer PDFs.", icon: <ShieldCheck className="text-purple-400" />, details: ["Score Guru", "PDF Precision"] },
                                { step: "06", title: "Job Pipeline", desc: "Track every application in your integrated Kanban board.", icon: <Zap className="text-orange-400" />, details: ["Kanban Board", "Central Sync"] }
                            ].map((s, i) => (
                                <motion.div
                                    key={s.step}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.05 }}
                                    className="p-6 md:p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/40 transition-all group relative overflow-hidden shadow-sm hover:shadow-md"
                                >
                                    <div className="absolute top-0 right-0 p-4 text-5xl md:text-6xl font-black text-foreground/[0.03] group-hover:text-primary/10 transition-colors select-none">
                                        {s.step}
                                    </div>
                                    <div className="h-10 w-10 rounded-xl bg-secondary/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-border/30">
                                        {s.icon}
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold mb-2 text-foreground">{s.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.desc}</p>
                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {s.details.map(d => (
                                            <span key={d} className="px-2.5 py-0.5 rounded-full bg-secondary border border-border text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                                                {d}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        
                        <div className="mt-12 md:mt-16 text-center">
                            <Link href="/register">
                                <Button size="lg" className="h-12 md:h-14 rounded-full bg-foreground text-background hover:bg-foreground/90 font-bold px-8 transition-all hover:scale-105">
                                    Start Your 6-Step Journey <ArrowRight size={18} className="ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="bg-background py-16 md:py-24">
                    <div className="container px-4 md:px-6">
                        <div className="text-center mb-12 md:mb-16">
                            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-3 text-foreground">Engineered for Success</h2>
                            <p className="text-base md:text-lg text-muted-foreground">Tools designed to bypass the bots and impress the humans.</p>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <FeatureCard
                                icon={<Sparkles className="h-6 w-6 md:h-8 md:w-8 text-primary" />}
                                title="Advanced AI Content"
                                description="Instantly rewrite your job descriptions into high-impact, quantifiable achievements using our proprietary AI engine."
                                delay={0}
                            />
                            <FeatureCard
                                icon={<ShieldCheck className="h-6 w-6 md:h-8 md:w-8 text-emerald-400" />}
                                title="ATS-Proof Templates"
                                description="Built with clean semantic HTML structure ensuring 100% readability for Application Tracking Systems (ATS)."
                                delay={0.1}
                            />
                            <FeatureCard
                                icon={<FileText className="h-6 w-6 md:h-8 md:w-8 text-yellow-400" />}
                                title="A4 Master Layout"
                                description="Real-time A4 page-break detection ensures your content always fits perfectly on standard paper sizes."
                                delay={0.2}
                            />
                            <FeatureCard
                                icon={<LayoutTemplate className="h-6 w-6 md:h-8 md:w-8 text-blue-400" />}
                                title="Integrated Kanban"
                                description="The only resume builder with a built-in CRM for your job hunt. Track applications from 'To Apply' to 'Offer'."
                                delay={0.3}
                            />
                        </div>
                    </div>
                </section>

                {/* Pricing / Pro Benefits */}
                <section id="pricing" className="py-16 md:py-24 border-y border-border relative overflow-hidden bg-secondary/10">
                    <div className="container px-4 md:px-6">
                        <div className="text-center mb-12 md:mb-16">
                            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-3 text-foreground">Simple, Powerful Pricing</h2>
                            <p className="text-base md:text-lg text-muted-foreground">Standard for starting, Pro for winning.</p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
                            {/* Free Plan */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="p-8 rounded-3xl bg-card border border-border/50 flex flex-col shadow-sm hover:shadow-md transition-shadow"
                            >
                                <h3 className="text-xl font-bold mb-2 text-foreground">Standard</h3>
                                <div className="text-4xl font-black mb-6 text-foreground">$0</div>
                                <ul className="space-y-4 mb-8 flex-1">
                                    <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <CheckCircle2 size={18} className="text-primary shrink-0" /> 2 Resumes
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <CheckCircle2 size={18} className="text-primary shrink-0" /> All Templates
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <CheckCircle2 size={18} className="text-primary shrink-0" /> Job Tracker access
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-muted-foreground/40 line-through">
                                        <div className="h-4 w-4 rounded-full bg-muted shrink-0" /> AI Bullet Enhancer
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-muted-foreground/40 line-through">
                                        <div className="h-4 w-4 rounded-full bg-muted shrink-0" /> Unlimited Resumes
                                    </li>
                                </ul>
                                <Link href="/dashboard" className="w-full">
                                    <Button variant="outline" className="w-full h-12 rounded-xl border-border bg-secondary/50 hover:bg-secondary/80 text-foreground transition-colors">
                                        Get Started
                                    </Button>
                                </Link>
                            </motion.div>

                            {/* Pro Plan */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="p-8 rounded-3xl bg-gradient-to-b from-primary/10 to-transparent border border-primary/30 flex flex-col relative shadow-[0_0_40px_rgba(124,58,237,0.05)]"
                            >
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20">
                                    Recommended
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-foreground">Pro</h3>
                                <div className="text-4xl font-black mb-6 text-foreground">$7<span className="text-lg font-medium text-muted-foreground">/mo</span></div>
                                <ul className="space-y-4 mb-8 flex-1">
                                    <li className="flex items-center gap-3 text-sm text-foreground font-medium">
                                        <Zap size={18} className="text-yellow-500 fill-yellow-500 shrink-0" /> Unlimited Resumes
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <CheckCircle2 size={18} className="text-primary shrink-0" /> AI Bullet Enhancer
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <CheckCircle2 size={18} className="text-primary shrink-0" /> ATS Scoring Pro
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <CheckCircle2 size={18} className="text-primary shrink-0" /> Advanced Formatting
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <CheckCircle2 size={18} className="text-primary shrink-0" /> Priority Support
                                    </li>
                                </ul>
                                <Link href="/dashboard" className="w-full">
                                    <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/25 transition-all hover:scale-[1.02]">
                                        Go Pro Now
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-16 md:py-24 bg-background">
                    <div className="container px-4 md:px-6">
                        <div className="text-center mb-12 md:mb-16">
                            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-3 text-foreground">
                                Loved by users
                            </h2>
                            <p className="text-base md:text-lg text-muted-foreground">See what our community has to say</p>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-10">
                                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            </div>
                        ) : feedbacks.length === 0 ? (
                            <p className="text-center text-muted-foreground py-10">No feedback yet</p>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {feedbacks.map((fb) => (
                                    <TestimonialCard
                                        key={fb._id}
                                        quote={fb.comment}
                                        author={fb.user?.name || "Anonymous"}
                                        role={fb.user?.email || ""}
                                        rating={fb.rating}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>

            </main>

            {/* Footer */}
            <footer className="border-t border-border bg-background py-12 md:py-16">
                <div className="container px-4 md:px-6 flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div className="flex items-center gap-2.5 text-xl md:text-2xl font-black text-foreground">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                            R
                        </div>
                        Resumen
                    </div>
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Resumen AI. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-muted-foreground">
                        <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// =================== Sub-Components ===================

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="group p-6 md:p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/40 transition-all hover:shadow-lg hover:-translate-y-1"
        >
            <div className="mb-4 md:mb-6 flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl bg-secondary/50 border border-border/30 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-foreground">{title}</h3>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{description}</p>
        </motion.div>
    );
}

function TestimonialCard({
    quote,
    author,
    role,
    rating,
}: {
    quote: string;
    author: string;
    role: string;
    rating?: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 md:p-8 rounded-3xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
        >
            {/* Rating */}
            {rating && (
                <div className="flex mb-4 gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                            key={i} 
                            size={16} 
                            className={i < rating ? "fill-yellow-500 text-yellow-500" : "fill-muted text-muted"} 
                        />
                    ))}
                </div>
            )}

            <p className="text-base text-foreground/90 italic mb-6 flex-1 leading-relaxed">&quot;{quote}&quot;</p>

            <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
                    {author?.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                    <div className="font-bold text-foreground truncate">{author}</div>
                    <div className="text-xs text-muted-foreground truncate">{role}</div>
                </div>
            </div>
        </motion.div>
    );
}