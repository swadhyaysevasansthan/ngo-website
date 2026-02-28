// downloadController.js
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// src/controllers -> ../.. = project root
// dbPath is "uploads/<filename>"
const resolveUploadPath = (dbPath) => {
  return path.join(__dirname, '..', '..', dbPath);
};

// Download all submissions as ZIP
export const downloadAllSubmissions = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.file_name,
        s.file_path,
        s.participant_id,
        p.full_name,
        p.category
      FROM submissions s
      JOIN participants p ON s.participant_id = p.participant_id
      ORDER BY s.submission_date ASC
    `);

    const submissions = result.rows;

    if (submissions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No submissions found',
      });
    }

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=SNPC2026_All_Submissions_${Date.now()}.zip`
    );

    const archive = archiver('zip', { zlib: { level: 6 } });

    archive.on('error', (err) => {
      console.error('Archive error:', err);
      // Important: end the response only once
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Failed to create archive',
          error: err.message,
        });
      } else {
        res.end();
      }
    });

    archive.pipe(res);

    // CSV metadata
    let csvContent = 'Participant ID,Name,Category,File Name\n';
    submissions.forEach((sub) => {
      csvContent += `"${sub.participant_id}","${sub.full_name}","${sub.category}","${sub.file_name}"\n`;
    });
    archive.append(csvContent, { name: '_METADATA.csv' });

    // Add image files
    submissions.forEach((sub) => {
      const filePath = resolveUploadPath(sub.file_path);

      if (fs.existsSync(filePath)) {
        const folderName = sub.category;
        const newFileName = `${sub.participant_id}_${sub.category}${path.extname(
          sub.file_name
        )}`;

        archive.file(filePath, { name: `${folderName}/${newFileName}` });
      } else {
        console.warn('File missing for ZIP:', filePath);
      }
    });

    await archive.finalize();
  } catch (error) {
    console.error('Download error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Failed to download submissions',
        error: error.message,
      });
    } else {
      res.end();
    }
  }
};

// Download submissions by category
export const downloadByCategory = async (req, res) => {
  const { category } = req.params;
  const normalized = category.toLowerCase();

  try {
    const result = await pool.query(
      `
      SELECT 
        s.file_name,
        s.file_path,
        s.participant_id,
        p.full_name,
        p.category
      FROM submissions s
      JOIN participants p ON s.participant_id = p.participant_id
      WHERE p.category = $1
      ORDER BY s.submission_date ASC
    `,
      [normalized]
    );

    const submissions = result.rows;

    if (submissions.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No submissions found for category: ${category}`,
      });
    }

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=SNPC2026_${category}_Submissions_${Date.now()}.zip`
    );

    const archive = archiver('zip', { zlib: { level: 6 } });

    archive.on('error', (err) => {
      console.error('Archive error:', err);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Failed to create archive',
          error: err.message,
        });
      } else {
        res.end();
      }
    });

    archive.pipe(res);

    let csvContent = 'Participant ID,Name,File Name\n';
    submissions.forEach((sub) => {
      csvContent += `"${sub.participant_id}","${sub.full_name}","${sub.file_name}"\n`;
    });
    archive.append(csvContent, { name: '_METADATA.csv' });

    submissions.forEach((sub) => {
      const filePath = resolveUploadPath(sub.file_path);

      if (fs.existsSync(filePath)) {
        const newFileName = `${sub.participant_id}_${sub.category}${path.extname(
          sub.file_name
        )}`;
        archive.file(filePath, { name: newFileName });
      } else {
        console.warn('File missing for ZIP:', filePath);
      }
    });

    await archive.finalize();
  } catch (error) {
    console.error('Download error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Failed to download submissions',
        error: error.message,
      });
    } else {
      res.end();
    }
  }
};
