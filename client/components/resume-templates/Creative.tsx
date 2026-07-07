import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink } from 'lucide-react';

export const CreativeTemplate = ({ data }: { data: any }) => {
    const { personalInfo, experience, education, projects, skills } = data;

    const firstName = personalInfo?.fullName?.split(' ')[0] || 'FIRST';
    const lastName = personalInfo?.fullName?.split(' ').slice(1).join(' ') || 'LAST';

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
            style={{ fontFamily: getFontFamily(data.settings?.fontFamily) }}
        >
            {/* Header */}
            <header style={{ background: '#0f172a', color: '#fff', padding: '20px 28px', borderBottom: '4px solid #facc15', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: `${Math.round(32 * s)}px`, fontWeight: 900, lineHeight: 0.85, textTransform: 'uppercase', letterSpacing: '-0.05em', display: 'flex', flexDirection: 'column' }}>
                        <span>{firstName}</span>
                        <span style={{ color: '#facc15' }}>{lastName}</span>
                    </h1>
                    <div style={{ background: '#facc15', color: '#0f172a', display: 'inline-block', padding: '3px 8px', fontWeight: 900, marginTop: '8px', fontSize: `${Math.round(10 * s)}px`, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        {personalInfo?.jobTitle }
                    </div>
                </div>
                <div style={{ fontSize: `${Math.round(10 * s)}px`, fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.1em', textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {personalInfo?.email && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>{personalInfo.email} <Mail size={10} style={{ color: '#facc15' }} /></div>}
                    {personalInfo?.phone && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>{personalInfo.phone} <Phone size={10} style={{ color: '#facc15' }} /></div>}
                    {personalInfo?.location && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>{personalInfo.location} <MapPin size={10} style={{ color: '#facc15' }} /></div>}
                    {(personalInfo?.github || personalInfo?.linkedin) && (
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '4px', paddingTop: '4px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            {personalInfo?.github && <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}><Github size={12} /></a>}
                            {personalInfo?.linkedin && <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#fff' }}><Linkedin size={12} /></a>}
                        </div>
                    )}
                </div>
            </header>

            {/* Body */}
            <div style={{ padding: '20px 28px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {(data.sectionsOrder || ['summary', 'experience', 'education', 'projects', 'skills']).map((section: string) => {
                        switch (section) {
                            case 'summary':
                                return personalInfo?.summary && (
                                    <section key="summary" style={{ marginBottom: '14px' }}>
                                        <h2 style={{ fontSize: `${Math.round(18 * s)}px`, fontWeight: 900, textTransform: 'uppercase', borderBottom: '3px solid #facc15', display: 'inline-block', paddingBottom: '2px', fontStyle: 'italic', letterSpacing: '-0.02em', marginBottom: '4px' }}>About Me.</h2>
                                        <p style={{ fontSize: `${Math.round(12 * s)}px`, lineHeight: 1.6, color: '#475569', fontWeight: 500 }}>{personalInfo.summary}</p>
                                    </section>
                                );
                            case 'education':
                                return education?.length > 0 && (
                                    <section key="education" style={{ marginBottom: '14px' }}>
                                        <h2 style={{ fontSize: `${Math.round(18 * s)}px`, fontWeight: 900, textTransform: 'uppercase', borderBottom: '3px solid #facc15', display: 'inline-block', paddingBottom: '2px', fontStyle: 'italic', letterSpacing: '-0.02em', marginBottom: '6px' }}>Education.</h2>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            {(education || []).map((edu: any, i: number) => (
                                                <div key={i}>
                                                    <div style={{ fontWeight: 900, fontSize: `${Math.round(12 * s)}px`, textTransform: 'uppercase', color: '#0f172a', lineHeight: 1 }}>{edu.school}</div>
                                                    <div style={{ color: '#94a3b8', fontWeight: 800, fontSize: `${Math.round(10 * s)}px`, margin: '2px 0' }}>{edu.degree}</div>
                                                    <div style={{ fontSize: `${Math.round(10 * s)}px`, fontWeight: 900, color: '#cbd5e1', textTransform: 'uppercase', background: '#f8fafc', padding: '2px 6px', borderRadius: '9999px', display: 'inline-block' }}>{edu.graduationDate}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                );
                            case 'skills':
                                return skills?.length > 0 && (
                                    <section key="skills" style={{ marginBottom: '14px' }}>
                                        <h2 style={{ fontSize: `${Math.round(18 * s)}px`, fontWeight: 900, textTransform: 'uppercase', borderBottom: '3px solid #facc15', display: 'inline-block', paddingBottom: '2px', fontStyle: 'italic', letterSpacing: '-0.02em', marginBottom: '6px' }}>Skills.</h2>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                            {skills.map((skill: string, i: number) => (
                                                <span key={i} style={{ background: '#0f172a', color: '#fff', padding: '3px 8px', fontSize: `${Math.round(10 * s)}px`, fontWeight: 900, textTransform: 'uppercase', borderRadius: '3px', letterSpacing: '0.1em' }}>{skill}</span>
                                            ))}
                                        </div>
                                    </section>
                                );
                            case 'experience':
                                return experience?.length > 0 && (
                                    <section key="experience" style={{ marginBottom: '14px' }}>
                                        <h2 style={{ fontSize: `${Math.round(18 * s)}px`, fontWeight: 900, textTransform: 'uppercase', borderBottom: '3px solid #facc15', display: 'inline-block', paddingBottom: '2px', fontStyle: 'italic', letterSpacing: '-0.02em', marginBottom: '6px' }}>Experience.</h2>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            {(experience || []).map((exp: any, i: number) => (
                                                <div key={i} style={{ borderLeft: '2px solid #f1f5f9', paddingLeft: '10px', pageBreakInside: 'avoid' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                                                        <span style={{ fontWeight: 900, fontSize: `${Math.round(12 * s)}px`, textTransform: 'uppercase', color: '#0f172a' }}>{exp.position}</span>
                                                        <span style={{ fontSize: `${Math.round(10 * s)}px`, fontWeight: 900, color: '#cbd5e1', textTransform: 'uppercase', background: '#f8fafc', padding: '1px 6px', borderRadius: '9999px', flexShrink: 0 }}>{exp.startDate} — {exp.endDate}</span>
                                                    </div>
                                                    <div style={{ color: '#94a3b8', fontWeight: 900, fontSize: `${Math.round(10 * s)}px`, textTransform: 'uppercase', marginBottom: '3px' }}>{exp.company} </div>
                                                    <p style={{ fontSize: `${Math.round(11 * s)}px`, lineHeight: 1.5, color: '#475569', fontWeight: 500, whiteSpace: 'pre-wrap' }}>{exp.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                );
                            case 'projects':
                                return projects?.length > 0 && (
                                    <section key="projects" style={{ marginBottom: '14px' }}>
                                        <h2 style={{ fontSize: `${Math.round(18 * s)}px`, fontWeight: 900, textTransform: 'uppercase', borderBottom: '3px solid #facc15', display: 'inline-block', paddingBottom: '2px', fontStyle: 'italic', letterSpacing: '-0.02em', marginBottom: '6px' }}>Projects.</h2>
                                        <div style={{ display: 'grid', gap: '4px' }}>
                                            {projects.map((proj: any, i: number) => (
                                                <div key={i} style={{ border: '2px solid #f8fafc', padding: '8px', borderRadius: '6px', pageBreakInside: 'avoid' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                                                        <span style={{ fontWeight: 900, fontSize: `${Math.round(12 * s)}px`, textTransform: 'uppercase', color: '#0f172a' }}>{proj.title}</span>
                                                        <div style={{ display: 'flex', gap: '4px' }}>
                                                            {proj.githubLink && <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" style={{ color: '#cbd5e1' }}><ExternalLink size={10} /></a>}
                                                            {proj.deployedLink && <a href={proj.deployedLink} target="_blank" rel="noopener noreferrer" style={{ color: '#cbd5e1' }}><ExternalLink size={10} /></a>}
                                                        </div>
                                                    </div>
                                                    <p style={{ fontSize: `${Math.round(10 * s)}px`, color: '#94a3b8', fontStyle: 'italic', lineHeight: 1.4 }}>{proj.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                );
                            default:
                                const customSec = (data.customSections || []).find((s: any) => s.id === section);
                                if (customSec) {
                                    return (
                                        <section key={customSec.id} style={{ pageBreakInside: 'avoid', marginBottom: '14px' }}>
                                            <div className="h-section text-[#0f172a] font-black  uppercase border-b-[3px] border-yellow-400 mb-[6px] inline-block pb-0.5 tracking-tighter" style={{ fontSize: `${Math.round(14 * s)}px` }}>{customSec.title}.</div>
                                            <p className="description" style={{ fontSize: `${Math.round(12 * s)}px`, lineHeight: 1.5, color: '#475569', whiteSpace: 'pre-wrap', fontWeight: 500 }}>{customSec.content}</p>
                                        </section>
                                    );
                                }
                                return null;
                        }
                    })}
                </div>
            </div>
        </div>
    );
};
