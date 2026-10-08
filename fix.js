const fs = require('fs');
const files = [
    'src/app/admin/sales/[id]/page.tsx',
    'src/app/admin/sales/page.tsx',
    'src/app/admin/crm/[id]/correo/page.tsx',
    'src/app/admin/accounting/ledger/page.tsx',
    'src/app/admin/accounting/page.tsx',
    'src/app/admin/accounting/results/page.tsx'
];

files.forEach(f => {
    const fullPath = f.replace(/\//g, '\\');
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        content = content.replace(/import Navbar from '@\/components\/Navbar';\r?\n?/g, '');
        content = content.replace(/<Navbar \/>\r?\n?/g, '');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Fixed ${f}`);
    } else {
        console.log(`File not found: ${fullPath}`);
    }
});
