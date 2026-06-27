import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html, text }) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      text,
    });

    if (error) {
      console.error('Resend email error:', error);

      return {
        success: false,
        error: error.message || 'Email API error',
      };
    }

    return {
      success: true,
      resendId: data.id,
    };
  } catch (err) {
    console.error('Resend email exception:', err);

    return {
      success: false,
      error: err.message,
    };
  }
}