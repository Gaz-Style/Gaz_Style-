const fs = require('fs');
const path = require('path');

const dirs = [
    'src/app/admin/livechat',
    'src/app/admin/inventory',
    'src/app/admin/sales',
    'src/app/admin/accounting',
    'src/lib/ai',
    'src/app/api/orchestrator'
];

function processDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            content = content.replace(/\bcustomers\b/g, 'adventurers');
            content = content.replace(/\bproduction_orders\b/g, 'bookings');
            content = content.replace(/\bfabric_inventory\b/g, 'gear_inventory');
            content = content.replace(/Elena Atelier/g, 'Gaz Style');
            content = content.replace(/Elena/g, 'Gaz');
            fs.writeFileSync(fullPath, content, 'utf8');
        }
    }
}

dirs.forEach(d => processDir(path.join(__dirname, d)));
console.log('Done replacing terms.');
