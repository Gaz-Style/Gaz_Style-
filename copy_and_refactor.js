const fs = require('fs');
const path = require('path');

const srcDir = 'c:\\Users\\ADMIN\\Downloads\\IA trabajaos\\Elena Atalier\\src';
const destDir = 'c:\\Users\\ADMIN\\Downloads\\IA trabajaos\\gaz_style\\src';

function copyDir(src, dest) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        // Skip root files that conflict with the landing page
        if (srcPath === path.join(srcDir, 'app', 'page.tsx')) continue;
        if (srcPath === path.join(srcDir, 'app', 'layout.tsx')) continue;
        if (srcPath === path.join(srcDir, 'app', 'globals.css')) continue;

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

console.log('Copying files...');
copyDir(srcDir, destDir);
console.log('Copy complete.');

// Now replace terms
function replaceTerms(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
            replaceTerms(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js') || fullPath.endsWith('.json')) {
            try {
                let content = fs.readFileSync(fullPath, 'utf8');
                let original = content;
                
                // Database tables
                content = content.replace(/\bcustomers\b/g, 'adventurers');
                content = content.replace(/\bproduction_orders\b/g, 'bookings');
                content = content.replace(/\bfabric_inventory\b/g, 'gear_inventory');
                
                // Terminology
                content = content.replace(/Elena Atelier/g, 'Gaz Style');
                content = content.replace(/Elena la costurera/g, 'Gaz el guía');
                content = content.replace(/Elena/g, 'Gaz');
                content = content.replace(/elena-atelier/g, 'gaz-style');
                content = content.replace(/Novia/g, 'Aventurero');
                content = content.replace(/novia/g, 'aventurero');
                content = content.replace(/Vestido/g, 'Expedición');
                content = content.replace(/vestido/g, 'expedición');
                content = content.replace(/Costurera/g, 'Guía');
                content = content.replace(/costurera/g, 'guía');
                content = content.replace(/Prueba de Vestido/g, 'Briefing de Ruta');
                content = content.replace(/Taller/g, 'Campamento Base');
                content = content.replace(/taller/g, 'campamento_base');

                // Specifically replace the import of Navbar that caused issues before
                content = content.replace(/import Navbar from '@\/components\/Navbar';\r?\n?/g, '');
                content = content.replace(/<Navbar \/>\r?\n?/g, '');

                if (content !== original) {
                    fs.writeFileSync(fullPath, content, 'utf8');
                }
            } catch (e) {
                console.log(`Failed processing ${fullPath}`);
            }
        }
    }
}

console.log('Replacing terms...');
replaceTerms(destDir);
console.log('Refactoring complete.');
