"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import api from "@/lib/api";
import { ThemeToggle } from "@/components/ThemeToggle";
const handleProCheckout = async () => {
    try {
        const res = await api.post("/subscriptions/create-checkout-session");

        if (res.data.url) {
            window.location.href = res.data.url;
        }
    } catch (error) {
        console.error("Checkout error:", error);
    }
};
export default function PricingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
            {/* Navbar */}
            <header className="sticky top-0 z-50 w-full border-b border-border bg-background/50 backdrop-blur-xl">
                <div className="container flex h-20 items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 text-2xl font-black">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                            R
                        </div>
                        Resumen
                    </Link>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Link href="/dashboard">
                            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Back to Dashboard</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container py-24">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">Simple, transparent pricing</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Choose the plan that fits your career stage. No hidden fees, cancel anytime.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
                    <PricingCard
                        title="Free"
                        description="Perfect for getting started with your first resume."
                        price="0"
                        features={["2 Resumes", "Basic Templates", "PDF Export", "Job Tracker Access"]}
                        onSelect={() => console.log("Selected Free")}
                    />
                    <PricingCard
                        title="Pro"
                        description="Unlock advanced features for a professional edge."
                        price="7"
                        features={["Unlimited Resumes", "Premium Templates", "No Watermark", "AI Achievement Enhancer", "Advanced ATS Insights", "Priority Support"]}
                        highlighted
                        onSelect={handleProCheckout}
                    />
                </div>

                <div className="mt-24 text-center">
                    <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                    <div className="grid gap-6 max-w-3xl mx-auto text-left mt-8">
                        <FAQItem question="Can I cancel my subscription?" answer="Yes, you can cancel at any time. You'll keep access until the end of your billing period." />
                        <FAQItem question="Is there a money-back guarantee?" answer="We offer a 7-day money-back guarantee if you're not satisfied with our Pro features." />
                        <FAQItem question="How does the AI assistant work?" answer="Our AI analyzes your job titles and suggests bullet points used by successful candidates in top companies." />
                    </div>
                </div>
            </main>
        </div>
    );
}

function PricingCard({ title, price, features, description, highlighted, onSelect }: any) {
    return (
        <div className={`p-8 rounded-3xl border transition-all ${highlighted ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10' : 'border-border bg-card'}`}>
            <h3 className="text-xl font-bold mb-2 text-foreground">{title}</h3>
            <p className="text-muted-foreground text-sm mb-6">{description}</p>
            <div className="text-4xl font-black mb-8 text-foreground">
                ${price}<span className="text-lg font-medium text-muted-foreground">/mo</span>
            </div>
            <ul className="space-y-4 mb-10">
                {features.map((f: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                        <CheckCircle2 size={18} className="text-primary shrink-0" />
                        {f}
                    </li>
                ))}
            </ul>
            <Button
                onClick={onSelect}
                className={`w-full h-14 rounded-2xl font-bold transition-all ${highlighted ? 'bg-primary text-white hover:bg-primary/90' : 'bg-secondary text-foreground hover:bg-secondary/80'}`}
            >
                {highlighted ? 'Go Professional' : 'Get Started'}
            </Button>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    return (
        <div className="border-b border-border pb-6">
            <h3 className="text-lg font-medium text-foreground mb-2">{question}</h3>
            <p className="text-muted-foreground leading-relaxed">{answer}</p>
        </div>
    );
}
