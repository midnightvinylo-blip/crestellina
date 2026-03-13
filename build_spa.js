const fs = require('fs');

function getSection(html, startMark, endMark) {
    const start = html.indexOf(startMark);
    if (start === -1) {
        console.error("Start mark not found:", startMark);
        return '';
    }
    const end = html.indexOf(endMark, start);
    if (end === -1) {
        console.warn("End mark not found:", endMark);
        return html.substring(start);
    }
    return html.substring(start, end);
}

const indexHtml = fs.readFileSync('index.html', 'utf8');
const nosotrosHtml = fs.readFileSync('nosotros.html', 'utf8');
const tiendaHtml = fs.readFileSync('tienda.html', 'utf8');
const experienciasHtml = fs.readFileSync('experiencias.html', 'utf8');

const sNosotros = getSection(nosotrosHtml, '<main', '<!-- Footer -->').replace('<main', '<div').replace('</main>', '</div>');
const sTienda = getSection(tiendaHtml, '<main', '<!-- Footer -->').replace('<main', '<div').replace('</main>', '</div>');
// EXPERIENCIAS has no "<!-- Footer -->" so extract up to "<script"
const sExperiencias = getSection(experienciasHtml, '<main', '<script src="main.js"></script>').replace('<main', '<div').replace('</main>', '</div>');

let spaContent = `
    <!-- SECCIONES INTEGRADAS PARA DEMO IA -->
    <div id="nosotros-section" class="hidden min-h-screen bg-background-dark">
        ${sNosotros}
    </div>
    <div id="tienda-section" class="hidden min-h-screen bg-background-dark">
        ${sTienda}
    </div>
    <div id="experiencias-section" class="hidden min-h-screen bg-background-dark">
        ${sExperiencias}
    </div>
`;

// Surgical IDs for scroll tracking
spaContent = spaContent.replace('id="equipo"', 'id="equipo-ia"');
spaContent = spaContent.replace('<!-- Juan Ocaña Padre -->', '<!-- Juan Ocaña Padre -->\n<div id="familia-juan-padre" style="height:1px; width:1px; position:relative; top:-150px;"></div>');
spaContent = spaContent.replace('<!-- Ana Mateo -->', '<!-- Ana Mateo -->\n<div id="familia-ana-mateo" style="height:1px; width:1px; position:relative; top:-150px;"></div>');
spaContent = spaContent.replace('<!-- Juan Hijo -->', '<!-- Juan Hijo -->\n<div id="familia-juan-hijo" style="height:1px; width:1px; position:relative; top:-150px;"></div>');
spaContent = spaContent.replace('\u003c!-- Ana Hija --\u003e', '\u003c!-- Ana Hija --\u003e\n\u003cdiv id="familia-ana-hija" style="height:1px; width:1px; position:relative; top:-150px;"\u003e\u003c/div\u003e');
spaContent = spaContent.replace(
    `<div class="relative flex flex-col items-center">\r\n                                <button onclick="toggleAccordion('cristina')"`,
    `<div class="relative flex flex-col items-center" id="familia-cristina">\r\n                                <button onclick="toggleAccordion('cristina')"`
);
spaContent = spaContent.replace(
    `<div class="relative flex flex-col items-center">\r\n                                <button onclick="toggleAccordion('corbacho')"`,
    `<div class="relative flex flex-col items-center" id="familia-juan-corbacho">\r\n                                <button onclick="toggleAccordion('corbacho')"`
);

// Base HTML Construction
let fullSpa = indexHtml;
fullSpa = fullSpa.replace('<title>Quesería Crestellina - El Sabor de la Herencia</title>', '<title>Crestellina - Experiencia Lunares</title>');

// Update header navigation links to use SPA routing
fullSpa = fullSpa.replace(/href="index\.html"/g, 'href="#inicio" onclick="window.navToSection(\'inicio\'); return false;"');
fullSpa = fullSpa.replace(/href="experiencias\.html"/g, 'href="#experiencias" onclick="window.navToSection(\'experiencias\'); return false;"');
fullSpa = fullSpa.replace(/href="tienda\.html"/g, 'href="#tienda" onclick="window.navToSection(\'tienda\'); return false;"');
fullSpa = fullSpa.replace(/href="nosotros\.html"/g, 'href="#nosotros" onclick="window.navToSection(\'nosotros\'); return false;"');
fullSpa = fullSpa.replace(/href="contacto\.html"/g, 'href="#contacto" onclick="window.navToSection(\'contacto\'); return false;"');
// Extract scripts of experiencias that handle dynamic logic inside experiences!
// This is critical for experiences expanding correctly.
const expScriptContent = getSection(experienciasHtml, '// ===== SCROLL EXPANSION HERO LOGIC', '</script>');

const heroStart = fullSpa.indexOf('<!-- Sección Hero -->');
const footerStart = fullSpa.indexOf('<!-- Footer -->');

if (heroStart !== -1 && footerStart !== -1) {
    const landingContent = fullSpa.substring(heroStart, footerStart);
    const beforeHero = fullSpa.substring(0, heroStart);
    const afterLanding = fullSpa.substring(footerStart);
    fullSpa = beforeHero + '<div id="landing-home" class="w-full">' + landingContent + '</div>' + spaContent + afterLanding;
}

const modalHtmlBlock = `
    <!-- MODAL GLOBAL SISTEMA -->
    <div id="global-modal"
        class="fixed inset-0 z-[1000] flex items-center justify-center p-4 opacity-0 pointer-events-none transition-all duration-500 bg-background-dark/80 backdrop-blur-md"
        onclick="closeModal()">
        <div class="modal-content w-full max-w-2xl bg-slate-900/95 border border-primary/30 rounded-[3rem] p-8 sm:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] transform scale-90 transition-all duration-500 relative max-h-[90vh] flex flex-col"
            onclick="event.stopPropagation()">
            <button onclick="closeModal()"
                class="absolute top-8 right-8 text-slate-500 hover:text-primary transition-colors">
                <i data-lucide="x" class="w-8 h-8"></i>
            </button>
            <div id="modal-body"
                class="overflow-y-auto custom-scrollbar pr-4 text-slate-300 text-sm sm:text-base space-y-4">
            </div>
        </div>
    </div>
`;

// Extract teamData from nosotros.html
// Using more robust string matching that handles CRLF
const teamDataIndex = nosotrosHtml.indexOf('// Objeto con los textos completos');
const scriptEndIndex = nosotrosHtml.indexOf('</script>', teamDataIndex);
const extractedScript = nosotrosHtml.substring(teamDataIndex, scriptEndIndex);

// Put everything together before the end of body
fullSpa = fullSpa.replace('</body>', `${modalHtmlBlock}\n<script>\n${extractedScript}\n</script>\n<script>\n${expScriptContent}\n</script>\n</body>`);

const spaLogic = `
<script>
window.navToSection = function(sectionId) {
    console.log("[SPA] Navigating to:", sectionId);
    const sections = ['nosotros-section', 'tienda-section', 'experiencias-section', 'landing-home'];
    
    // Normalize sectionId
    let targetSectionId = '';
    if (sectionId === 'nosotros') targetSectionId = 'nosotros-section';
    else if (sectionId === 'tienda' || sectionId === 'catalogo' || sectionId === 'packs') targetSectionId = 'tienda-section';
    else if (sectionId === 'experiencias') targetSectionId = 'experiencias-section';
    else if (sectionId === 'inicio') targetSectionId = 'landing-home';
    else {
        // Find which section contains the given element ID
        const el = document.getElementById(sectionId);
        if (el) {
            sections.forEach(s => {
                const secEl = document.getElementById(s);
                if (secEl && secEl.contains(el)) targetSectionId = s;
            });
        }
    }

    if (!targetSectionId) {
        // Fallback search
        const el = document.getElementById(sectionId);
        if (el) {
             const parent = sections.find(s => {
                 const secEl = document.getElementById(s);
                 return secEl && secEl.contains(el);
             });
             if (parent) targetSectionId = parent;
        }
    }

    // Hide all sections, show target
    sections.forEach(s => {
        const el = document.getElementById(s);
        if (el) el.classList.add('hidden');
    });

    if (targetSectionId) {
        document.getElementById(targetSectionId).classList.remove('hidden');
        if (window.lucide) lucide.createIcons();
    }

    // Scroll handling
    if (sectionId === 'inicio' || sectionId === 'landing-home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        const el = document.getElementById(sectionId);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            window.scrollTo({ top: 0, behavior: 'instant' });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const vapiStart = urlParams.get('vapi') === 'start';
    
    const landing = document.getElementById('landing-home');
    if (landing) landing.classList.remove('hidden');

    if (window.location.hash) {
        const hashId = window.location.hash.substring(1);
        setTimeout(() => window.navToSection(hashId), 300);
    }
    
    if (vapiStart) {
        // Wait briefly for UI to draw, then trigger Lunares
        setTimeout(() => {
            if (window.LunaresInstance) {
                 window.LunaresInstance.startVoiceCall();
            }
        }, 300);
    }
});
</script>
`;

fullSpa = fullSpa.replace('</body>', `${spaLogic}\n</body>`);

// Write final file
fs.writeFileSync('ai-experiencia.html', fullSpa);
console.log("ai-experiencia.html PERFECTLY rebuilt.");
