import { Resend } from 'resend';

const resend = new Resend(process.env.SNEAC_RESEND_API_KEY);

export const sendSneacEmail = async ({ to, subject, html, text }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.SNEAC_EMAIL_FROM || 'SNEAC 2026-27 <sneac@swadhyayseva.org>',
      to,
      subject,
      html,
      text,
    });

    if (error) {
      console.error('SNEAC email send error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('SNEAC email error:', err);
    return { success: false, error: err.message };
  }
};