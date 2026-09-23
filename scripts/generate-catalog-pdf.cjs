const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const courses = [
  // INTELIGENCIA ARTIFICIAL
  { cat: "INTELIGENCIA ARTIFICIAL", title: "Introducción a ChatGPT, Gemini, Copilot, Claude y herramientas de IA", hours: "15 horas", price: "110€" },
  { cat: "INTELIGENCIA ARTIFICIAL", title: "Claude Code: automatización con IA sin código", hours: "25 horas", price: "249€" },
  // MARKETING / VENTAS
  { cat: "MARKETING / VENTAS", title: "GEO: posicionamiento en buscadores basados en IA generativa", hours: "15 horas", price: "110€" },
  { cat: "MARKETING / VENTAS", title: "Instagram: optimización y visibilidad de tu marca", hours: "20 horas", price: "150€" },
  { cat: "MARKETING / VENTAS", title: "Branding con IA: estrategia, creatividad y automatización", hours: "20 horas", price: "150€" },
  { cat: "MARKETING / VENTAS", title: "Branding: gestión y desarrollo de una marca", hours: "25 horas", price: "175€" },
  { cat: "MARKETING / VENTAS", title: "SEO y posicionamiento web", hours: "30 horas", price: "210€" },
  { cat: "MARKETING / VENTAS", title: "Community Manager: gestión estratégica y análisis de comunidades", hours: "40 horas", price: "300€" },
  // VIDEO E IMAGEN
  { cat: "VIDEO E IMAGEN", title: "Creación de imágenes profesionales con IA", hours: "15 horas", price: "110€" },
  { cat: "VIDEO E IMAGEN", title: "Creación de contenido audiovisual con IA generativa", hours: "30 horas", price: "210€" },
  // DISEÑO GRÁFICO Y WEB
  { cat: "DISEÑO GRÁFICO Y WEB", title: "Canva: crea materiales gráficos", hours: "30 horas", price: "210€" },
  // PRL
  { cat: "PREVENCIÓN DE RIESGOS LABORALES", title: "PRL Básico — Sector Peluquería", hours: "30 horas", price: "99€" },
  { cat: "PREVENCIÓN DE RIESGOS LABORALES", title: "PRL Peluquería y Estética", hours: "75 horas", price: "420€" },
  // MICROPIGMENTACIÓN
  { cat: "MICROPIGMENTACIÓN", title: "Micropigmentación de Cejas", hours: "20 horas", price: "750€" },
  { cat: "MICROPIGMENTACIÓN", title: "Micropigmentación de Labios", hours: "20 horas", price: "750€" },
  { cat: "MICROPIGMENTACIÓN", title: "Micropigmentación de Areolas", hours: "20 horas", price: "750€" },
  { cat: "MICROPIGMENTACIÓN", title: "Micropigmentación de Ojos", hours: "20 horas", price: "750€" },
  { cat: "MICROPIGMENTACIÓN", title: "Microblading", hours: "20 horas", price: "750€" },
  { cat: "MICROPIGMENTACIÓN", title: "Tricopigmentación", hours: "20 horas", price: "1.100€" },
  { cat: "MICROPIGMENTACIÓN", title: "Micropigmentación (curso completo)", hours: "50 horas", price: "2.300€" },
  // CEJAS Y PESTAÑAS
  { cat: "CEJAS Y PESTAÑAS", title: "Depilación y Diseño de Cejas", hours: "20 horas", price: "49€" },
  { cat: "CEJAS Y PESTAÑAS", title: "Depilación con Hilo", hours: "20 horas", price: "49€" },
  { cat: "CEJAS Y PESTAÑAS", title: "Laminado de Cejas y Tinte con Henna", hours: "20 horas", price: "49€" },
  { cat: "CEJAS Y PESTAÑAS", title: "Planchado de Cejas y Tinte con Henna", hours: "20 horas", price: "49€" },
  { cat: "CEJAS Y PESTAÑAS", title: "Lifting de Pestañas", hours: "20 horas", price: "49€" },
  { cat: "CEJAS Y PESTAÑAS", title: "Rizado y Tinte de Pestañas", hours: "20 horas", price: "49€" },
  { cat: "CEJAS Y PESTAÑAS", title: "Extensión de Pestañas: Técnica Clásica + Volumen", hours: "40 horas", price: "159€" },
  { cat: "CEJAS Y PESTAÑAS", title: "Curso Profesional de Cejas y Pestañas", hours: "60 horas", price: "699€" },
  { cat: "CEJAS Y PESTAÑAS", title: "Curso Profesional Cejas y Pestañas + Clases en vivo", hours: "60 horas", price: "999€" },
  // UÑAS
  { cat: "UÑAS", title: "Decoración de Uñas Básica", hours: "20 horas", price: "49€" },
  { cat: "UÑAS", title: "Decoración de Uñas 3D", hours: "20 horas", price: "49€" },
  { cat: "UÑAS", title: "Uñas de Gel", hours: "20 horas", price: "49€" },
  { cat: "UÑAS", title: "Uñas Acrílicas", hours: "20 horas", price: "49€" },
  { cat: "UÑAS", title: "Uñas Acrigel", hours: "20 horas", price: "49€" },
  { cat: "UÑAS", title: "Reconstrucción de Uñas Mordidas", hours: "20 horas", price: "49€" },
  { cat: "UÑAS", title: "Uso del Torno para Uñas", hours: "20 horas", price: "49€" },
  { cat: "UÑAS", title: "Decoración de Uñas Básica y Avanzada", hours: "40 horas", price: "99€" },
  { cat: "UÑAS", title: "Manicura y Pedicura Profesional", hours: "90 horas", price: "349€" },
  { cat: "UÑAS", title: "Curso Profesional de Uñas Esmera", hours: "200 horas", price: "599€" },
  { cat: "UÑAS", title: "Curso Profesional de Uñas + Clases en vivo", hours: "200 horas", price: "1.199€" },
];

const BRAND = "#75bcb1";
const DARK  = "#1a2332";
const GRAY  = "#6b7280";
const LIGHT = "#f0faf8";

const doc = new PDFDocument({ margin: 0, size: "A4" });
const out = path.join(__dirname, "../public/catalogo-cursos-esmera.pdf");
doc.pipe(fs.createWriteStream(out));

const W = 595.28;
const H = 841.89;
const M = 40;
const COL_HOURS = 110;
const COL_PRICE = 70;
const ROW_H = 22;

// ── HEADER ──────────────────────────────────────────────────────────────────
doc.rect(0, 0, W, 90).fill(BRAND);
doc.fillColor("white")
   .font("Helvetica-Bold").fontSize(22)
   .text("ESMERA ONLINE", M, 22);
doc.font("Helvetica").fontSize(11)
   .text("Catálogo de formación online", M, 50);
doc.font("Helvetica").fontSize(9)
   .text("www.esmeraonline.com", W - M - 130, 50)
   .text("sistemas@esmeraschool.com", W - M - 130, 63);

// ── SUBTITLE ─────────────────────────────────────────────────────────────────
doc.fillColor(DARK).font("Helvetica").fontSize(8.5)
   .text(`Todos los cursos incluyen diploma privado · Acceso online · 90 días para completar`,
         M, 98, { width: W - M * 2, align: "center" });

// ── TABLE ────────────────────────────────────────────────────────────────────
let y = 116;
let currentCat = "";

const colTitle = M;
const colHours = W - M - COL_PRICE - COL_HOURS - 10;
const colPrice = W - M - COL_PRICE;
const tableW   = W - M * 2;

for (const course of courses) {
  // category header
  if (course.cat !== currentCat) {
    currentCat = course.cat;
    if (y + 36 > H - 30) { doc.addPage(); y = M; }
    y += 6;
    doc.rect(M, y, tableW, 20).fill(BRAND);
    doc.fillColor("white").font("Helvetica-Bold").fontSize(8.5)
       .text(currentCat, M + 8, y + 6, { width: tableW - 16 });
    y += 20;
  }

  // row bg alternate
  if (y + ROW_H > H - 30) { doc.addPage(); y = M; }
  const rowIdx = courses.indexOf(course);
  if (rowIdx % 2 === 0) doc.rect(M, y, tableW, ROW_H).fill("#f9fafb");

  // title
  doc.fillColor(DARK).font("Helvetica").fontSize(8)
     .text(course.title, colTitle + 6, y + 7, { width: colHours - colTitle - 10, ellipsis: true, lineBreak: false });

  // hours
  doc.fillColor(GRAY).font("Helvetica").fontSize(8)
     .text(course.hours, colHours, y + 7, { width: COL_HOURS, align: "center", lineBreak: false });

  // price
  doc.fillColor(BRAND).font("Helvetica-Bold").fontSize(8.5)
     .text(course.price, colPrice, y + 7, { width: COL_PRICE, align: "right", lineBreak: false });

  // divider
  doc.moveTo(M, y + ROW_H).lineTo(M + tableW, y + ROW_H).strokeColor("#e5e7eb").lineWidth(0.4).stroke();

  y += ROW_H;
}

// ── FOOTER ───────────────────────────────────────────────────────────────────
const pages = doc.bufferedPageRange ? doc.bufferedPageRange().count : 1;
doc.fillColor(GRAY).font("Helvetica").fontSize(7.5)
   .text("© 2026 Esmera Online · Precios sin IVA · Sujetos a cambios sin previo aviso",
         M, H - 22, { width: W - M * 2, align: "center" });

doc.end();
console.log("PDF generado en:", out);
