import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sheets should be placed in backend/src/assets/sheets/
// Any file extension is fine (.pdf, .xlsx, .docx, etc.) — the loader
// will pick up whatever file is present that matches the base name below.
const SHEETS_DIR = path.join(__dirname, '..', 'assets', 'sheets');

const BASE_NAMES = {
  painting: 'SNEPC 2026-27 Student Information Sheet',
  quiz: 'SNEQC 2026-27 Student Information Sheet',
};

/**
 * Finds the attendance sheet file for a given competition type, regardless
 * of its file extension, by matching the configured base name.
 */
const findSheetFile = (competitionType) => {
  const baseName = BASE_NAMES[competitionType];

  if (!baseName) return null;

  if (!fs.existsSync(SHEETS_DIR)) return null;

  const match = fs
    .readdirSync(SHEETS_DIR)
    .find(
      (file) =>
        path.parse(file).name.toLowerCase() === baseName.toLowerCase()
    );

  return match ? path.join(SHEETS_DIR, match) : null;
};

/**
 * Returns a Resend-compatible attachment object for the "Student
 * Information & Attendance Sheet" matching the given competition type
 * ('painting' | 'quiz'), or null if no sheet file is found.
 */
export const getAttendanceSheetAttachment = (competitionType) => {
  try {
    const filePath = findSheetFile(competitionType);

    if (!filePath) {
      console.warn(
        `Attendance sheet not found for competition type "${competitionType}" in ${SHEETS_DIR}`
      );
      return null;
    }

    const content = fs.readFileSync(filePath).toString('base64');
    const filename = path.basename(filePath);

    return { filename, content };
  } catch (err) {
    console.error('Failed to load attendance sheet:', err);
    return null;
  }
};