"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { TechyTemplate } from "@/components/resume-templates/Techy";
import { SimpleTemplate } from "@/components/resume-templates/Simple";
import { ProfessionalTemplate } from "@/components/resume-templates/Professional";
import { CreativeTemplate } from "@/components/resume-templates/Creative"; // Will create this
import { Loader2 } from "lucide-react";

export default function PublicResumePage() {
    const params = useParams();
    const [resume, setResume] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchResume = async () => {
            try {
                // Determine if we need to use a public endpoint or if this page uses the standard API
                // For public view, we generally need a public endpoint that finds by slug
                // We created /api/resumes/public/:slug
                const response = await api.get(`/resumes/public/${params.slug}`);
                setResume(response.data);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (params.slug) {
            fetchResume();
        }
    }, [params.slug]);

    if (loading) return <div className="flex h-screen items-center justify-center bg-white text-black"><Loader2 className="animate-spin" /></div>;
    if (error || !resume) return <div className="flex h-screen items-center justify-center bg-white text-black">Resume not found or private.</div>;

    return (
        <div className="bg-white min-h-screen w-full flex justify-center">
            {/* Print styles are critical here */}
            <style jsx global>{`
                @page {
                    margin: 0;
                    size: auto;
                }
                body {
                    background: white;
                }
                /* Hide scrollbars for PDF */
                ::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

            <div className="w-[210mm] min-h-[297mm] bg-white shadow-none print:shadow-none overflow-hidden">
                {resume.selectedTemplate === 'simple' ? (
                    <SimpleTemplate data={resume.data} />
                ) : resume.selectedTemplate === 'professional' ? (
                    <ProfessionalTemplate data={resume.data} />
                ) : resume.selectedTemplate === 'creative' ? (
                    <CreativeTemplate data={resume.data} />
                ) : (
                    <TechyTemplate data={resume.data} />
                )}
            </div>
        </div>
    );
}
