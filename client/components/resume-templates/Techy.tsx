import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink } from 'lucide-react';

export const TechyTemplate = ({ data }: { data: any }) => {
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
            className="w-full min-h-full bg-white text-slate-800"
            style={{
                fontFamily: getFontFamily(data.settings?.fontFamily),
                padding: '24px 36px',
            }}
        >
            {/* Header */}
            <header style={{ marginBottom: `${Math.round(14 * s)}px`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: `${Math.round(32 * s)}px`, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.05em', lineHeight: 1, color: '#0f172a' }}>
                        {personalInfo?.fullName || "Your Name"}
                    </h1>
                    <p style={{ fontSize: `${Math.round(12 * s)}px`, color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '4px' }}>
                        {personalInfo?.jobTitle || "Professional Title"}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${Math.round(10 * s)}px`, fontSize: `${Math.round(10 * s)}px`, fontWeight: 700, color: '#64748b', marginTop: '8px' }}>
                        {personalInfo?.email && <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={Math.round(10 * s)} className="text-blue-500" />{personalInfo.email}</div>}
                        {personalInfo?.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={Math.round(10 * s)} className="text-blue-500" />{personalInfo.phone}</div>}
                        {personalInfo?.location && <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={Math.round(10 * s)} className="text-blue-500" />{personalInfo.location}</div>}
                        {personalInfo?.github && <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b' }}><Github size={Math.round(10 * s)} className="text-blue-500" />{personalInfo.github.replace('https://', '')}</a>}
                        {personalInfo?.linkedin && <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b' }}><Linkedin size={Math.round(10 * s)} className="text-blue-500" />{personalInfo.linkedin.replace('https://', '')}</a>}
                    </div>
                </div>
                {personalInfo?.photo && (
                    <div style={{ marginLeft: '20px', flexShrink: 0 }}>
                        <div style={{
                            width: `${Math.round(110 * s)}px`,
                            height: `${Math.round(110 * s)}px`,
                            borderRadius: '50%',
                            border: '4px solid #f1f5f9',
                            overflow: 'hidden',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                            background: '#f8fafc'
                        }}>
                            <img
                                src={personalInfo.photo}
                                alt={personalInfo.fullName}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                )}
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: `${Math.round(14 * s)}px` }}>
                {(data.sectionsOrder || ['summary', 'experience', 'education', 'projects', 'skills']).map((section: string) => {
                    switch (section) {
                        case 'summary':
                            return personalInfo?.summary && (
                                <section key="summary">
                                    <h2 style={{ fontSize: `${Math.round(10 * s)}px`, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#2563eb', borderBottom: '2px solid #f1f5f9', paddingBottom: '3px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '7px' }}>
                                        <span style={{ width: '7px', height: '7px', background: '#2563eb', display: 'block' }}></span>Profile
                                    </h2>
                                    <p style={{ fontSize: `${Math.round(10 * s)}px`, lineHeight: 1.5, color: '#475569', fontWeight: 500 }}>{personalInfo.summary}</p>
                                </section>
                            );
                        case 'education':
                            return education?.length > 0 && (
                                <section key="education">
                                    <h2 style={{ fontSize: `${Math.round(10 * s)}px`, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#2563eb', borderBottom: '2px solid #f1f5f9', paddingBottom: '3px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '7px' }}>
                                        <span style={{ width: '7px', height: '7px', background: '#2563eb', display: 'block' }}></span>Education
                                    </h2>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                        {education.map((edu: any, i: number) => (
                                            <div key={i} style={{ borderLeft: '2px solid #2563eb40', paddingLeft: '8px' }}>
                                                <div style={{ fontWeight: 700, fontSize: `${Math.round(11 * s)}px`, textTransform: 'uppercase', color: '#0f172a' }}>{edu.school}</div>
                                                <div style={{ fontSize: `${Math.round(10 * s)}px`, color: '#64748b', fontWeight: 700, fontStyle: 'italic', marginTop: '1px' }}>{edu.degree}</div>
                                                <div style={{ fontSize: `${Math.round(9 * s)}px`, color: '#94a3b8', fontWeight: 900, marginTop: '1px' }}>{edu.graduationDate}</div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            );
                        case 'skills':
                            return skills?.length > 0 && (
                                <section key="skills">
                                    <h2 style={{ fontSize: `${Math.round(10 * s)}px`, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#2563eb', borderBottom: '2px solid #f1f5f9', paddingBottom: '3px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '7px' }}>
                                        <span style={{ width: '7px', height: '7px', background: '#2563eb', display: 'block' }}></span>Technical Expertise
                                    </h2>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                        {skills.map((skill: string, i: number) => (
                                            <span key={i} style={{ background: '#f1f5f9', color: '#1e293b', padding: '3px 9px', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: `${Math.round(9 * s)}px`, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{skill}</span>
                                        ))}
                                    </div>
                                </section>
                            );
                        case 'experience':
                            return experience?.length > 0 && (
                                <section key="experience">
                                    <h2 style={{ fontSize: `${Math.round(10 * s)}px`, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#2563eb', borderBottom: '2px solid #f1f5f9', paddingBottom: '3px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '7px' }}>
                                        <span style={{ width: '7px', height: '7px', background: '#2563eb', display: 'block' }}></span>Experience
                                    </h2>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: `${Math.round(12 * s)}px` }}>
                                        {experience.map((exp: any, i: number) => (
                                            <div key={i} style={{ borderLeft: '2px solid #2563eb', paddingLeft: '10px', pageBreakInside: 'avoid' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                                    <span style={{ fontWeight: 700, fontSize: `${Math.round(13 * s)}px`, color: '#0f172a' }}>{exp.position}</span>
                                                    <span style={{ fontSize: `${Math.round(9 * s)}px`, fontWeight: 900, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{exp.startDate} — {exp.endDate}</span>
                                                </div>
                                                <div style={{ fontWeight: 700, color: '#475569', fontSize: `${Math.round(10 * s)}px`, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '1px', marginBottom: '4px' }}>{exp.company} </div>
                                                <p style={{ fontSize: `${Math.round(10 * s)}px`, lineHeight: 1.5, color: '#475569', fontWeight: 500, whiteSpace: 'pre-wrap' }}>{exp.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            );
                        case 'projects':
                            return projects?.length > 0 && (
                                <section key="projects">
                                    <h2 style={{ fontSize: `${Math.round(10 * s)}px`, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#2563eb', borderBottom: '2px solid #f1f5f9', paddingBottom: '3px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '7px' }}>
                                        <span style={{ width: '7px', height: '7px', background: '#2563eb', display: 'block' }}></span>Key Projects
                                    </h2>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {projects.map((proj: any, i: number) => (
                                            <div key={i} style={{ background: '#f8fafc', padding: '12px', borderRadius: '7px', border: '1.5px solid #e2e8f0', pageBreakInside: 'avoid', transition: 'all 0.2s' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '5px' }}>
                                                    <span style={{ fontWeight: 800, fontSize: `${Math.round(11 * s)}px`, color: '#0f172a', textTransform: 'uppercase' }}>{proj.title}</span>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        {(proj.githubLink || proj.deployedLink) && (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fff', padding: '2px 8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                                                                {proj.githubLink && (
                                                                    <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#2563eb', fontSize: '9px', fontWeight: 700, textDecoration: 'none' }}>
                                                                        <Github size={Math.round(10 * s)} /> SOURCE
                                                                    </a>
                                                                )}
                                                                {proj.githubLink && proj.deployedLink && <span style={{ color: '#e2e8f0', width: '1px', height: '8px', background: '#e2e8f0' }}></span>}
                                                                {proj.deployedLink && (
                                                                    <a href={proj.deployedLink} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#2563eb', fontSize: '9px', fontWeight: 700, textDecoration: 'none' }}>
                                                                        <ExternalLink size={Math.round(10 * s)} /> LIVE DEMO
                                                                    </a>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <p style={{ fontSize: `${Math.round(10 * s)}px`, color: '#475569', lineHeight: 1.5, fontWeight: 500 }}>{proj.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            );
                        default:
                            const customSec = (data.customSections || []).find((s: any) => s.id === section);
                            if (customSec) {
                                return (
                                    <section key={customSec.id}>
                                        <h2 style={{ fontSize: `${Math.round(10 * s)}px`, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#2563eb', borderBottom: '2px solid #f1f5f9', paddingBottom: '3px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span style={{ width: '6px', height: '6px', background: '#2563eb', display: 'block' }}></span>{customSec.title}
                                        </h2>
                                        <p style={{ fontSize: `${Math.round(10 * s)}px`, lineHeight: 1.5, color: '#475569', fontWeight: 500, whiteSpace: 'pre-wrap' }}>{customSec.content}</p>
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
