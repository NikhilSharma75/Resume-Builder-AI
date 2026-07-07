"use client";

import Link from "next/link";
import { ArrowLeft, Book, Search, FileText, Settings, HelpCircle } from "lucide-react";

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <header className="sticky top-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="container flex h-20 items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-xl font-bold">
                        <ArrowLeft size={20} />
                        Back to Resumen
                    </Link>
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search documentation..."
                            className="h-10 w-64 rounded-full border border-white/10 bg-white/5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>
            </header>

            <main className="container py-16 max-w-5xl">
                <h1 className="text-4xl font-bold mb-4">Documentation</h1>
                <p className="text-xl text-gray-400 mb-12">Learn how to build the perfect resume with Resumen.</p>

                <div className="grid gap-8 md:grid-cols-2">
                    <DocCard
                        icon={<Book className="h-6 w-6 text-primary" />}
                        title="Getting Started"
                        description="Learn the basics of creating your account and setting up your profile."
                        links={["Creating an Account", "Dashboard Overview", "Choosing a Template"]}
                    />
                    <DocCard
                        icon={<FileText className="h-6 w-6 text-blue-400" />}
                        title="Resume Editor"
                        description="Master the editor to craft professional resumes."
                        links={["Adding Sections", "Using AI Assistant", "Customizing Layouts", "Exporting options"]}
                    />
                    <DocCard
                        icon={<Settings className="h-6 w-6 text-purple-400" />}
                        title="Account Management"
                        description="Manage your subscription and profile settings."
                        links={["Billing & Subscriptions", "Password Reset", "Data Privacy"]}
                    />
                    <DocCard
                        icon={<HelpCircle className="h-6 w-6 text-green-400" />}
                        title="Troubleshooting"
                        description="Solutions to common issues."
                        links={["PDF Export Issues", "Login Problems", "Payment Failures"]}
                    />
                </div>

                <div className="mt-16 border-t border-white/10 pt-16">
                    <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <h3 className="font-bold text-white mb-2">Is Resumen free?</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">We offer a free plan that includes basic templates and watermarked downloads. Upgrading to Pro unlocks all features.</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-white mb-2">How do I cancel my subscription?</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">Go to Account Settings &gt; Billing and click "Cancel Subscription". You will retain access until the end of the billing cycle.</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-white mb-2">Are the resumes ATS-friendly?</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">Yes, all our templates are designed to be parsed correctly by Applicant Tracking Systems (ATS).</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function DocCard({ icon, title, description, links }: any) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-white/20 transition-colors">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    {icon}
                </div>
                <h2 className="text-xl font-bold">{title}</h2>
            </div>
            <p className="text-gray-400 mb-6">{description}</p>
            <ul className="space-y-2">
                {links.map((link: string, i: number) => (
                    <li key={i}>
                        <Link href="#" className="text-primary hover:text-primary/80 text-sm flex items-center gap-1">
                            {link}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}
