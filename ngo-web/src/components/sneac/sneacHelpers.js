// 🔥 SNEAC — shared helpers used across the admin panel components

export const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export const formatDateLong = (d) =>
  new Date(d).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

// Fields sometimes come back as JSON strings, sometimes already parsed.
export const parseMaybeJSON = (raw) => {
  if (!raw) return [];
  return typeof raw === 'string' ? JSON.parse(raw) : raw;
};

export const getCategories = (reg) => parseMaybeJSON(reg.competition_categories);

// Has every category the school opted into actually been allotted a date?
export const isFullyAllotted = (reg, competitionType) => {
  if (competitionType === 'painting') {
    const categories = getCategories(reg);
    const primaryOk = categories.includes('primary') ? !!reg.primary_allotted_date : true;
    const secondaryOk = categories.includes('secondary') ? !!reg.secondary_allotted_date : true;
    return primaryOk && secondaryOk;
  }
  return !!reg.allotted_date;
};

// Excel Export Helper (.xls XML format for perfect Excel column separation without CSV comma issues)
export const downloadExcel = (filename, headers, rows) => {
  const escapeXML = (val) => {
    if (val === null || val === undefined) return '';
    return String(val)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const headerRowXML = headers
    .map((h) => `<Cell><Data ss:Type="String">${escapeXML(h)}</Data></Cell>`)
    .join('');

  const rowsXML = rows
    .map(
      (r) =>
        `<Row>${r
          .map(
            (cell) =>
              `<Cell><Data ss:Type="${typeof cell === 'number' ? 'Number' : 'String'}">${escapeXML(cell)}</Data></Cell>`
          )
          .join('')}</Row>`
    )
    .join('');

  const excelXML = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="Sheet1">
  <Table>
   <Row>${headerRowXML}</Row>
   ${rowsXML}
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([excelXML], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const xlsFilename = filename.replace(/\.csv$/i, '.xls');
  link.setAttribute('href', url);
  link.setAttribute('download', xlsFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};