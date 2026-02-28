import crypto from 'crypto';
import razorpay from '../config/razorpay.js';
import pool from '../config/database.js';
import { sendEmail } from '../config/email.js';
import { registrationEmailTemplate } from '../utils/emailTemplates.js';

// 1) Create an order for registration
export const createRegistrationOrder = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      dateOfBirth,
      age,
      gender,
      city,
      state,
      collegeName,
      course,
      yearOfStudy,
      category,
      declarationAccepted,
    } = req.body;

    if (!fullName || !email || !category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required registration fields',
      });
    }

    const amount = Number(process.env.REGISTRATION_AMOUNT || 19900);
    const currency = 'INR';

    const options = {
      amount,
      currency,
      receipt: `SNPC2026_${Date.now()}`,
      notes: {
        fullName,
        email,
        phone,
        dateOfBirth,
        age,
        gender,
        city,
        state,
        collegeName,
        course,
        yearOfStudy,
        category,
        declarationAccepted,
      },
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      registration: {
        fullName,
        email,
        phone,
        dateOfBirth,
        age,
        gender,
        city,
        state,
        collegeName,
        course,
        yearOfStudy,
        category,
        declarationAccepted,
      },
    });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
    });
  }
};

// 2) Verify payment and create participant + unique ID
export const verifyRegistrationPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      registration,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment details',
      });
    }

    // Verify signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.error('Signature mismatch:', {
        expectedSignature,
        razorpay_signature,
      });
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Generate unique participant ID
      const rawId = crypto.randomBytes(4).toString('hex').toUpperCase();
      const participantId = `SNPC2026-${rawId}`;

      const insertParticipant = `
        INSERT INTO participants
          (participant_id,
           full_name,
           email,
           phone,
           date_of_birth,
           age,
           gender,
           college_name,
           course,
           year_of_study,
           city,
           state,
           category,
           payment_status,
           payment_id,
           declaration_accepted,
           has_submitted)
        VALUES
          ($1, $2, $3, $4, $5, $6,
           $7, $8, $9, $10, $11, $12,
           $13, $14, $15, $16, $17)
        RETURNING *;
      `;

      const participantRes = await client.query(insertParticipant, [
        participantId,
        registration.fullName,
        registration.email,
        registration.phone,
        registration.dateOfBirth,
        Number(registration.age),
        registration.gender,
        registration.collegeName,
        registration.course,
        registration.yearOfStudy,
        registration.city,
        registration.state,
        registration.category
          ? registration.category.toLowerCase()
          : null,
        true,              // payment_status
        razorpay_payment_id,
        !!registration.declarationAccepted,
        false,             // has_submitted
      ]);

      const logPayment = `
        INSERT INTO payments
          (participant_id,
           razorpay_order_id,
           razorpay_payment_id,
           amount,
           currency,
           status)
        VALUES ($1, $2, $3, $4, $5, $6);
      `;

      const amount = Number(process.env.REGISTRATION_AMOUNT || 19900);

      await client.query(logPayment, [
        participantId,
        razorpay_order_id,
        razorpay_payment_id,
        amount,
        'INR',
        'captured',
      ]);

      await client.query('COMMIT');

      // ✅ Send confirmation email after successful DB commit
      if (process.env.ENABLE_EMAILS === 'true') {
        try {
          const emailTemplate = registrationEmailTemplate({
            fullName: registration.fullName,
            participantId,
            email: registration.email,
            category: registration.category,
          });

          const emailResult = await sendEmail({
            to: registration.email,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
            text: emailTemplate.text,
          });

          // Log email result
          await pool.query(
            `INSERT INTO email_logs
               (participant_id, email_type, recipient_email, subject, status, error_message)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              participantId,
              'registration',
              registration.email,
              emailTemplate.subject,
              emailResult.success ? 'sent' : 'failed',
              emailResult.error || null,
            ]
          );

          console.log(
            emailResult.success
              ? `✅ Registration email sent to ${registration.email}`
              : `❌ Email failed for ${registration.email}: ${emailResult.error}`
          );
        } catch (emailErr) {
          // Never fail registration because of email error
          console.error('Registration email error (skipped):', emailErr);
        }
      }

      res.json({
        success: true,
        message: 'Payment verified and registration completed',
        participantId,
        participant: participantRes.rows[0],
      });
    } catch (dbErr) {
      await client.query('ROLLBACK');
      console.error('DB error during registration:', dbErr);
      res.status(500).json({
        success: false,
        message: 'Failed to complete registration after payment',
      });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Verify payment error:', err);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
    });
  }
};
