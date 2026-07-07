"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background text-muted-foreground selection:bg-primary/30 selection:text-foreground transition-colors duration-300">
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <Link href="/" className="inline-flex items-center text-sm font-medium mb-8 hover:text-foreground transition-colors group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
                </Link>

                <h1 className="text-4xl font-black text-foreground mb-8 tracking-tighter sm:text-5xl">Terms of Service</h1>

                <div className="space-y-10">
                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
                        <p className="leading-relaxed text-lg">
                            By accessing and using Resumen, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">2. Use License</h2>
                        <p className="leading-relaxed text-lg">
                            Permission is granted to temporarily download one copy of the materials (information or software) on Resumen's website for personal, non-commercial transitory viewing only.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">3. Disclaimer</h2>
                        <p className="leading-relaxed text-lg text-justify text-muted-foreground/90">
                            The materials on Resumen's website are provided on an 'as is' basis. Resumen makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">4. Limitations</h2>
                        <p className="leading-relaxed text-lg">
                            In no event shall Resumen or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Resumen's website.
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
