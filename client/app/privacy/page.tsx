"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background text-muted-foreground selection:bg-primary/30 selection:text-foreground transition-colors duration-300">
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <Link href="/" className="inline-flex items-center text-sm font-medium mb-8 hover:text-foreground transition-colors group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
                </Link>

                <h1 className="text-4xl font-black text-foreground mb-8 tracking-tighter sm:text-5xl">Privacy Policy</h1>

                <div className="space-y-10">
                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
                        <p className="leading-relaxed text-lg">
                            Resumen ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our resume builder service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">2. Information We Collect</h2>
                        <ul className="list-disc pl-5 mt-4 space-y-3 text-lg">
                            <li><strong className="text-foreground">Account Information:</strong> Name, email address, password.</li>
                            <li><strong className="text-foreground">Resume Data:</strong> Work history, education, skills, and other professional details you enter.</li>
                            <li><strong className="text-foreground">Usage Data:</strong> Information about how you interact with our service.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">3. How We Use Your Information</h2>
                        <p className="leading-relaxed text-lg">
                            We use your information strictly to provide and improve our services, including:
                        </p>
                        <ul className="list-disc pl-5 mt-4 space-y-3 text-lg">
                            <li>Generating and managing your resumes.</li>
                            <li>Authenticating your account.</li>
                            <li>Sending necessary service notifications.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">4. Data Security</h2>
                        <p className="leading-relaxed text-lg">
                            We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure.
                        </p>
                    </section>

                    <section className="pt-12 border-t border-border">
                        <p className="text-sm font-medium text-muted-foreground/60 italic">
                            Last updated: December 25, 2025
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
