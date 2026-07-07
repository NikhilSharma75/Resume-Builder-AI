import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink } from 'lucide-react';

export const ProfessionalTemplate = ({ data }: { data: any }) => {
    const { personalInfo, experience, education, projects, skills } = data;

    const getFontFamily = (family: string) => {
        switch (family) {
            case 'arial': return 'Arial, Helvetica, sans-serif';
            case 'calibri': return 'Calibri, "Segoe UI", sans-serif';
            case 'georgia': return 'Georgia, serif';
            case 'garamond': return '"EB Garamond", Garamond, serif';
            case 'times': return '"Times New Roman", Times, serif';
            default: return 'Arial, Helvetica, sans-serif';
        }
    };

    const getScale = (size: string) => {
        switch (size) {
            case 'small': return 0.857;
            case 'large': return 1.143;
            case 'medium':
            default: return 1;
        }
    };

    const s = getScale(data.settings?.fontSize);

    return (
        <div
            className="w-full min-h-full bg-white text-slate-800 flex selection:bg-slate-200"
            style={{ fontFamily: getFontFamily(data.settings?.fontFamily) }}
        >
            {/* Sidebar (32%) */}
            <div style={{ width: '32%', background: '#1a252f', color: '#fff', padding: '30px 24px', display: 'flex', flexDirection: 'column', gap: '24px', flexShrink: 0 }}>
                <div style={{ marginBottom: '10px' }}>
                    <h1 style={{ fontSize: `${Math.round(22 * s)}px`, fontWeight: 800, textTransform: 'uppercase', borderBottom: '2px solid #eff4fcff', paddingBottom: '12px', lineHeight: 1.1, letterSpacing: '0.05em' }}>
                        {personalInfo?.fullName || "Your Name"}
                    </h1>
                    <p style={{ color: '#e5ecf3ff', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: `${Math.round(9 * s)}px`, marginTop: '8px' }}>
                        {personalInfo?.jobTitle || "Professional Title"}
                    </p>
                </div>

                {/* Contact */}
                <div>
                    <h3 style={{ fontSize: `${Math.round(10 * s)}px`, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94a3b8', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>Contact</h3>
                    <div style={{ fontSize: `${Math.round(10 * s)}px`, color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {personalInfo?.email && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', wordBreak: 'break-all' }}><Mail size={12} style={{ color: '#0d0d0eff', flexShrink: 0 }} />{personalInfo.email}</div>}
                        {personalInfo?.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={12} style={{ color: '#0e0e0fff', flexShrink: 0 }} />{personalInfo.phone}</div>}
                        {personalInfo?.location && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={12} style={{ color: '#0b0b0cff', flexShrink: 0 }} />{personalInfo.location}</div>}
                        {personalInfo?.github && <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', wordBreak: 'break-all' }}><Github size={12} style={{ color: '#0b0b0cff', flexShrink: 0 }} />{personalInfo.github.replace('https://', '')}</a>}
                        {personalInfo?.linkedin && <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', wordBreak: 'break-all' }}><Linkedin size={12} style={{ color: '#0b0b0cff', flexShrink: 0 }} />{personalInfo.linkedin.replace('https://', '')}</a>}
                    </div>
                </div>

                {/* Skills */}
                {skills?.length > 0 && (
                    <div>
                        <h3 style={{ fontSize: `${Math.round(10 * s)}px`, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94a3b8', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>Expertise</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {skills.map((skill: string, i: number) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.08)', padding: '4px 10px', borderRadius: '4px', fontSize: `${Math.round(9 * s)}px`, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#fff' }}>
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content (68%) */}
            <div style={{ flex: 1, padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: `${Math.round(20 * s)}px` }}>
                {(data.sectionsOrder || ['summary', 'experience', 'education', 'projects', 'skills']).map((section: string) => {
                    switch (section) {
                        case 'summary':
                            return personalInfo?.summary && (
                                <section key="summary">
                                    <h2 style={{ fontSize: `${Math.round(11 * s)}px`, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                        Profile Summary <span style={{ flex: 1, height: '2px', background: '#f1f5f9' }}></span>
                                    </h2>
                                    <p style={{ fontSize: `${Math.round(10.5 * s)}px`, lineHeight: 1.6, color: '#334155', textAlign: 'justify' }}>{personalInfo.summary}</p>
                                </section>
                            );
                        case 'education':
                            return education?.length > 0 && (
                                <section key="education">
                                    <h2 style={{ fontSize: `${Math.round(11 * s)}px`, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                        Education <span style={{ flex: 1, height: '2px', background: '#f1f5f9' }}></span>
                                    </h2>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {education.map((edu: any, i: number) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                <div>
                                                    <div style={{ fontWeight: 800, fontSize: `${Math.round(12 * s)}px`, textTransform: 'uppercase', color: '#0f172a' }}>{edu.school}</div>
                                                    <div style={{ fontSize: `${Math.round(10.5 * s)}px`, color: '#475569', fontWeight: 600, fontStyle: 'italic', marginTop: '2px' }}>{edu.degree}</div>
                                                </div>
                                                <div style={{ fontSize: `${Math.round(10 * s)}px`, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0, marginLeft: '12px' }}>{edu.graduationDate}</div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            );
                        case 'experience':
                            return experience?.length > 0 && (
                                <section key="experience">
                                    <h2 style={{ fontSize: `${Math.round(11 * s)}px`, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                        Work Experience <span style={{ flex: 1, height: '2px', background: '#f1f5f9' }}></span>
                                    </h2>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                        {experience.map((exp: any, i: number) => (
                                            <div key={i} style={{ pageBreakInside: 'avoid' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                                                    <h3 style={{ fontWeight: 800, fontSize: `${Math.round(14 * s)}px`, color: '#0f172a', lineHeight: 1.2 }}>{exp.position}</h3>
                                                    <span style={{ fontSize: `${Math.round(10 * s)}px`, fontWeight: 800, color: '#0a0a0aff', textTransform: 'uppercase', letterSpacing: '0.1em', flexShrink: 0, marginLeft: '12px', background: '#eff6ff', padding: '2px 8px', borderRadius: '4px' }}>{exp.startDate} — {exp.endDate}</span>
                                                </div>
                                                <div style={{ fontWeight: 700, color: '#64748b', fontSize: `${Math.round(10 * s)}px`, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{exp.company} </div>
                                                <p style={{ fontSize: `${Math.round(10.5 * s)}px`, color: '#334155', whiteSpace: 'pre-wrap', lineHeight: 1.6, textAlign: 'justify' }}>{exp.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            );
                        case 'projects':
                            return projects?.length > 0 && (
                                <section key="projects">
                                    <h2 style={{ fontSize: `${Math.round(11 * s)}px`, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                        Key Projects <span style={{ flex: 1, height: '2px', background: '#f1f5f9' }}></span>
                                    </h2>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {projects.map((proj: any, i: number) => (
                                            <div key={i} style={{ borderLeft: '3px solid #070707ff', paddingLeft: '14px', pageBreakInside: 'avoid', background: '#f8fafc', padding: '12px 14px', borderRadius: '0 8px 8px 0' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                                    <h4 style={{ fontWeight: 800, fontSize: `${Math.round(12.5 * s)}px`, color: '#0f172a' }}>{proj.title}</h4>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        {proj.githubLink && <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" style={{ color: '#080808ff' }}><Github size={14} /></a>}
                                                        {proj.deployedLink && <a href={proj.deployedLink} target="_blank" rel="noopener noreferrer" style={{ color: '#080808ff' }}><ExternalLink size={14} /></a>}
                                                    </div>
                                                </div>
                                                <p style={{ fontSize: `${Math.round(10 * s)}px`, color: '#475569', lineHeight: 1.5 }}>{proj.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            );
                        default:
                            const customSec = (data.customSections || []).find((s: any) => s.id === section);
                            if (customSec) {
                                return (
                                    <section key={customSec.id} style={{ pageBreakInside: 'avoid' }}>
                                        <h2 style={{ fontSize: `${Math.round(10 * s)}px`, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                            {customSec.title} <span style={{ flex: 1, height: '1px', background: '#f1f5f9' }}></span>
                                        </h2>
                                        <p style={{ fontSize: `${Math.round(10 * s)}px`, lineHeight: 1.5, color: '#475569', whiteSpace: 'pre-wrap', textAlign: 'justify' }}>{customSec.content}</p>
                                    </section>
                                );
                            }
                            return null;
                    }
                })}
            </div>
        </div>
    );
};
