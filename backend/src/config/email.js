import { Resend } from 'resend';

export async function sendEmail({ to, subject, html, text }) {
  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      text,
    });

    if (error) {
      console.error('Resend email error:', error);
      return { success: false, error: error.message || 'Email API error' };
    }

    return { success: true, };
  } catch (err) {
    console.error('Resend email exception:', err);
    return { success: false, error: err.message };
  }
}
