import pool from '../config/database.js';
import { sendEmail } from '../config/email.js';
import { submissionEmailTemplate } from '../utils/emailTemplates.js';
import sharp from 'sharp';
import fs from 'fs';

export const submitPhoto = async (req, res) => {
  const {
    participantId,
    captureLocation,
    captureDate,
    cameraModel,
  } = req.body;

  try {
    const participantResult = await pool.query(
      'SELECT * FROM participants WHERE participant_id = $1',
      [participantId]
    );

    if (participantResult.rows.length === 0) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: 'Participant not found. Please register first.',
      });
    }

    const participant = participantResult.rows[0];

    const existingSubmission = await pool.query(
      'SELECT * FROM submissions WHERE participant_id = $1',
      [participantId]
    );

    if (existingSubmission.rows.length > 0) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message:
          'You have already submitted a photograph. Only one submission per participant is allowed.',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a photograph.',
      });
    }

    const allowedTypes = ['image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Only JPG/JPEG images are allowed.',
      });
    }

    const maxSize = 5 * 1024 * 1024;
    if (req.file.size > maxSize) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'File size must be under 5 MB.',
      });
    }

    const minDate = new Date('2025-09-01');
    const submittedDate = new Date(captureDate);
    if (Number.isNaN(submittedDate.getTime()) || submittedDate < minDate) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Capture date must be on or after 1st September 2025.',
      });
    }

    const metadata = await sharp(req.file.path).metadata();
    const { width, height } = metadata;

    const longerSide = Math.max(width, height);
    if (longerSide > 1920) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message:
          'Image dimensions too large. Please resize so the longer side is at most 1920px.',
      });
    }

    // Store relative path rooted at /uploads
    const relativePath = `uploads/${req.file.filename}`;

    const result = await pool.query(
      `INSERT INTO submissions 
       (participant_id, capture_location, capture_date,
        camera_model, file_name, file_path, file_size, image_width, image_height) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [
        participantId,
        captureLocation,
        submittedDate,
        cameraModel,
        req.file.filename,
        relativePath,          // <--- was req.file.path
        req.file.size,
        width,
        height,
      ]
    );

    const submission = result.rows[0];

    const emailTemplate = submissionEmailTemplate({
      fullName: participant.full_name,
      participantId,
      category: participant.category,
      submissionDate: submission.submission_date,
    });

    const emailResult = await sendEmail({
      to: participant.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    });

    await pool.query(
      `INSERT INTO email_logs 
       (participant_id, email_type, recipient_email, subject, status, error_message) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        participantId,
        'submission',
        participant.email,
        emailTemplate.subject,
        emailResult.success ? 'sent' : 'failed',
        emailResult.error || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Photograph submitted successfully! Confirmation email sent.',
      data: {
        submissionId: submission.id,
        participantId,
        submissionDate: submission.submission_date,
      },
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    console.error('Submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Submission failed. Please try again.',
      error: error.message,
    });
  }
};

/**
 * Get submission by participant ID
 */
export const getSubmissionByParticipant = async (req, res) => {
  const { participantId } = req.params;

  try {
    const result = await pool.query(
      `SELECT s.*, p.full_name, p.email, p.category 
       FROM submissions s
       JOIN participants p ON s.participant_id = p.participant_id
       WHERE s.participant_id = $1`,
      [participantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No submission found for this participant',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submission',
      error: error.message,
    });
  }
};
