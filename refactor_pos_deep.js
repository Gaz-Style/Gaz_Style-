const fs = require('fs');
const path = require('path');

const posDir = path.join(__dirname, 'src', 'app', 'admin', 'pos', 'components');

// 1. Rewrite WizardHeader.tsx to use Trekking terms
const wizardHeaderPath = path.join(posDir, 'WizardHeader.tsx');
let headerContent = fs.readFileSync(wizardHeaderPath, 'utf8');
headerContent = headerContent.replace(/Producción/g, 'Fechas');
headerContent = headerContent.replace(/Expedición/g, 'Fechas'); // in case it was already replaced
fs.writeFileSync(wizardHeaderPath, headerContent);

// 2. Rewrite Step3Production.tsx deeply
const step3Path = path.join(posDir, 'Step3Production.tsx');
let step3Content = fs.readFileSync(step3Path, 'utf8');
step3Content = step3Content.replace(/Gobernanza de Campamento Base/g, 'Planificación de la Expedición');
step3Content = step3Content.replace(/Asigna guías y define la fecha de entrega de la orden\./g, 'Asigna guías titulares y define la fecha de inicio del trekking.');
step3Content = step3Content.replace(/Fecha de Entrega Estimada/g, 'Fecha de Inicio Sugerida');
step3Content = step3Content.replace(/Fecha límite acordada/g, 'Fecha de Expedición Acordada');
step3Content = step3Content.replace(/finalDeliveryDate/g, 'finalDeliveryDate'); // keep variable names same so it doesn't break
step3Content = step3Content.replace(/El campamento_base presenta sobrecarga de trabajo/g, 'El equipo de guías no tiene capacidad para esta fecha.');
step3Content = step3Content.replace(/Sobrecarga de Campamento Base/g, 'Guía Sin Disponibilidad');
fs.writeFileSync(step3Path, step3Content);

// 3. Rename HauteCouture to VipExpedition in Step2Cart
const step2Path = path.join(posDir, 'Step2Cart.tsx');
let step2Content = fs.readFileSync(step2Path, 'utf8');
step2Content = step2Content.replace(/HauteCoutureModal/g, 'VipExpeditionModal');
step2Content = step2Content.replace(/Alta Costura/g, 'Trekking VIP');
fs.writeFileSync(step2Path, step2Content);

console.log('Deep refactoring applied!');
