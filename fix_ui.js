const fs = require('fs');
const path = require('path');

// 1. Fix Catalog (Rutas & Expediciones)
const catalogPath = path.join(__dirname, 'src', 'app', 'admin', 'catalog', 'page.tsx');
let catalog = fs.readFileSync(catalogPath, 'utf8');

// Replace Tailoring -> Trekking texts
catalog = catalog.replace(/Catálogo Maestro/g, 'Creador de Rutas & Expediciones');
catalog = catalog.replace(/Basta Original de Jeans \(Conservación de Ruedo\)/g, 'Trekking Valle del Cóndor (Día Completo)');
catalog = catalog.replace(/Basta Invisible a Mano en Pantalón de Vestir/g, 'Ascenso Glaciar Base (Con Equipo)');
catalog = catalog.replace(/Acortar Mangas desde el Puño \(Blazer con Forro\)/g, 'Ruta Lagunas Escondidas (4x4 + Trekking)');
catalog = catalog.replace(/Achicar Cintura en Pretina de Pantalón \/ Jeans/g, 'Expedición Cumbre Volcán (2 Días)');
catalog = catalog.replace(/Entalle de Expedicións de Fiesta \(Costados y Pinzas\)/g, 'Aventura Familiar Bosque Nativo');
catalog = catalog.replace(/Cambio de Cierre en Parkas \/ Chaqueta de Pluma/g, 'Trekking Fotográfico Amanecer');
catalog = catalog.replace(/Jeans \& Denim/g, 'Trekking Clásico');
catalog = catalog.replace(/Pantalones/g, 'Alta Montaña');
catalog = catalog.replace(/Chaquetas \& Blazers/g, 'Mixto (Trekking + 4x4)');
catalog = catalog.replace(/Expedicións \& Gala/g, 'Familiar');
catalog = catalog.replace(/Abrigos \& Cuero/g, 'Especialidad');
catalog = catalog.replace(/<Scissors /g, '<Compass ');

// Force Dark Mode colors in Catalog
catalog = catalog.replace(/bg-gray-50/g, 'bg-[#0f1115]');
catalog = catalog.replace(/bg-white/g, 'bg-[#161b22]');
catalog = catalog.replace(/text-zinc-900/g, 'text-zinc-100');
catalog = catalog.replace(/border-gray-200/g, 'border-white/10');
catalog = catalog.replace(/border-gray-100/g, 'border-white/5');
catalog = catalog.replace(/text-gray-400/g, 'text-zinc-400');
catalog = catalog.replace(/text-gray-500/g, 'text-zinc-400');
catalog = catalog.replace(/text-gray-300/g, 'text-zinc-500');
catalog = catalog.replace(/bg-zinc-900/g, 'bg-[#C17F5F]'); // Primary buttons
catalog = catalog.replace(/hover:bg-orange-600/g, 'hover:bg-[#a96e51]');
catalog = catalog.replace(/text-orange-600/g, 'text-[#C17F5F]');
catalog = catalog.replace(/bg-orange-600\/10/g, 'bg-[#C17F5F]/10');
catalog = catalog.replace(/border-orange-600\/40/g, 'border-[#C17F5F]/40');
catalog = catalog.replace(/focus:ring-orange-600/g, 'focus:ring-[#C17F5F]');

// Add Compass icon import if missing
if (!catalog.includes('Compass')) {
    catalog = catalog.replace(/Scissors, /g, 'Compass, ');
}

fs.writeFileSync(catalogPath, catalog);

// 2. Fix Step1Customer (Aventurero)
const step1Path = path.join(__dirname, 'src', 'app', 'admin', 'pos', 'components', 'Step1Customer.tsx');
let step1 = fs.readFileSync(step1Path, 'utf8');

step1 = step1.replace(/Identificación del Cliente/g, 'Identificación del Aventurero');
step1 = step1.replace(/Selecciona o registra al cliente para iniciar la orden/g, 'Selecciona o registra al aventurero para iniciar la expedición');
step1 = step1.replace(/Cambiar Cliente/g, 'Cambiar Aventurero');
step1 = step1.replace(/Nuevo Cliente/g, 'Nuevo Aventurero');
step1 = step1.replace(/Crear ficha de cliente nuevo/g, 'Crear ficha de aventurero');
step1 = step1.replace(/Registrar Nuevo Cliente/g, 'Registrar Nuevo Aventurero');
step1 = step1.replace(/crear cliente/g, 'crear aventurero');
step1 = step1.replace(/Clientes Registrados/g, 'Aventureros Registrados');

fs.writeFileSync(step1Path, step1);

console.log('UI Fixes Applied: Catalog -> Rutas & Step1 -> Aventurero');
