const fs = require('fs');
const path = require('path');

function forceDarkModeAndTrekkingTerms(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            forceDarkModeAndTrekkingTerms(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;
            
            // Dark mode overrides for POS components
            content = content.replace(/bg-white/g, 'bg-[#161b22]');
            content = content.replace(/bg-zinc-50/g, 'bg-[#0f1115]');
            content = content.replace(/bg-zinc-100/g, 'bg-white/5');
            content = content.replace(/bg-zinc-200/g, 'bg-white/10');
            content = content.replace(/border-zinc-200/g, 'border-white/10');
            content = content.replace(/border-zinc-100/g, 'border-white/5');
            content = content.replace(/text-zinc-900/g, 'text-white');
            content = content.replace(/text-zinc-800/g, 'text-zinc-100');
            content = content.replace(/text-zinc-700/g, 'text-zinc-300');
            content = content.replace(/text-zinc-600/g, 'text-zinc-400');
            content = content.replace(/text-zinc-500/g, 'text-zinc-500');
            
            // Trekking terminology fixes
            content = content.replace(/Producción/g, 'Expedición');
            content = content.replace(/producción/g, 'expedición');
            content = content.replace(/Operario/g, 'Guía');
            content = content.replace(/operario/g, 'guía');
            content = content.replace(/Asignar Guía/g, 'Asignar Guía Titular');
            content = content.replace(/Fechas de Expedición/g, 'Fechas de Ascenso');
            
            // Fix WizardContent background
            content = content.replace(/bg-\[\#0f1115\]\/50/g, 'bg-transparent');

            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Forced Dark Mode in ${fullPath}`);
            }
        }
    }
}

const posDir = path.join(__dirname, 'src', 'app', 'admin', 'pos', 'components');
forceDarkModeAndTrekkingTerms(posDir);
console.log('POS Dark Mode and Trekking Adaptation complete.');
