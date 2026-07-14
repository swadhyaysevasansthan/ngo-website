/**
 * Report export builders for Round 1 results.
 * New deps required (added to package.json): exceljs, pdfkit.
 * CSV needs no extra dependency.
 */

const REPORT_COLUMNS = [
  { key: 'entryNumber', label: 'Entry' },
  { key: 'participantId', label: 'Participant ID' },
  { key: 'fullName', label: 'Participant' },
  { key: 'judge1', label: 'Judge 1' },
  { key: 'judge2', label: 'Judge 2' },
  { key: 'judge3', label: 'Judge 3' },
  { key: 'judge4', label: 'Judge 4' },
  { key: 'judge5', label: 'Judge 5' },
  { key: 'total', label: 'Total /25' },
  { key: 'conflict', label: 'Conflict Level' },
  { key: 'status', label: 'Status' },
];

const csvEscape = (value) => {
  const str = value === null || value === undefined ? '' : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const buildResultsCSV = (rows) => {
  const header = REPORT_COLUMNS.map((c) => csvEscape(c.label)).join(',');
  const lines = rows.map((row) =>
    REPORT_COLUMNS.map((c) => csvEscape(row[c.key])).join(',')
  );
  return [header, ...lines].join('\n');
};

export const buildResultsExcel = async (rows) => {
  const ExcelJS = (await import('exceljs')).default;
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Round 1 Results');

  sheet.columns = REPORT_COLUMNS.map((c) => ({
    header: c.label,
    key: c.key,
    width: c.key === 'fullName' ? 28 : 16,
  }));
  sheet.getRow(1).font = { bold: true };

  rows.forEach((row) => sheet.addRow(row));

  return workbook.xlsx.writeBuffer();
};

export const buildResultsPDF = async (rows, { title = 'Round 1 Results' } = {}) => {
  const PDFDocument = (await import('pdfkit')).default;

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(16).text(title, { align: 'center' });
    doc.moveDown();

    const colWidths = [50, 90, 130, 45, 45, 45, 45, 45, 55, 65, 70];
    const startX = doc.page.margins.left;
    let y = doc.y;

    doc.fontSize(9).font('Helvetica-Bold');
    let x = startX;
    REPORT_COLUMNS.forEach((c, i) => {
      doc.text(c.label, x, y, { width: colWidths[i] });
      x += colWidths[i];
    });
    y += 16;
    doc.font('Helvetica');

    rows.forEach((row) => {
      if (y > doc.page.height - doc.page.margins.bottom - 20) {
        doc.addPage();
        y = doc.page.margins.top;
      }
      x = startX;
      REPORT_COLUMNS.forEach((c, i) => {
        doc.text(String(row[c.key] ?? ''), x, y, { width: colWidths[i] });
        x += colWidths[i];
      });
      y += 14;
    });

    doc.end();
  });
};
