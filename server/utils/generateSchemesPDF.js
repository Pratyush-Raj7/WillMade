const PDFDocument = require('pdfkit');

const generateSchemesPDF = (reportData, res) => {
  const { applicant, summary, eligibleSchemes, nearMisses } = reportData;

  const doc = new PDFDocument({ margin: 50 });

  // Set response headers for PDF download
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="schemes-${applicant.name.replace(/\s+/g, '-')}.pdf"`);
  doc.pipe(res);

  // ── HEADER ──
  doc.rect(0, 0, doc.page.width, 80).fill('#1A3C6E');
  doc.fillColor('white').fontSize(20).font('Helvetica-Bold')
    .text('Nyaya Mitra — Government Scheme Report', 50, 25);
  doc.fontSize(11).font('Helvetica')
    .text('Karnataka Scheme Eligibility Checker', 50, 52);

  doc.moveDown(3);

  // ── APPLICANT DETAILS ──
  doc.fillColor('#1A3C6E').fontSize(14).font('Helvetica-Bold')
    .text('Applicant Details', 50, 100);
  doc.moveTo(50, 117).lineTo(545, 117).strokeColor('#1A3C6E').stroke();

  doc.fillColor('#333333').fontSize(11).font('Helvetica')
    .text(`Name      : ${applicant.name}`, 50, 125)
    .text(`Age         : ${applicant.age} years`, 50, 142)
    .text(`District    : ${applicant.district}`, 50, 159)
    .text(`Date         : ${new Date().toLocaleDateString('en-IN')}`, 50, 176);

  doc.moveDown(1);

  // ── SUMMARY BOX ──
  doc.rect(50, 205, 495, 60).fill('#EFF6FF');
  doc.fillColor('#1A3C6E').fontSize(12).font('Helvetica-Bold')
    .text('Summary', 65, 215);
  doc.fillColor('#333333').fontSize(11).font('Helvetica')
    .text(`Total Schemes Checked: ${summary.totalChecked}`, 65, 232)
    .text(`Eligible: ${summary.totalEligible}     Near Misses: ${summary.totalNearMisses}`, 65, 249);

  doc.moveDown(4);

  // ── ELIGIBLE SCHEMES ──
  doc.fillColor('#1B7A3E').fontSize(14).font('Helvetica-Bold')
    .text(`✅ Eligible Schemes (${summary.totalEligible})`, 50, 280);
  doc.moveTo(50, 297).lineTo(545, 297).strokeColor('#1B7A3E').stroke();

  let y = 310;

  if (eligibleSchemes.length === 0) {
    doc.fillColor('#666666').fontSize(11).font('Helvetica')
      .text('No eligible schemes found based on provided details.', 50, y);
    y += 30;
  }

  for (const scheme of eligibleSchemes) {
    // Check if we need a new page
    if (y > 680) { doc.addPage(); y = 50; }

    // Scheme name box
    doc.rect(50, y, 495, 24).fill('#D1FAE5');
    doc.fillColor('#1B7A3E').fontSize(12).font('Helvetica-Bold')
      .text(scheme.name, 58, y + 6);
    y += 30;

    // Category & description
    doc.fillColor('#555555').fontSize(10).font('Helvetica')
      .text(`Category: ${scheme.category}`, 58, y);
    y += 15;
    doc.fillColor('#333333').fontSize(10).font('Helvetica')
      .text(scheme.description, 58, y, { width: 480 });
    y += 25;

    // Matched criteria
    doc.fillColor('#1B7A3E').fontSize(10).font('Helvetica-Bold')
      .text('Why you qualify:', 58, y);
    y += 14;
    for (const criteria of scheme.matchedCriteria) {
      if (y > 700) { doc.addPage(); y = 50; }
      doc.fillColor('#333333').fontSize(10).font('Helvetica')
        .text(`  ✔ ${criteria}`, 58, y);
      y += 13;
    }
    y += 5;

    // Documents needed
    doc.fillColor('#1A3C6E').fontSize(10).font('Helvetica-Bold')
      .text('Documents Required:', 58, y);
    y += 14;
    for (const doc_ of scheme.documents) {
      if (y > 700) { doc.addPage(); y = 50; }
      doc.fillColor('#333333').fontSize(10).font('Helvetica')
        .text(`  • ${doc_}`, 58, y);
      y += 13;
    }
    y += 5;

    // Apply link & office
    if (y > 700) { doc.addPage(); y = 50; }
    doc.fillColor('#1A3C6E').fontSize(10).font('Helvetica-Bold')
      .text('Where to Apply:', 58, y);
    doc.fillColor('#333333').fontSize(10).font('Helvetica')
      .text(scheme.office, 160, y);
    y += 15;
    doc.fillColor('#1A3C6E').fontSize(10).font('Helvetica')
      .text(`Apply Online: ${scheme.applyLink}`, 58, y);
    y += 25;

    // Divider
    doc.moveTo(50, y).lineTo(545, y).strokeColor('#E5E7EB').stroke();
    y += 15;
  }

  // ── NEAR MISSES ──
  if (nearMisses.length > 0) {
    if (y > 620) { doc.addPage(); y = 50; }

    y += 10;
    doc.fillColor('#F59E0B').fontSize(14).font('Helvetica-Bold')
      .text(`⚠️ Near Misses — Almost Eligible (${nearMisses.length})`, 50, y);
    doc.moveTo(50, y + 18).lineTo(545, y + 18).strokeColor('#F59E0B').stroke();
    y += 30;

    for (const scheme of nearMisses) {
      if (y > 680) { doc.addPage(); y = 50; }

      doc.rect(50, y, 495, 24).fill('#FEF3C7');
      doc.fillColor('#92400E').fontSize(12).font('Helvetica-Bold')
        .text(scheme.name, 58, y + 6);
      y += 30;

      doc.fillColor('#555555').fontSize(10).font('Helvetica')
        .text(`Category: ${scheme.category}`, 58, y);
      y += 15;

      doc.fillColor('#1B7A3E').fontSize(10).font('Helvetica-Bold')
        .text('Criteria matched:', 58, y);
      y += 14;
      for (const criteria of scheme.matchedCriteria) {
        if (y > 700) { doc.addPage(); y = 50; }
        doc.fillColor('#333333').fontSize(10).font('Helvetica')
          .text(`  ✔ ${criteria}`, 58, y);
        y += 13;
      }
      y += 5;

      doc.fillColor('#DC2626').fontSize(10).font('Helvetica-Bold')
        .text('What you need to qualify:', 58, y);
      y += 14;
      doc.fillColor('#333333').fontSize(10).font('Helvetica')
        .text(`  ❌ ${scheme.toQualify}`, 58, y);
      y += 25;

      doc.moveTo(50, y).lineTo(545, y).strokeColor('#E5E7EB').stroke();
      y += 15;
    }
  }

  // ── FOOTER ──
  doc.rect(0, doc.page.height - 50, doc.page.width, 50).fill('#1A3C6E');
  doc.fillColor('white').fontSize(9).font('Helvetica')
    .text('Generated by Nyaya Mitra | This is informational only. Visit official websites to apply.', 50, doc.page.height - 32);

  doc.end();
};

module.exports = generateSchemesPDF;