const ICONS = {
    mail: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    phone: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    pin: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    github: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>`,
    linkedin: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>`,
    link: `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`,
    edu: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
    exp: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    proj: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M12 2H2v10"/><path d="M17 22h5v-10"/><path d="M2 22h5v-5"/><path d="M22 2h-5v5"/></svg>`
};

const BASE_CSS = `
    *, ::before, ::after { box-sizing: border-box; border-width: 0; border-style: solid; border-color: #e5e7eb; }
    html { line-height: 1.5; -webkit-text-size-adjust: 100%; -webkit-print-color-adjust: exact; text-rendering: optimizeLegibility; -webkit-font-smoothing: antialiased; }
    body { margin: 0; padding: 0; line-height: inherit; background: white; }
    h1, h2, h3, h4, h5, h6 { font-size: inherit; font-weight: inherit; margin: 0; font-family: inherit; }
    a { color: inherit; text-decoration: inherit; }
    p { margin: 0; }
    .page { 
        width: 210mm; 
        min-height: 297mm; 
        background: #fff; 
        position: relative; 
        margin: 0 auto;
    }
    @media print { 
        @page { size: A4; margin: 0; }
        .page { margin: 0; border: none; box-shadow: none; } 
        body { background: none; }
    }
`;

const getFontFamily = (family?: string, defaultFamily: string = 'Arial, Helvetica, sans-serif') => {
    switch (family) {
        case 'arial': return 'Arial, Helvetica, sans-serif';
        case 'calibri': return 'Calibri, "Segoe UI", sans-serif';
        case 'georgia': return 'Georgia, serif';
        case 'garamond': return '"EB Garamond", Garamond, serif';
        case 'times': return '"Times New Roman", Times, serif';
        default: return defaultFamily;
    }
};

const getFontSizeScale = (size?: string) => {
    switch (size) {
        case 'small': return '0.857'; // 12/14
        case 'large': return '1.143'; // 16/14
        case 'medium':
        default: return '1';
    }
};


export const modernTemplate = (data: any) => {
    const s = Number(getFontSizeScale(data.settings?.fontSize));

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,700;1,400&display=swap');
        ${BASE_CSS}
        body { 
            font-family: ${getFontFamily(data.settings?.fontFamily, 'Arial, Helvetica, sans-serif')}; 
            color: #1e293b; 
        }
        .page { padding: 24px 36px; display: flex; flex-direction: column; }
        .header { margin-bottom: ${Math.round(14 * s)}px; display: flex; justify-content: space-between; align-items: flex-start; flex-shrink: 0; }
        .header-content { flex: 1; }
        .name { font-size: ${Math.round(32 * s)}px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.05em; line-height: 1; color: #0f172a; margin: 0; }
        .job-title { font-size: ${Math.round(12 * s)}px; color: #2563eb; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; margin-top: 4px; }
        .contact { display: flex; flex-wrap: wrap; gap: ${Math.round(10 * s)}px; font-size: ${Math.round(10 * s)}px; font-weight: 700; color: #64748b; margin-top: 8px; }
        .profile-photo { 
            margin-left: 20px; 
            flex-shrink: 0; 
            width: ${Math.round(110 * s)}px; 
            height: ${Math.round(110 * s)}px; 
            border-radius: 50%; 
            border: 4px solid #f1f5f9;
            overflow: hidden;
            background: #f8fafc;
        }
        .profile-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .contact-item { display: flex; align-items: center; gap: 4px; }
        .section { margin-bottom: 0px; }
        .section-title { 
            font-size: ${Math.round(14 * s)}px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; color: #2563eb; 
            border-bottom: 2px solid #f1f5f9; padding-bottom: 3px; margin-bottom: 6px; display: flex; align-items: center; gap: 7px; 
        }
        .section-title span { width: 7px; height: 7px; background: #2563eb; display: block; }
        .summary-text { font-size: ${Math.round(12 * s)}px; line-height: 1.5; color: #475569; font-weight: 500; white-space: pre-wrap; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .edu-item { border-left: 2px solid rgba(37, 99, 235, 0.25); padding-left: 8px; }
        .edu-school { font-weight: 700; font-size: ${Math.round(11 * s)}px; text-transform: uppercase; color: #0f172a; }
        .edu-degree { font-size: ${Math.round(12 * s)}px; color: #64748b; font-weight: 700;  margin-top: 1px; }
        .edu-date { font-size: ${Math.round(12 * s)}px; color: #94a3b8; font-weight: 900; margin-top: 1px; }
        .skill-tag { background: #f1f5f9; color: #1e293b; padding: 3px 9px; border: 1px solid #e2e8f0; border-radius: 4px; font-size: ${Math.round(9 * s)}px; font-weight: 700; margin-right: 5px; margin-bottom: 5px; display: inline-block; text-transform: uppercase; letter-spacing: 0.05em; }
        .exp-list { display: flex; flex-direction: column; gap: ${Math.round(12 * s)}px; }
        .exp-item { border-left: 2px solid #2563eb; padding-left: 10px; page-break-inside: avoid; }
        .exp-header { display: flex; justify-content: space-between; align-items: baseline; }
        .exp-pos { font-weight: 700; font-size: ${Math.round(12 * s)}px; color: #0f172a; }
        .exp-date { font-size: ${Math.round(12 * s)}px; font-weight: 900; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.1em; }
        .exp-comp { font-weight: 700; color: #475569; font-size: ${Math.round(12 * s)}px; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 1px; margin-bottom: 4px; }
        .proj-list { display: flex; flex-direction: column; gap: 10px; }
        .proj-card { background: #f8fafc; padding: 12px; border-radius: 7px; border: 1.5px solid #e2e8f0; page-break-inside: avoid; }
        .proj-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px; }
        .proj-title { font-weight: 800; font-size: ${Math.round(12 * s)}px; color: #0f172a; text-transform: uppercase; }
        .proj-links { display: flex; align-items: center; gap: 4px; background: #fff; padding: 2px 8px; border-radius: 4px; border: 1px solid #e2e8f0; }
        .proj-link { display: flex; align-items: center; gap: 3px; color: #2563eb; font-size: 9px; font-weight: 700; text-decoration: none; }
        .proj-sep { color: #e2e8f0; width: 1px; height: 8px; background: #e2e8f0; margin: 0 4px; }
    </style>
</head>
<body>
    <div class="page">
        <header class="header">
            <div class="header-content">
                <h1 class="name">${data.personalInfo?.fullName || "Your Name"}</h1>
                <p class="job-title">${data.personalInfo?.jobTitle || "Professional Title"}</p>
                <div class="contact">
                    ${data.personalInfo?.email ? `<div class="contact-item"><span style="color: #2563eb;">${ICONS.mail}</span> ${data.personalInfo.email}</div>` : ''}
                    ${data.personalInfo?.phone ? `<div class="contact-item"><span style="color: #2563eb;">${ICONS.phone}</span> ${data.personalInfo.phone}</div>` : ''}
                    ${data.personalInfo?.location ? `<div class="contact-item"><span style="color: #2563eb;">${ICONS.pin}</span> ${data.personalInfo.location}</div>` : ''}
                    ${data.personalInfo?.github ? `<div class="contact-item"><span style="color: #2563eb;">${ICONS.github}</span> ${(data.personalInfo.github || '').replace('https://', '')}</div>` : ''}
                    ${data.personalInfo?.linkedin ? `<div class="contact-item"><span style="color: #2563eb;">${ICONS.linkedin}</span> ${(data.personalInfo.linkedin || '').replace('https://', '')}</div>` : ''}
                </div>
            </div>
            ${data.personalInfo?.photo ? `
            <div class="profile-photo">
                <img src="${data.personalInfo.photo}" alt="${data.personalInfo.fullName}">
            </div>
            ` : ''}
        </header>

        <div style="display: flex; flex-direction: column; gap: ${Math.round(16 * s)}px;">
            ${(data.sectionsOrder || ['summary', 'experience', 'education', 'projects', 'skills']).map((section: string) => {
        switch (section) {
            case 'summary':
                return data.personalInfo?.summary ? `
                        <section class="section">
                            <h2 class="section-title"><span></span>Profile</h2>
                            <p class="summary-text">${data.personalInfo.summary}</p>
                        </section>` : '';
            case 'education':
                return data.education?.length ? `
                        <section class="section">
                            <h2 class="section-title"><span></span>Education</h2>
                            <div class="grid-2">
                                ${data.education.map((edu: any) => `
                                <div class="edu-item">
                                    <div class="edu-school">${edu.school || ''}</div>
                                    <div class="edu-degree">${edu.degree || ''}</div>
                                    <div class="edu-date">${edu.graduationDate || ''}</div>
                                </div>`).join('')}
                            </div>
                        </section>` : '';
            case 'skills':
                return data.skills?.length ? `
                        <section class="section">
                            <h2 class="section-title"><span></span>Technical Expertise</h2>
                            <div style="display: flex; flex-wrap: wrap;">
                                ${data.skills.map((skill: string) => `<span class="skill-tag">${skill}</span>`).join('')}
                            </div>
                        </section>` : '';
            case 'experience':
                return data.experience?.length ? `
                        <section class="section">
                            <h2 class="section-title"><span></span>Experience</h2>
                            <div class="exp-list">
                                ${data.experience.map((exp: any) => `
                                <div class="exp-item">
                                    <div class="exp-header">
                                        <span class="exp-pos">${exp.position || ''}</span>
                                        <span class="exp-date">${exp.startDate || ''} — ${exp.endDate || ''}</span>
                                    </div>
                                    <div class="exp-comp">${exp.company || ''} ${exp.location ? `| ${exp.location}` : ''}</div>
                                    <p class="summary-text" style="margin-top: 4px;">${exp.description || ''}</p>
                                </div>`).join('')}
                            </div>
                        </section>` : '';
            case 'projects':
                return data.projects?.length ? `
                        <section class="section">
                            <h2 class="section-title"><span></span>Key Projects</h2>
                            <div class="proj-list">
                                ${data.projects.map((proj: any) => `
                                <div class="proj-card">
                                    <div class="proj-header">
                                        <span class="proj-title">${proj.title || ''}</span>
                                        <div class="proj-links">
                                            ${proj.githubLink ? `<a href="${proj.githubLink}" class="proj-link">SOURCE</a>` : ''}
                                            ${proj.githubLink && proj.deployedLink ? `<span class="proj-sep"></span>` : ''}
                                            ${proj.deployedLink ? `<a href="${proj.deployedLink}" class="proj-link">LIVE DEMO</a>` : ''}
                                        </div>
                                    </div>
                                    <p class="summary-text" style="margin-top: 0;">${proj.description || ''}</p>
                                </div>`).join('')}
                            </div>
                        </section>` : '';
                ;
            default:
                const customSec = (data.customSections || []).find((s: any) => s.id === section);
                if (customSec) {
                    return `
                            <section class="section">
                                <h2 class="section-title"><span></span>${customSec.title}</h2>
                                <p class="summary-text" style="white-space: pre-wrap;">${customSec.content}</p>
                            </section>`;
                }
                return '';
        }
    }).join('')}
        </div>
    </div>
</body>
</html>
`;
};

export const professionalTemplate = (data: any) => {
    const s = Number(getFontSizeScale(data.settings?.fontSize));

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,700;1,400&display=swap');
        ${BASE_CSS}
        body { 
            font-family: ${getFontFamily(data.settings?.fontFamily, 'Arial, Helvetica, sans-serif')}; 
            color: #1e293b; 
        }
        .page { display: flex; padding: 0; align-items: stretch; }
        .sidebar { width: 32%; background: #1a252f; color: #fff; padding: 30px 24px; flex-shrink: 0; display: flex; flex-direction: column; gap: 24px; min-height: 297mm; }
        .main { flex: 1; padding: 32px 40px; display: flex; flex-direction: column; gap: ${Math.round(18 * s)}px; }
        .name { font-size: ${Math.round(22 * s)}px; font-weight: 800; text-transform: uppercase; border-bottom: 2px solid #e9ecf0ff; padding-bottom: 12px; line-height: 1.1; letter-spacing: 0.05em; }
        .job-title { color: #edf1f7ff; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; font-size: ${Math.round(14 * s)}px; margin-top: 8px; }
        .sidebar-title { font-size: ${Math.round(14 * s)}px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em; color: #94a3b8; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 4px; }
        .sidebar-item { font-size: ${Math.round(14 * s)}px; color: #cbd5e1; display: flex; align-items: center; gap: 8px; word-break: break-all; margin-bottom: 8px; }
        .skill-chip { display: flex; align-items: center; gap: 5px; background: rgba(255,255,255,0.08); padding: 4px 10px; border-radius: 4px; font-size: ${Math.round(14 * s)}px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #fff; margin: 0 6px 6px 0; }
        .section-title { font-size: ${Math.round(14 * s)}px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; color: #1e293b; display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
        .section-line { flex: 1; height: 2px; background: #f1f5f9; }
        .desc { font-size: ${Math.round(10.5 * s)}px; line-height: 1.6; color: #334155; white-space: pre-wrap; text-align: justify; }
        .item { page-break-inside: avoid; margin-bottom: 0px; }
        .item-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
        .item-title { font-weight: 800; font-size: ${Math.round(14 * s)}px; color: #0f172a; line-height: 1.2; }
        .item-date { font-size: ${Math.round(12 * s)}px; font-weight: 800; color: #070707ff; text-transform: uppercase; letter-spacing: 0.1em; margin-left: 12px; flex-shrink: 0; background: #eff6ff; padding: 2px 8px; border-radius: 4px; }
        .item-sub { font-weight: 700; color: #64748b; font-size: ${Math.round(12 * s)}px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
        .icon { color: #080808ff; flex-shrink: 0; display: inline-flex; }
        .proj-card { border-left: 3px solid #0b0c0cff; padding: 12px 14px; background: #f8fafc; border-radius: 0 8px 8px 0; page-break-inside: avoid; }
    </style>
</head>
<body>
    <div class="page">
        <div class="sidebar">
            <div>
                <h1 class="name">${data.personalInfo?.fullName || "Your Name"}</h1>
                <p class="job-title">${data.personalInfo?.jobTitle || "Professional Title"}</p>
            </div>

            <div>
                <h3 class="sidebar-title">Contact</h3>
                <div style="display: flex; flex-direction: column;">
                    ${data.personalInfo?.email ? `<div class="sidebar-item"><span class="icon">${ICONS.mail}</span> ${data.personalInfo.email}</div>` : ''}
                    ${data.personalInfo?.phone ? `<div class="sidebar-item"><span class="icon">${ICONS.phone}</span> ${data.personalInfo.phone}</div>` : ''}
                    ${data.personalInfo?.location ? `<div class="sidebar-item"><span class="icon">${ICONS.pin}</span> ${data.personalInfo.location}</div>` : ''}
                    ${data.personalInfo?.github ? `<div class="sidebar-item"><span class="icon">${ICONS.github}</span> ${(data.personalInfo.github || '').replace('https://', '')}</div>` : ''}
                    ${data.personalInfo?.linkedin ? `<div class="sidebar-item"><span class="icon">${ICONS.linkedin}</span> ${(data.personalInfo.linkedin || '').replace('https://', '')}</div>` : ''}
                </div>
            </div>

            ${data.skills?.length ? `
            <div>
                <h3 class="sidebar-title">Expertise</h3>
                <div style="display: flex; flex-wrap: wrap;">
                    ${data.skills.map((skill: string) => `<div class="skill-chip">${skill}</div>`).join('')}
                </div>
            </div>
            ` : ''}
        </div>
        <div class="main">
            ${(data.sectionsOrder || ['summary', 'experience', 'education', 'projects', 'skills']).map((section: string) => {
        switch (section) {
            case 'summary':
                return data.personalInfo?.summary ? `
                        <section style="page-break-inside: avoid;">
                            <h2 class="section-title"> Profile Summary <span class="section-line"></span></h2>
                            <p class="desc">${data.personalInfo.summary}</p>
                        </section>` : '';
            case 'education':
                return data.education?.length ? `
                        <section>
                            <h2 class="section-title">Education <span class="section-line"></span></h2>
                            <div style="display: flex; flex-direction: column; gap: 10px;">
                                ${data.education.map((edu: any) => `
                                <div style="display: flex; justify-content: space-between; align-items: start; page-break-inside: avoid;">
                                    <div>
                                        <div style="font-weight: 800; font-size: ${Math.round(14 * s)}px; text-transform: uppercase; color: #0f172a;">${edu.school || ''}</div>
                                        <div style="font-size: ${Math.round(12 * s)}px; color: #475569; font-weight: 600;  margin-top: 2px;">${edu.degree || ''}</div>
                                    </div>
                                    <div class="item-date">${edu.graduationDate || ''}</div>
                                </div>`).join('')}
                            </div>
                        </section>` : '';
            case 'experience':
                return data.experience?.length ? `
                        <section>
                            <h2 class="section-title">Work Experience <span class="section-line"></span></h2>
                            <div style="display: flex; flex-direction: column; gap: 18px;">
                                ${data.experience.map((exp: any) => `
                                <div class="item">
                                    <div class="item-header">
                                        <h3 class="item-title">${exp.position}</h3>
                                        <span class="item-date">${exp.startDate} — ${exp.endDate}</span>
                                    </div>
                                    <div class="item-sub">${exp.company || ''} ${exp.location ? `• ${exp.location}` : ''}</div>
                                    <p class="desc">${exp.description}</p>
                                </div>`).join('')}
                            </div>
                        </section>` : '';
            case 'projects':
                return data.projects?.length ? `
                        <section>
                            <h2 class="section-title">Key Projects <span class="section-line"></span></h2>
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                ${data.projects.map((proj: any) => `
                                <div class="proj-card">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                                        <h4 style="font-weight: 800; font-size: ${Math.round(14 * s)}px; color: #0f172a;">${proj.title}</h4>
                                        <div style="display: flex; gap: 8px; color: #0f0f0fff;">
                                            ${proj.githubLink ? `<a href="${proj.githubLink}">${ICONS.link}</a>` : ''}
                                            ${proj.deployedLink ? `<a href="${proj.deployedLink}">${ICONS.link}</a>` : ''}
                                        </div>
                                    </div>
                                    <p class="desc" style="font-size: ${Math.round(12 * s)}px; color: #475569; line-height: 1.5;">${proj.description}</p>
                                </div>`).join('')}
                            </div>
                        </section>` : '';
            default:
                const customSec = (data.customSections || []).find((s: any) => s.id === section);
                if (customSec) {
                    return `
                            <section style="page-break-inside: avoid;">
                                <h2 class="section-title">${customSec.title} <span class="section-line"></span></h2>
                                <p class="desc">${customSec.content}</p>
                            </section>`;
                }
                return '';
        }
    }).join('')}
        </div>
    </div>
</body>
</html>
`;
};


export const creativeTemplate = (data: any) => {
    const s = Number(getFontSizeScale(data.settings?.fontSize));
    const firstName = data.personalInfo?.fullName?.split(' ')[0] || 'FIRST';
    const lastName = data.personalInfo?.fullName?.split(' ').slice(1).join(' ') || 'LAST';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,700;1,400&display=swap');
        ${BASE_CSS}
        body { 
            font-family: ${getFontFamily(data.settings?.fontFamily, 'Arial, Helvetica, sans-serif')}; 
            color: #1e293b; 
        }
        .page { padding: 0; }
        .header { background: #0f172a; color: #fff; padding: 20px 28px; border-bottom: 4px solid #facc15; display: flex; justify-content: space-between; align-items: center; }
        .name-big { font-size: ${Math.round(32 * s)}px; font-weight: 900; line-height: 0.85; text-transform: uppercase; letter-spacing: -0.05em; display: flex; flex-direction: column; }
        .accent-text { color: #facc15; }
        .job-tag { background: #facc15; color: #0f172a; display: inline-block; padding: 3px 8px; font-weight: 900; margin-top: 8px; font-size: ${Math.round(10 * s)}px; text-transform: uppercase; letter-spacing: 0.1em; }
        .contact-box { font-size: ${Math.round(10 * s)}px; font-weight: 900; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.1em; text-align: right; display: flex; flex-direction: column; gap: 5px; }
        .contact-item { display: flex; align-items: center; justify-content: flex-end; gap: 6px; }
        .icon { color: #facc15; }
        .content { padding: 20px 28px; display: flex; flex-direction: column; gap: 14px; }
        .h-section { font-size: ${Math.round(18 * s)}px; font-weight: 900; text-transform: uppercase; margin-bottom: 6px; border-bottom: 3px solid #facc15; display: inline-block; padding-bottom: 2px;  letter-spacing: -0.02em; }
        .description { font-size: ${Math.round(12 * s)}px; line-height: 1.6; color: #475569; white-space: pre-wrap; font-weight: 500; }
        .item-title { font-weight: 900; font-size: ${Math.round(12 * s)}px; text-transform: uppercase; color: #0f172a; line-height: 1; }
        .item-sub { color: #94a3b8; font-weight: 900; font-size: ${Math.round(10 * s)}px; text-transform: uppercase; margin: 3px 0; letter-spacing: 0.05em; }
        .item-date { font-size: ${Math.round(10 * s)}px; font-weight: 900; color: #cbd5e1; text-transform: uppercase; background: #f8fafc; padding: 2px 6px; border-radius: 9999px; display: inline-block; }
        .skill-tag { background: #0f172a; color: #fff; padding: 3px 8px; font-size: ${Math.round(10 * s)}px; font-weight: 900; text-transform: uppercase; border-radius: 3px; display: inline-block; margin: 0 4px 4px 0; letter-spacing: 0.1em; }
        .exp-item { border-left: 2px solid #0c0c0c; padding-left: 10px; page-break-inside: avoid; }
        .proj-card { border: 2px solid #f5eeee; padding: 8px; border-radius: 6px; page-break-inside: avoid; }
    </style>
</head>
<body>
    <div class="page">
        <header class="header">
            <div>
                <h1 class="name-big"><span>${firstName}</span><span class="accent-text">${lastName}</span></h1>
                <div class="job-tag">${data.personalInfo?.jobTitle || 'Creative Force'}</div>
            </div>
            <div class="contact-box">
                ${data.personalInfo?.email ? `<div class="contact-item">${data.personalInfo.email} <span class="icon">${ICONS.mail}</span></div>` : ''}
                ${data.personalInfo?.phone ? `<div class="contact-item">${data.personalInfo.phone} <span class="icon">${ICONS.phone}</span></div>` : ''}
                ${data.personalInfo?.location ? `<div class="contact-item">${data.personalInfo.location} <span class="icon">${ICONS.pin}</span></div>` : ''}
                <div style="border-top: 1px solid rgba(255,255,255,0.1); margin-top: 4px; padding-top: 4px; display: flex; justify-content: flex-end; gap: 8px;">
                    ${data.personalInfo?.github ? `<a href="${data.personalInfo.github}" style="color: #fff;">${ICONS.github}</a>` : ''}
                    ${data.personalInfo?.linkedin ? `<a href="${data.personalInfo.linkedin}" style="color: #fff;">${ICONS.linkedin}</a>` : ''}
                </div>
            </div>
        </header>

        <div class="content">
            ${(data.sectionsOrder || ['summary', 'experience', 'education', 'projects', 'skills']).map((section: string) => {
        switch (section) {
            case 'summary':
                return data.personalInfo?.summary ? `
                        <section>
                            <div class="h-section">About Me.</div>
                            <p class="description">${data.personalInfo.summary}</p>
                        </section>` : '';
            case 'education':
                return data.education?.length ? `
                        <section>
                            <div class="h-section">Education.</div>
                            <div style="display: flex; flex-direction: column; gap: 6px;">
                                ${data.education.map((edu: any) => `
                                <div style="page-break-inside: avoid;">
                                    <div class="item-title">${edu.school || ''}</div>
                                    <div class="item-sub" style="margin: 2px 0;">${edu.degree || ''}</div>
                                    <div class="item-date">${edu.graduationDate || ''}</div>
                                </div>`).join('')}
                            </div>
                        </section>` : '';
            case 'skills':
                return data.skills?.length ? `
                        <section style="page-break-inside: avoid;">
                            <div class="h-section">Skills.</div>
                            <div style="display: flex; flex-wrap: wrap; gap: 4px; padding-top: 4px;">
                                ${data.skills.map((skill: string) => `<span class="skill-tag">${skill}</span>`).join('')}
                            </div>
                        </section>` : '';
            case 'experience':
                return data.experience?.length ? `
                        <section>
                            <div class="h-section">Experience.</div>
                            <div style="display: flex; flex-direction: column; gap: 6px;">
                                ${data.experience.map((exp: any) => `
                                <div class="exp-item">
                                    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
                                        <div class="item-title">${exp.position || ''}</div>
                                        <span class="item-date">${exp.startDate || ''} — ${exp.endDate || ''}</span>
                                    </div>
                                    <div class="item-sub">${exp.company || ''} | ${exp.location || ''}</div>
                                    <p class="description">${exp.description || ''}</p>
                                </div>`).join('')}
                            </div>
                        </section>` : '';
            case 'projects':
                return data.projects?.length ? `
                        <section>
                            <div class="h-section">Projects.</div>
                            <div style="display: grid; gap: 8px;">
                                ${data.projects.map((proj: any) => `
                                <div class="proj-card">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
                                        <div class="item-title">${proj.title || ''}</div>
                                        <div style="display: flex; gap: 6px; color: #cbd5e1;">
                                            ${proj.githubLink ? `<a href="${proj.githubLink}">${ICONS.link}</a>` : ''}
                                            ${proj.deployedLink ? `<a href="${proj.deployedLink}">${ICONS.link}</a>` : ''}
                                        </div>
                                    </div>
                                    <p style="font-size: ${Math.round(10 * s)}px; color: #242527;  line-height: 1.4;">${proj.description || ''}</p>
                                </div>`).join('')}
                            </div>
                        </section>` : '';
            default:
                const customSec = (data.customSections || []).find((s: any) => s.id === section);
                if (customSec) {
                    return `
                        <section style="page-break-inside: avoid;">
                            <div class="h-section" style="margin-top: 2px;">${customSec.title}.</div>
                            <p class="description">${customSec.content}</p>
                        </section>`;
                }
                return '';
        }
    }).join('')}
        </div>
    </div>
</body>
</html>
`;
};

export const simpleTemplate = (data: any) => {
    const scale = Number(getFontSizeScale(data.settings?.fontSize));

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,700;1,400&display=swap');
        ${BASE_CSS}
        body { 
            font-family: ${getFontFamily(data.settings?.fontFamily, '"Times New Roman", Times, serif')}; 
            color: #000; 
            font-size: ${Math.round(14 * scale)}px; 
            line-height: 1.2;
        }
        .page { 
            padding: 0.6in 0.6in;
            display: flex;
            flex-direction: column;
        }
        header { text-align: center; margin-bottom: 12px; border-bottom: 1.5px solid #000; padding-bottom: 6px; }
        .name { 
            font-size: ${Math.round(18 * scale)}px; 
            font-weight: bold; 
            text-transform: uppercase; 
            letter-spacing: 0.05em; 
            line-height: 1; 
            margin: 0;
        }
        .contact { 
            font-size: ${Math.round(12 * scale)}px; 
            margin-top: 4px; 
            font-weight: bold; 
        }
        .links {
            font-size: ${Math.round(12 * scale)}px;
            margin-top: 2px;
           
        }
        p {
            margin: 0;
            text-align: justify;
            white-space: pre-wrap;
            line-height: 1.4;
        }
        .summary-p { line-height: 1.5; margin-top: 2px; }
        .section-title {
            font-size: ${Math.round(14 * scale)}px;
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 1px solid #000;
            margin-top: 0px;
            margin-bottom: 3px;
            padding-bottom: 1px;
        }
        .section-title.summary { border-bottom: 1.5px solid #000; margin-bottom: 4px; }
        .item-row { display: flex; justify-content: space-between; align-items: baseline; }
        .bold { font-weight: bold; }
        .education-item { page-break-inside: avoid; }
        .experience-item { page-break-inside: avoid; }
        .project-item { page-break-inside: avoid; }
        section { margin-bottom: 0px; }
    </style>
</head>
<body>
    <div class="page">
        <header>
            <h1 class="name">${data.personalInfo?.fullName || 'RESUME'}</h1>
            <div class="contact">
                ${[data.personalInfo?.location, data.personalInfo?.phone, data.personalInfo?.email].filter(Boolean).join(' • ')}
            </div>
            ${data.personalInfo?.linkedin || data.personalInfo?.github ? `
            <div class="links">
                ${data.personalInfo?.linkedin ? `<a href="${data.personalInfo.linkedin}">LinkedIn</a>` : ''}
                ${data.personalInfo?.linkedin && data.personalInfo?.github ? ' | ' : ''}
                ${data.personalInfo?.github ? `<a href="${data.personalInfo.github}">GitHub</a>` : ''}
            </div>
            ` : ''}
        </header>

        <div style="display: flex; flex-direction: column; gap: 8px;">
            ${(data.sectionsOrder || ['summary', 'experience', 'education', 'projects', 'skills']).map((section: string) => {
        switch (section) {
            case 'summary':
                return data.personalInfo?.summary ? `
                        <section>
                            <div class="section-title summary">Summary</div>
                            <p class="summary-p">${data.personalInfo.summary}</p>
                        </section>` : '';
            case 'education':
                return data.education?.length ? `
                        <section>
                            <div class="section-title">Education</div>
                            <div style="display: flex; flex-direction: column; gap: 4px;">
                                ${data.education.map((edu: any) => `
                                <div class="education-item">
                                    <div class="item-row">
                                        <span class="bold">${edu.school || ''}</span>
                                        <span class="bold" style="font-size: ${Math.round(12 * scale)}px; text-transform: uppercase; margin-left: 16px;">${edu.graduationDate || ''}</span>
                                    </div>
                                    <div class="item-row ">
                                        <span>${edu.degree || ''}</span>
                                    </div>
                                </div>`).join('')}
                            </div>
                        </section>` : '';
            case 'skills':
                return data.skills?.length ? `
                        <section>
                            <div class="section-title">Technical Skills</div>
                            <p><span class="bold">Skills & Technologies:</span> ${(data.skills || []).join(', ')}</p>
                        </section>` : '';
            case 'experience':
                return data.experience?.length ? `
                        <section>
                            <div class="section-title">Work Experience</div>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                ${data.experience.map((exp: any) => `
                                <div class="experience-item">
                                    <div class="item-row bold">
                                        <span>${exp.company || ''}</span>
                                        <span style="font-size: ${Math.round(12 * scale)}px; text-transform: uppercase;">${exp.startDate || ''} - ${exp.endDate || ''}</span>
                                    </div>
                                    <div class="item-row " style="font-size: ${Math.round(12 * scale)}px;">
                                        <span>${exp.position || ''}</span>
                                       
                                    </div>
                                    <p style="margin-top: 2px;">${exp.description || ''}</p>
                                </div>`).join('')}
                            </div>
                        </section>` : '';
            case 'projects':
                return data.projects?.length ? `
                        <section>
                            <div class="section-title">Projects</div>
                            <div style="display: flex; flex-direction: column; gap: 4px;">
                                ${data.projects.map((proj: any) => `
                                <div class="project-item">
                                    <div class="item-row bold">
                                        <span>${proj.title || ''}</span>
                                        <span class="normal" style="font-size: ${Math.round(12 * scale)}px; font-weight: normal;">
                                            ${proj.githubLink ? `<a href="${proj.githubLink}">Source</a>` : ''}
                                            ${proj.githubLink && proj.deployedLink ? ' | ' : ''}
                                            ${proj.deployedLink ? `<a href="${proj.deployedLink}">Live</a>` : ''}
                                        </span>
                                    </div>
                                    <p class="normal" style="color: #000; margin-top: 0px;">${proj.description || ''}</p>
                                </div>`).join('')}
                            </div>
                        </section>` : '';
            default:
                const customSec = (data.customSections || []).find((s: any) => s.id === section);
                if (customSec) {
                    return `
                            <section>
                                <div class="section-title" style="margin-top: 2px;">${customSec.title}</div>
                                <p>${customSec.content}</p>
                            </section>`;
                }
                return '';
        }
    }).join('')}
        </div>
    </div>
</body>
</html>
`;
};
