import { jsPDF } from 'jspdf';
import { CRITERIA, CATEGORIES } from './criteria';

/**
 * Export a completed assessment as a PDF.
 * @param {string} studentName
 * @param {Record<string, number>} selfGrades
 * @param {Record<string, number>} coachGrades
 */
export function exportPdf(studentName, selfGrades, coachGrades) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const marginL = 15;
  const marginR = 15;
  const marginBottom = 20;
  const contentW = pageW - marginL - marginR;
  let y = 20;

  function checkPageBreak(neededHeight) {
    if (y + neededHeight > pageH - marginBottom) {
      doc.addPage();
      y = 20;
    }
  }

  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Beurteilungsbogen', pageW / 2, y, { align: 'center' });
  y += 10;

  // Student name
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Auszubildende/r: ${studentName}`, marginL, y);
  y += 6;

  // Date
  const dateStr = new Date().toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  doc.text(`Datum: ${dateStr}`, marginL, y);
  y += 10;

  // Table header
  const colSelf = contentW * 0.55;
  const colCoach = contentW * 0.75;

  doc.setFillColor(50, 80, 140);
  doc.rect(marginL, y, contentW, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Kriterium', marginL + 2, y + 5.5);
  doc.text('Selbsteinschätzung', marginL + colSelf + 2, y + 5.5);
  doc.text('Coach-Bewertung', marginL + colCoach + 2, y + 5.5);
  y += 8;
  doc.setTextColor(0, 0, 0);

  CATEGORIES.forEach((category) => {
    const criteria = CRITERIA.filter((c) => c.category === category);

    // Category row
    checkPageBreak(7);
    doc.setFillColor(220, 230, 245);
    doc.rect(marginL, y, contentW, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(category, marginL + 2, y + 5);
    y += 7;

    // Criteria rows
    criteria.forEach((c, i) => {
      const rowH = 9;
      checkPageBreak(rowH);
      const fillColor = i % 2 === 0 ? [255, 255, 255] : [245, 248, 255];
      doc.setFillColor(...fillColor);
      doc.rect(marginL, y, contentW, rowH, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(c.label, marginL + 4, y + 6);
      const selfLabel = selfGrades[c.id] ? String(selfGrades[c.id]) : '–';
      const coachLabel = coachGrades[c.id] ? String(coachGrades[c.id]) : '–';
      doc.text(selfLabel, marginL + colSelf + 4, y + 6);
      doc.text(coachLabel, marginL + colCoach + 4, y + 6);
      y += rowH;
    });

    y += 3;
  });

  checkPageBreak(12);
  y += 4;
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(
    'Notenskala: 1 = Sehr gut | 2 = Gut | 3 = Befriedigend | 4 = Ausreichend | 5 = Mangelhaft | 6 = Ungenügend',
    pageW / 2,
    y,
    { align: 'center' }
  );

  const safeName = studentName.replace(/[/\\:*?"<>|]/g, '').replace(/\s+/g, '_').slice(0, 80);
  const fileName = `Beurteilungsbogen_${safeName}.pdf`;
  doc.save(fileName);
}
