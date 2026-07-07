import React from 'react';

export const SimpleTemplate = ({ data }: { data: any }) => {
    const { personalInfo, experience, education, projects, skills } = data;

    const getFontFamily = (family: string) => {
        switch (family) {
            case 'arial': return 'Arial, Helvetica, sans-serif';
            case 'calibri': return 'Calibri, "Segoe UI", sans-serif';
            case 'georgia': return 'Georgia, serif';
            case 'garamond': return '"EB Garamond", Garamond, serif';
            case 'times': return '"Times New Roman", Times, serif';
            default: return '"Times New Roman", Times, serif';
        }
    };

    const getBaseFontSize = (size: string) => {
        switch (size) {
            case 'small': return '12px';
            case 'large': return '16px';
            case 'medium':
            default: return '14px';
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

    const scale = getScale(data.settings?.fontSize);

    return (
        <div
            className="w-full bg-white text-black min-h-full"
            style={{
                fontFamily: getFontFamily(data.settings?.fontFamily),
                fontSize: getBaseFontSize(data.settings?.fontSize),
                padding: '0.6in 0.6in',
                lineHeight: 1.35,
            }}
        >
            {/* Header */}
            <header className="text-center mb-3" style={{ borderBottom: '1.5px solid #000', paddingBottom: '6px' }}>
                <h1 style={{ fontSize: `${Math.round(20 * scale)}px`, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1, margin: 0 }}>
                    {personalInfo?.fullName || 'RESUME'}
                </h1>
                <div style={{ fontSize: `${Math.round(11 * scale)}px`, marginTop: '4px', fontWeight: 'bold' }}>
                    {[personalInfo?.location, personalInfo?.phone, personalInfo?.email].filter(Boolean).join(' • ')}
                </div>
                {(personalInfo?.linkedin || personalInfo?.github) && (
                    <div style={{ fontSize: `${Math.round(10 * scale)}px`, marginTop: '2px', fontStyle: 'italic' }}>
                        {personalInfo?.linkedin && <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#000', textDecoration: 'underline' }}>LinkedIn</a>}
                        {personalInfo?.linkedin && personalInfo?.github && ' | '}
                        {personalInfo?.github && <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" style={{ color: '#000', textDecoration: 'underline' }}>GitHub</a>}
                    </div>
                )}
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {(data.sectionsOrder || ['summary', 'experience', 'education', 'projects', 'skills']).map((section: string) => {
                    switch (section) {
                        case 'summary':
                            return personalInfo?.summary && (
                                <section key="summary">
                                    <h2 style={{ fontSize: `${Math.round(15 * scale)}px`, fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1.5px solid #000', marginBottom: '4px', paddingBottom: '1px' }}>Summary</h2>
                                    <p style={{ textAlign: 'justify', lineHeight: 1.5, marginTop: '2px' }}>{personalInfo.summary}</p>
                                </section>
                            );
                        case 'education':
                            return education?.length > 0 && (
                                <section key="education">
                                    <h2 style={{ fontSize: `${Math.round(15 * scale)}px`, fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #000', marginBottom: '3px', paddingBottom: '1px' }}>Education</h2>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {education.map((edu: any, i: number) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                                <div style={{ lineHeight: 1.3 }}>
                                                    <div style={{ fontWeight: 'bold' }}>{edu.school}</div>
                                                    <div style={{ fontStyle: 'italic' }}>{edu.degree}</div>
                                                </div>
                                                <span style={{ fontWeight: 'bold', fontSize: `${Math.round(10 * scale)}px`, flexShrink: 0, marginLeft: '16px', textTransform: 'uppercase' }}>{edu.graduationDate}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            );
                        case 'skills':
                            return skills?.length > 0 && (
                                <section key="skills">
                                    <h2 style={{ fontSize: `${Math.round(15 * scale)}px`, fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #000', marginBottom: '3px', paddingBottom: '1px' }}>Technical Skills</h2>
                                    <p style={{ lineHeight: 1.4 }}>
                                        <span style={{ fontWeight: 'bold' }}>Skills & Technologies: </span>
                                        {skills.join(', ')}
                                    </p>
                                </section>
                            );
                        case 'experience':
                            return experience?.length > 0 && (
                                <section key="experience">
                                    <h2 style={{ fontSize: `${Math.round(15 * scale)}px`, fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #000', marginBottom: '3px', paddingBottom: '1px' }}>Work Experience</h2>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {experience.map((exp: any, i: number) => (
                                            <div key={i} style={{ pageBreakInside: 'avoid' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                                    <span>{exp.company}</span>
                                                    <span style={{ fontSize: `${Math.round(13 * scale)}px`, textTransform: 'uppercase' }}>{exp.startDate} – {exp.endDate}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: `${Math.round(13 * scale)}px` }}>
                                                    <span>{exp.position}</span>

                                                </div>
                                                <p style={{ whiteSpace: 'pre-wrap', marginTop: '2px', textAlign: 'justify', lineHeight: 1.4 }}>
                                                    {exp.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            );
                        case 'projects':
                            return projects?.length > 0 && (
                                <section key="projects">
                                    <h2 style={{ fontSize: `${Math.round(15 * scale)}px`, fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #000', marginBottom: '3px', paddingBottom: '1px' }}>Projects</h2>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {projects.map((proj: any, i: number) => (
                                            <div key={i} style={{ pageBreakInside: 'avoid' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                                    <span>{proj.title}</span>
                                                    <span style={{ fontWeight: 'normal',  fontSize: `${Math.round(14 * scale)}px` }}>
                                                        {proj.githubLink && <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" style={{ color: '#000', textDecoration: 'underline' }}>Source</a>}
                                                        {proj.githubLink && proj.deployedLink && ' | '}
                                                        {proj.deployedLink && <a href={proj.deployedLink} target="_blank" rel="noopener noreferrer" style={{ color: '#000', textDecoration: 'underline' }}>Live</a>}
                                                    </span>
                                                </div>
                                                <p style={{  color: '#000', lineHeight: 1.4 }}>{proj.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            );
                        default:
                            const customSec = (data.customSections || []).find((s: any) => s.id === section);
                            if (customSec) {
                                return (
                                    <section key={customSec.id} style={{ marginBottom: '4px' }}>
                                        <div className="section-title border-b-[1.5px] border-black pb-0.25 mb-1 mt-2 uppercase font-bold" style={{ fontSize: `${Math.round(13 * scale)}px` }}>{customSec.title}</div>
                                        <p style={{ margin: '2px 0 0 0', textAlign: 'justify', whiteSpace: 'pre-wrap', lineHeight: 1.4, fontSize: `${Math.round(13 * scale)}px` }}>{customSec.content}</p>
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
