const fs = require('fs');
const path = require('path');

const vipPath = path.join(__dirname, 'src', 'app', 'admin', 'pos', 'components', 'VipExpeditionModal.tsx');
let content = fs.readFileSync(vipPath, 'utf8');

// Replace component name
content = content.replace(/HauteCoutureModal/g, 'VipExpeditionModal');

// Terminology
content = content.replace(/Alta Costura/g, 'Expedición VIP');
content = content.replace(/Diseño de Alta Costura/g, 'Ascenso VIP');
content = content.replace(/Costo Estimado de la Tela \(\$\)/g, 'Costo de Permisos/Seguros ($)');
content = content.replace(/Tipo de Tela \/ Complejidad Textil/g, 'Dificultad de la Montaña');
content = content.replace(/Estándar \/ Algodón \/ Mezclas/g, 'Trekking Básico / Terreno Fácil');
content = content.replace(/Delicada \/ Elástica \/ Licra/g, 'Trekking Intermedio / Alta Inclinación');
content = content.replace(/Terciopelo \/ Pelo \/ Estampados/g, 'Alta Montaña / Hielo');
content = content.replace(/Seda \/ Satén \/ Chifón \/ Organza/g, 'Técnico Extremo / Escalada');
content = content.replace(/Alta Costura \/ Encaje Fino \/ Pedrería/g, 'Expedición Internacional / Himalayas');

content = content.replace(/¿Quién Aporta la Tela\?/g, '¿Quién provee Equipo Técnico?');
content = content.replace(/El Cliente \(Aplica seguro de corte\)/g, 'Aventurero (Trae su equipo)');
content = content.replace(/El Campamento Base \(Se incluye en el costo\)/g, 'Gaz Style (Full Arriendo)');

content = content.replace(/Corsetería y Estructura Interna/g, 'Servicios Premium (Guías y Extras)');
content = content.replace(/Entretelado Sastre/g, 'Guía Bilingüe');
content = content.replace(/Forro Fino/g, 'Chef/Alimentación Gourmet');
content = content.replace(/Copas Armadas/g, 'Porteadores de Equipaje');
content = content.replace(/Ballenas \/ Corsé/g, 'Fotógrafo & Drone');

content = content.replace(/Acabados \& Pruebas a Mano/g, 'Logística Avanzada');
content = content.replace(/Ruedo\/Basta a Mano/g, 'Transporte 4x4 Privado');
content = content.replace(/Drapeado a Mano/g, 'Carpas Calefaccionadas');
content = content.replace(/Toile \(Modelo Base\)/g, 'Noche Previa en Lodge');
content = content.replace(/Cant\. Ojales Mano/g, 'Días de Aclimatación');
content = content.replace(/Bordados Mano \(hrs\)/g, 'Entrenamiento Previo (hrs)');

content = content.replace(/Tela \(Costo Campamento Base\)/g, 'Equipo (Arriendo Gaz Style)');
content = content.replace(/Tiempos de Corsetería \(Hrs\)/g, 'Tiempos de Preparación VIP (Hrs)');
content = content.replace(/Tiempos de Acabados a Mano \(Hrs\)/g, 'Tiempos de Logística Avanzada (Hrs)');

fs.writeFileSync(vipPath, content);
console.log('VIP Expedition Modal terminology updated!');
