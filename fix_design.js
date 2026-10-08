const fs = require('fs');
const path = require('path');

function replaceColors(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            replaceColors(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;
            
            // Reemplazar colores de Elena Atelier por colores nativos de Tailwind / Gaz Style
            content = content.replace(/brand-charcoal/g, 'zinc-900');
            content = content.replace(/brand-sand/g, 'zinc-50');
            content = content.replace(/brand-sage/g, 'emerald-600');
            content = content.replace(/brand-terracotta/g, 'orange-600');
            content = content.replace(/brand-copper/g, 'orange-500');
            content = content.replace(/brand-blush/g, 'orange-50');
            content = content.replace(/brand-pearl/g, 'white');
            content = content.replace(/brand-rose/g, 'red-500');
            content = content.replace(/brand-cream/g, 'zinc-100');
            content = content.replace(/brand-stone/g, 'zinc-400');
            content = content.replace(/brand-dust/g, 'zinc-300');
            content = content.replace(/brand-forest/g, 'emerald-800');
            
            // Reemplazar branding
            content = content.replace(/ELENA OS System/g, 'GAZ STYLE OS');
            content = content.replace(/>ELENA</g, '>GAZ STYLE<');
            content = content.replace(/Elena Atelier/g, 'Gaz Style');
            content = content.replace(/EA v1.0/g, 'GZ v1.0');
            content = content.replace(/"EA"/g, '"GZ"');
            content = content.replace(/>EA</g, '>GZ<');
            
            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated colors in ${fullPath}`);
            }
        }
    }
}

replaceColors(path.join(__dirname, 'src', 'app', 'admin'));
replaceColors(path.join(__dirname, 'src', 'components'));
console.log('Colors replaced!');
