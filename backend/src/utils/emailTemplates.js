export const registrationEmailTemplate = (data) => {
  const { fullName, participantId, email, category } = data;

  return {
    subject: 'Registration Confirmed – SNPC 2026',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>SNPC 2026 – Registration Confirmed</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
            color: #111827;
          }
          .wrapper {
            width: 100%;
            padding: 24px 12px;
            background-color: #f3f4f6;
          }
          .container {
            max-width: 640px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
          }
          .header {
            padding: 24px 28px;
            background: linear-gradient(135deg, #2f855a 0%, #166534 60%, #14532d 100%);
            color: #f9fafb;
            text-align: left;
          }
          .header-title {
            margin: 0;
            font-size: 18px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            opacity: 0.95;
            color: #ffffff; 
          }
          .header-subtitle {
            margin: 6px 0 0 0;
            font-size: 15px;
            font-weight: 500;
            opacity: 0.96;
            color: #f9fafb;
          }
          .content {
            padding: 26px 28px 30px 28px;
          }
          h2 {
            margin: 0 0 10px 0;
            font-size: 20px;
            font-weight: 600;
            color: #0f172a;
          }
          p {
            margin: 0 0 10px 0;
            font-size: 14px;
            line-height: 1.7;
            color: #374151;
          }
          .pill {
            display: inline-block;
            margin-top: 6px;
            padding: 5px 12px;
            border-radius: 999px;
            font-size: 11px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            background-color: #dcfce7;
            color: #166534;
          }
          .id-box {
            margin: 20px 0 18px 0;
            padding: 16px 18px;
            border-radius: 12px;
            border: 1px solid #d1fae5;
            background-color: #f0fdf4;
          }
          .id-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: #6b7280;
            margin-bottom: 6px;
          }
          .id-value {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
            font-size: 18px;
            font-weight: 700;
            color: #064e3b;
          }
          .id-help {
            margin-top: 6px;
            font-size: 12px;
            color: #4b5563;
          }
          .meta-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px 24px;
            margin-top: 12px;
          }
          .meta-item-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #9ca3af;
            margin-bottom: 2px;
          }
          .meta-item-value {
            font-size: 13px;
            color: #111827;
          }
          .section-title {
            margin: 22px 0 6px 0;
            font-size: 14px;
            font-weight: 600;
            color: #111827;
          }
          ul, ol {
            padding-left: 18px;
            margin: 4px 0 12px 0;
          }
          li {
            margin: 5px 0;
            font-size: 13px;
            color: #374151;
          }
          .button-wrapper {
            text-align: center;
            margin: 20px 0 8px 0;
          }
          .button {
            display: inline-block;
            padding: 11px 26px;
            border-radius: 999px;
            background: linear-gradient(135deg, #2563eb 0%, #0d9488 100%);
            color: #f9fafb !important;
            text-decoration: none;
            font-size: 13px;
            font-weight: 500;
            letter-spacing: 0.05em;
            text-transform: uppercase;
          }
          .note-box {
            margin-top: 18px;
            padding: 12px 14px;
            border-radius: 12px;
            background-color: #fefce8;
            border: 1px solid #facc15;
            font-size: 12px;
            color: #854d0e;
          }
          .divider {
            margin: 24px 0 16px 0;
            height: 1px;
            background: linear-gradient(to right, transparent, #e5e7eb, transparent);
          }
          .footer {
            padding: 14px 20px 10px 20px;
            text-align: center;
            font-size: 11px;
            color: #9ca3af;
            background-color: #f9fafb;
          }
          .footer a {
            color: #4b5563;
            text-decoration: none;
          }
          @media (max-width: 600px) {
            .container { border-radius: 12px; }
            .header, .content { padding: 20px 18px; }
            .meta-grid { grid-template-columns: 1fr; }
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <p class="header-title">Swadhyay National Photography Competition 2026</p>
              <p class="header-subtitle">Registration confirmed</p>
            </div>

            <div class="content">
              <h2>Hi ${fullName},</h2>
              <p>Thank you for registering for the Swadhyay National Photography Competition 2026. Your registration is now confirmed.</p>

              <span class="pill">Registration successful</span>

              <div class="id-box">
                <div class="id-label">Participant ID</div>
                <div class="id-value">${participantId}</div>
                <p class="id-help">
                  Please keep this ID safe. You will need it for photo submission and any future communication.
                </p>

                <div class="meta-grid">
                  <div>
                    <div class="meta-item-label">Name</div>
                    <div class="meta-item-value">${fullName}</div>
                  </div>
                  <div>
                    <div class="meta-item-label">Email</div>
                    <div class="meta-item-value">${email}</div>
                  </div>
                  <div>
                    <div class="meta-item-label">Category</div>
                    <div class="meta-item-value">${category}</div>
                  </div>
                  <div>
                    <div class="meta-item-label">Registration fee</div>
                    <div class="meta-item-value">₹100 (received)</div>
                  </div>
                </div>
              </div>

              <div>
                <div class="section-title">Next steps</div>
                <ol>
                  <li>Plan and capture your photograph according to the official competition guidelines.</li>
                  <li>Submit your entry on or before <strong>23 April 2026, 11:59 PM IST</strong>.</li>
                  <li>Use your <strong>Participant ID</strong> during the submission process.</li>
                </ol>
              </div>

              <div class="button-wrapper">
                <a href="https://forms.gle/NXCuCNRLQ7wEh6AeA" class="button">
                  Open submission form
                </a>
              </div>

              <div>
                <div class="section-title">Key rules (summary)</div>
                <ul>
                  <li>Photograph must be captured on or after <strong>1 September 2025</strong>.</li>
                  <li>Maximum file size: <strong>5 MB</strong>, JPG/JPEG format recommended.</li>
                  <li>No heavy compositing or manipulation; basic global adjustments only.</li>
                  <li>One photograph per participant for the competition.</li>
                  <li>Submission deadline: <strong>23 April 2026</strong>.</li>
                </ul>
              </div>
              <div class="section-title">To read all the rules and information visit our website: <a href="https://www.swadhyayseva.org/photography-competition">www.swadhyayseva.org</a></div>
              <div>
                <div class="section-title">Prizes</div>
                <ul>
                  <li>1st Prize – ₹21,000</li>
                  <li>2nd Prize – ₹11,000</li>
                  <li>3rd Prize – ₹5,000</li>
                  <li>5 Consolation Prizes – ₹1,000 each</li>
                  <li>E‑certificates for all participants</li>
                </ul>
              </div>

              <div class="note-box">
                If you did not initiate this registration, you can safely ignore this email. Your address may have been entered by mistake.
              </div>

              <div class="divider"></div>

              <p style="font-size: 12px; margin-bottom: 4px;"><strong>Support</strong></p>
              <p style="font-size: 12px;">
                Email: swadhyaysevafoundation@gmail.com<br/>
                WhatsApp: +91&nbsp;9599224323
              </p>
            </div>

            <div class="footer">
              <p style="margin: 0 0 4px 0;"><strong>Swadhyay Seva Foundation</strong></p>
              <p style="margin: 0 0 4px 0;">This is an automated message. Please do not reply.</p>
              <p style="margin: 0;">Website: <a href="https://www.swadhyayseva.org">www.swadhyayseva.org</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
SNPC 2026 – Registration Confirmed

Hi ${fullName},

Thank you for registering for the Swadhyay National Photography Competition 2026. Your registration is now confirmed.

Participant ID:
- ${participantId}

Registration details:
- Name: ${fullName}
- Email: ${email}
- Category: ${category}
- Registration fee: ₹100 (received)

Next steps:
1. Capture your photograph following the official guidelines.
2. Submit your entry on or before 23 April 2026, 11:59 PM IST.
3. Use your Participant ID during submission.

Key rules (summary):
- Photograph must be captured on or after 1 September 2025.
- Maximum file size: 5 MB.
- Minimal editing only; no composites or heavy manipulation.
- One photograph per participant.
- Submission deadline: 23 April 2026.

Prizes:
- 1st Prize – ₹21,000
- 2nd Prize – ₹11,000
- 3rd Prize – ₹5,000
- 5 Consolation Prizes – ₹1,000 each
- E‑certificates for all participants

For any queries:
Email: swadhyaysevafoundation@gmail.com
WhatsApp: +91 9599224323

Swadhyay Seva Foundation
    `,
  };
};

export const submissionEmailTemplate = (data) => {
  const { fullName, participantId, category, submissionDate } = data;

  return {
    subject: 'Photo Submission Received – SNPC 2026',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>SNPC 2026 – Submission Received</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
            color: #111827;
          }
          .wrapper {
            width: 100%;
            padding: 24px 12px;
            background-color: #f3f4f6;
          }
          .container {
            max-width: 640px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
          }
          .header {
            padding: 24px 28px;
            background: linear-gradient(135deg, #2563eb 0%, #1f2937 65%);
            color: #f9fafb;
            text-align: left;
          }
          .header-title {
            margin: 0;
            font-size: 18px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            opacity: 0.95;
            color: #ffffff;
          }
          .header-subtitle {
            margin: 6px 0 0 0;
            font-size: 15px;
            font-weight: 500;
            opacity: 0.96;
            color: #f9fafb;
          }
          .content {
            padding: 26px 28px 30px 28px;
          }
          h2 {
            margin: 0 0 10px 0;
            font-size: 20px;
            font-weight: 600;
            color: #0f172a;
          }
          p {
            margin: 0 0 10px 0;
            font-size: 14px;
            line-height: 1.7;
            color: #374151;
          }
          .pill {
            display: inline-block;
            margin-top: 6px;
            padding: 5px 12px;
            border-radius: 999px;
            font-size: 11px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            background-color: #dbeafe;
            color: #1d4ed8;
          }
          .success-box {
            margin: 20px 0 18px 0;
            padding: 16px 18px;
            border-radius: 12px;
            border: 1px solid #bbf7d0;
            background-color: #ecfdf5;
          }
          .success-title {
            margin: 0 0 6px 0;
            font-size: 15px;
            font-weight: 600;
            color: #166534;
          }
          .meta-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px 24px;
            margin-top: 10px;
          }
          .meta-item-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #9ca3af;
            margin-bottom: 2px;
          }
          .meta-item-value {
            font-size: 13px;
            color: #111827;
          }
          .section-title {
            margin: 22px 0 6px 0;
            font-size: 14px;
            font-weight: 600;
            color: #111827;
          }
          ul {
            padding-left: 18px;
            margin: 4px 0 12px 0;
          }
          li {
            margin: 5px 0;
            font-size: 13px;
            color: #374151;
          }
          .note-box {
            margin-top: 14px;
            padding: 12px 14px;
            border-radius: 12px;
            background-color: #eff6ff;
            border: 1px solid #bfdbfe;
            font-size: 12px;
            color: #1d4ed8;
          }
          .divider {
            margin: 24px 0 16px 0;
            height: 1px;
            background: linear-gradient(to right, transparent, #e5e7eb, transparent);
          }
          .footer {
            padding: 14px 20px 10px 20px;
            text-align: center;
            font-size: 11px;
            color: #9ca3af;
            background-color: #f9fafb;
          }
          .footer a {
            color: #4b5563;
            text-decoration: none;
          }
          @media (max-width: 600px) {
            .container { border-radius: 12px; }
            .header, .content { padding: 20px 18px; }
            .meta-grid { grid-template-columns: 1fr; }
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <p class="header-title">Swadhyay National Photography Competition 2026</p>
              <p class="header-subtitle">Submission received</p>
            </div>

            <div class="content">
              <h2>Thank you, ${fullName}</h2>
              <p>Your photograph has been successfully submitted to SNPC 2026.</p>

              <span class="pill">Submission recorded</span>

              <div class="success-box">
                <p class="success-title">Your submission details</p>
                <div class="meta-grid">
                  <div>
                    <div class="meta-item-label">Participant ID</div>
                    <div class="meta-item-value">${participantId}</div>
                  </div>
                  <div>
                    <div class="meta-item-label">Category</div>
                    <div class="meta-item-value">${category}</div>
                  </div>
                  <div>
                    <div class="meta-item-label">Submitted on</div>
                    <div class="meta-item-value">
                      ${new Date(submissionDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div class="section-title">What happens next</div>
                <ul>
                  <li><strong>Evaluation period:</strong> 25 April – 28 May 2026.</li>
                  <li><strong>Result announcement:</strong> 30 May 2026 on the official channels.</li>
                  <li>Shortlisted participants may be contacted for additional details or original files.</li>
                </ul>
              </div>

              <div>
                <div class="section-title">Important notes</div>
                <ul>
                  <li>Please keep this email for your records.</li>
                  <li>We may request original RAW files to verify authenticity if your entry is shortlisted.</li>
                  <li>The jury’s decision will be final and binding.</li>
                </ul>
              </div>

              <div class="note-box">
                If you have submitted multiple entries by mistake, please contact the organizing team with your Participant ID as soon as possible.
              </div>

              <div class="divider"></div>

              <p style="font-size: 12px; margin-bottom: 4px;"><strong>Support</strong></p>
              <p style="font-size: 12px;">
                Email: swadhyaysevafoundation@gmail.com<br/>
                WhatsApp: +91&nbsp;9599224323
              </p>
            </div>

            <div class="footer">
              <p style="margin: 0 0 4px 0;"><strong>Swadhyay Seva Foundation</strong></p>
              <p style="margin: 0 0 4px 0;">This is an automated message. Please do not reply.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
SNPC 2026 – Photo Submission Received

Dear ${fullName},

We have successfully received your photograph for the Swadhyay National Photography Competition 2026.

Submission details:
- Participant ID: ${participantId}
- Category: ${category}
- Submitted on: ${new Date(submissionDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

What happens next:
- Evaluation period: 25 April – 28 May 2026.
- Result announcement: 30 May 2026.
- Shortlisted participants may be contacted for additional details or original files.

Important notes:
- Please keep this email for your records.
- We may request original RAW files to verify authenticity.
- The jury's decision will be final and binding.

For any queries:
Email: swadhyaysevafoundation@gmail.com
WhatsApp: +91 9599224323

Swadhyay Seva Foundation
    `,
  };
};

// ============================================================
// SNEAC 2026-27 — School Access & Competition Registration
// ============================================================

// 1. Access request received (sent to school after submitting request)
export const schoolAccessRequestReceivedTemplate = (data) => {
  const { schoolName } = data;

  return {
    subject: 'Access Request Received – SNEAC 2026–27',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>SNEAC 2026–27 – Access Request Received</title>
        <style>
          body { margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; color: #111827; }
          .wrapper { width: 100%; padding: 24px 12px; background-color: #f3f4f6; }
          .container { max-width: 640px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12); }
          .header { padding: 24px 28px; background: linear-gradient(135deg, #0369a1 0%, #1e3a5f 100%); color: #f9fafb; text-align: left; }
          .header-title { margin: 0; font-size: 18px; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.95; color: #ffffff; }
          .header-subtitle { margin: 6px 0 0 0; font-size: 15px; font-weight: 500; opacity: 0.96; color: #f9fafb; }
          .content { padding: 26px 28px 30px 28px; }
          h2 { margin: 0 0 10px 0; font-size: 20px; font-weight: 600; color: #0f172a; }
          p { margin: 0 0 10px 0; font-size: 14px; line-height: 1.7; color: #374151; }
          .pill { display: inline-block; margin-top: 6px; padding: 5px 12px; border-radius: 999px; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; background-color: #dbeafe; color: #1d4ed8; }
          .info-box { margin: 20px 0 18px 0; padding: 16px 18px; border-radius: 12px; border: 1px solid #bfdbfe; background-color: #eff6ff; }
          .meta-item-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; margin-bottom: 2px; }
          .meta-item-value { font-size: 13px; color: #111827; margin-bottom: 10px; }
          .section-title { margin: 22px 0 6px 0; font-size: 14px; font-weight: 600; color: #111827; }
          ul { padding-left: 18px; margin: 4px 0 12px 0; }
          li { margin: 5px 0; font-size: 13px; color: #374151; }
          .note-box { margin-top: 18px; padding: 12px 14px; border-radius: 12px; background-color: #fefce8; border: 1px solid #facc15; font-size: 12px; color: #854d0e; }
          .divider { margin: 24px 0 16px 0; height: 1px; background: linear-gradient(to right, transparent, #e5e7eb, transparent); }
          .footer { padding: 14px 20px 10px 20px; text-align: center; font-size: 11px; color: #9ca3af; background-color: #f9fafb; }
          .footer a { color: #4b5563; text-decoration: none; }
          @media (max-width: 600px) { .container { border-radius: 12px; } .header, .content { padding: 20px 18px; } }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <p class="header-title">National Environment Awareness Competitions 2026–27</p>
              <p class="header-subtitle">Access request received</p>
            </div>
            <div class="content">
              <p>We have received your school's access request for the <strong>Swadhyay National Environment Awareness Competitions 2026–27</strong>.</p>
              <span class="pill">Request under review</span>
              <div class="info-box">
                <div class="meta-item-label">School</div>
                <div class="meta-item-value">${schoolName}</div>
                <div class="meta-item-label">Status</div>
                <div class="meta-item-value">Pending review</div>
              </div>
              <div class="section-title">What happens next</div>
              <ul>
                <li>Our team will review your request within a few working days.</li>
                <li>If approved, you will receive a private registration link on this email address.</li>
                <li>If we need any additional information, we will reach out to you directly.</li>
              </ul>
              <div class="note-box">
                Please do not submit multiple requests for the same school. If you have any urgent queries, contact us directly using the details below.
              </div>
              <div class="divider"></div>
              <p style="font-size: 12px; margin-bottom: 4px;"><strong>Support</strong></p>
              <p style="font-size: 12px;">
                Email: swadhyaysevafoundation@gmail.com<br/>
                WhatsApp: +91&nbsp;9599224323 | +91&nbsp;9837042298
              </p>
            </div>
            <div class="footer">
              <p style="margin: 0 0 4px 0;"><strong>Swadhyay Seva Foundation</strong></p>
              <p style="margin: 0 0 4px 0;">This is an automated message. Please do not reply.</p>
              <p style="margin: 0;">Website: <a href="https://www.swadhyayseva.org">www.swadhyayseva.org</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
SNEAC 2026–27 – Access Request Received

We have received your school's access request for the Swadhyay National Environment Awareness Competitions 2026–27.

School: ${schoolName}
Status: Pending review

What happens next:
- Our team will review your request within a few working days.
- If approved, you will receive a private registration link on this email address.
- If we need any additional information, we will reach out to you directly.

Please do not submit multiple requests for the same school.

Support:
Email: swadhyaysevafoundation@gmail.com
WhatsApp: +91 9599224323 | +91 9837042298

Swadhyay Seva Foundation
www.swadhyayseva.org
    `,
  };
};


// 2. Access approved — magic link sent to school
export const schoolAccessApprovedTemplate = (data) => {
  const { schoolName, registrationLink, expiresAt } = data;

  const formattedExpiry = new Date(expiresAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata',
  });

  return {
    subject: 'Access Approved – Complete Your Registration for SNEAC 2026–27',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>SNEAC 2026–27 – Access Approved</title>
        <style>
          body { margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; color: #111827; }
          .wrapper { width: 100%; padding: 24px 12px; background-color: #f3f4f6; }
          .container { max-width: 640px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12); }
          .header { padding: 24px 28px; background: linear-gradient(135deg, #2f855a 0%, #166534 60%, #14532d 100%); color: #f9fafb; text-align: left; }
          .header-title { margin: 0; font-size: 18px; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.95; color: #ffffff; }
          .header-subtitle { margin: 6px 0 0 0; font-size: 15px; font-weight: 500; opacity: 0.96; color: #f9fafb; }
          .content { padding: 26px 28px 30px 28px; }
          h2 { margin: 0 0 10px 0; font-size: 20px; font-weight: 600; color: #0f172a; }
          p { margin: 0 0 10px 0; font-size: 14px; line-height: 1.7; color: #374151; }
          .pill { display: inline-block; margin-top: 6px; padding: 5px 12px; border-radius: 999px; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; background-color: #dcfce7; color: #166534; }
          .id-box { margin: 20px 0 18px 0; padding: 16px 18px; border-radius: 12px; border: 1px solid #d1fae5; background-color: #f0fdf4; }
          .id-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #6b7280; margin-bottom: 6px; }
          .id-help { margin-top: 6px; font-size: 12px; color: #4b5563; }
          .meta-item-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; margin-bottom: 2px; }
          .meta-item-value { font-size: 13px; color: #111827; margin-bottom: 10px; }
          .section-title { margin: 22px 0 6px 0; font-size: 14px; font-weight: 600; color: #111827; }
          ul, ol { padding-left: 18px; margin: 4px 0 12px 0; }
          li { margin: 5px 0; font-size: 13px; color: #374151; }
          .button-wrapper { text-align: center; margin: 20px 0 8px 0; }
          .button { display: inline-block; padding: 13px 32px; border-radius: 999px; background: linear-gradient(135deg, #2f855a 0%, #166534 100%); color: #ffffff !important; text-decoration: none; font-size: 14px; font-weight: 600; letter-spacing: 0.04em; }
          .note-box { margin-top: 18px; padding: 12px 14px; border-radius: 12px; background-color: #fefce8; border: 1px solid #facc15; font-size: 12px; color: #854d0e; }
          .divider { margin: 24px 0 16px 0; height: 1px; background: linear-gradient(to right, transparent, #e5e7eb, transparent); }
          .footer { padding: 14px 20px 10px 20px; text-align: center; font-size: 11px; color: #9ca3af; background-color: #f9fafb; }
          .footer a { color: #4b5563; text-decoration: none; }
          @media (max-width: 600px) { .container { border-radius: 12px; } .header, .content { padding: 20px 18px; } }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <p class="header-title">National Environment Awareness Competitions 2026–27</p>
              <p class="header-subtitle">Access approved — complete your registration</p>
            </div>
            <div class="content">
              <p>Great news! Your school's access request has been <strong>approved</strong>. You can now register <strong>${schoolName}</strong> for the Swadhyay National Environment Awareness Competitions 2026–27.</p>
              <span class="pill">Access approved</span>
              <div class="id-box">
                <div class="id-label">Your private registration link</div>
                <p class="id-help">Click the button below to open your registration page. This link is unique to your school and is valid until <strong>${formattedExpiry}</strong>.</p>
                <div class="meta-item-label">School</div>
                <div class="meta-item-value">${schoolName}</div>
                <div class="meta-item-label">Link valid until</div>
                <div class="meta-item-value">${formattedExpiry}</div>
              </div>
              <div class="button-wrapper">
                <a href="${registrationLink}" class="button">Open Registration Page</a>
              </div>
              <p style="text-align:center; font-size: 11px; color: #9ca3af; margin-top: 6px;">
                Or copy this link: ${registrationLink}
              </p>
              <div class="section-title">Available competitions</div>
              <ul>
                <li><strong>Swadhyay National Environment Painting Competition (SNEPC)</strong> — Classes 3rd to 8th. The competition includes two categories for students: Primary Category (Classes 3rd–5th) and Secondary Category (Classes 6th–8th), max 300 students / school (upto 150 students per category).</li>
                <li><strong>Swadhyay National Environment Quiz Competition</strong> — Classes 6th to 8th, max 50 students per school.</li>
              </ul>
              <div class="section-title">Important instructions</div>
              <ol>
                <li>Use the registration link above — do not share it with others.</li>
                <li>You can register for one or both competitions.</li>
                <li>Keep all teacher and student details ready before filling the form.</li>
                <li>Provide four preferred dates for conducting the competition at your school.</li>
                <li>Submit before the registration deadline: <strong>28 February 2027</strong>.</li>
              </ol>
              <div class="note-box">
                This link is private and unique to your school. Do not share it publicly. It will expire on <strong>${formattedExpiry}</strong>. If your link expires before registration, please contact us to request a new one.
              </div>
              <div class="divider"></div>
              <p style="font-size: 12px; margin-bottom: 4px;"><strong>Support</strong></p>
              <p style="font-size: 12px;">
                Email: swadhyaysevafoundation@gmail.com<br/>
                WhatsApp: +91&nbsp;9599224323 | +91&nbsp;9837042298
              </p>
            </div>
            <div class="footer">
              <p style="margin: 0 0 4px 0;"><strong>Swadhyay Seva Foundation</strong></p>
              <p style="margin: 0 0 4px 0;">This is an automated message. Please do not reply.</p>
              <p style="margin: 0;">Website: <a href="https://www.swadhyayseva.org">www.swadhyayseva.org</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
SNEAC 2026–27 – Access Approved

Your school's access request has been approved. You can now complete your registration.

School: ${schoolName}
Link valid until: ${formattedExpiry}

Open your registration page here:
${registrationLink}

Available competitions:
- Swadhyay National Environmental Painting Competition (SNEPC) — Classes 3rd to 8th, max 300 students per school.
- Swadhyay National Environment Quiz Competition — Classes 6th to 8th, max 50 students.

Important instructions:
1. Use the link above — do not share it with others.
2. You can register for one or both competitions.
3. Keep all teacher and student details ready before filling the form.
4. Provide four preferred dates for conducting the competition at your school.
5. Submit before the registration deadline: 28 February 2027.

Support:
Email: swadhyaysevafoundation@gmail.com
WhatsApp: +91 9599224323 | +91 9837042298

Swadhyay Seva Foundation
www.swadhyayseva.org
    `,
  };
};


// 3. Access rejected
export const schoolAccessRejectedTemplate = (data) => {
  const { schoolName, rejectionReason } = data;

  return {
    subject: 'Access Request Update – SNEAC 2026–27',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>SNEAC 2026–27 – Access Request Update</title>
        <style>
          body { margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; color: #111827; }
          .wrapper { width: 100%; padding: 24px 12px; background-color: #f3f4f6; }
          .container { max-width: 640px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12); }
          .header { padding: 24px 28px; background: linear-gradient(135deg, #6b7280 0%, #374151 100%); color: #f9fafb; text-align: left; }
          .header-title { margin: 0; font-size: 18px; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.95; color: #ffffff; }
          .header-subtitle { margin: 6px 0 0 0; font-size: 15px; font-weight: 500; opacity: 0.96; color: #f9fafb; }
          .content { padding: 26px 28px 30px 28px; }
          h2 { margin: 0 0 10px 0; font-size: 20px; font-weight: 600; color: #0f172a; }
          p { margin: 0 0 10px 0; font-size: 14px; line-height: 1.7; color: #374151; }
          .pill { display: inline-block; margin-top: 6px; padding: 5px 12px; border-radius: 999px; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; background-color: #fee2e2; color: #991b1b; }
          .info-box { margin: 20px 0 18px 0; padding: 16px 18px; border-radius: 12px; border: 1px solid #fecaca; background-color: #fff1f2; }
          .meta-item-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; margin-bottom: 2px; }
          .meta-item-value { font-size: 13px; color: #111827; margin-bottom: 10px; }
          .section-title { margin: 22px 0 6px 0; font-size: 14px; font-weight: 600; color: #111827; }
          .note-box { margin-top: 18px; padding: 12px 14px; border-radius: 12px; background-color: #eff6ff; border: 1px solid #bfdbfe; font-size: 12px; color: #1d4ed8; }
          .divider { margin: 24px 0 16px 0; height: 1px; background: linear-gradient(to right, transparent, #e5e7eb, transparent); }
          .footer { padding: 14px 20px 10px 20px; text-align: center; font-size: 11px; color: #9ca3af; background-color: #f9fafb; }
          .footer a { color: #4b5563; text-decoration: none; }
          @media (max-width: 600px) { .container { border-radius: 12px; } .header, .content { padding: 20px 18px; } }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <p class="header-title">National Environment Awareness Competitions 2026–27</p>
              <p class="header-subtitle">Access request update</p>
            </div>
            <div class="content">
              <p>Thank you for your interest in the Swadhyay National Environment Awareness Competitions 2026–27. After reviewing your request, we are unable to approve the registration for <strong>${schoolName}</strong> at this time.</p>
              <span class="pill">Request not approved</span>
              ${rejectionReason ? `
              <div class="info-box">
                <div class="meta-item-label">Reason</div>
                <div class="meta-item-value">${rejectionReason}</div>
              </div>` : ''}
              <div class="note-box">
                If you believe this is an error or would like to provide additional information, please reach out to us directly. We are happy to assist and reconsider your request.
              </div>
              <div class="divider"></div>
              <p style="font-size: 12px; margin-bottom: 4px;"><strong>Support</strong></p>
              <p style="font-size: 12px;">
                Email: swadhyaysevafoundation@gmail.com<br/>
                WhatsApp: +91&nbsp;9599224323 | +91&nbsp;9837042298
              </p>
            </div>
            <div class="footer">
              <p style="margin: 0 0 4px 0;"><strong>Swadhyay Seva Foundation</strong></p>
              <p style="margin: 0 0 4px 0;">This is an automated message. Please do not reply.</p>
              <p style="margin: 0;">Website: <a href="https://www.swadhyayseva.org">www.swadhyayseva.org</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
SNEAC 2026–27 – Access Request Update

Thank you for your interest in the Swadhyay National Environment Awareness Competitions 2026–27.

After reviewing your request, we are unable to approve the registration for ${schoolName} at this time.
${rejectionReason ? `\nReason: ${rejectionReason}\n` : ''}
If you believe this is an error or would like to provide additional information, please reach out to us directly.

Support:
Email: swadhyaysevafoundation@gmail.com
WhatsApp: +91 9599224323 | +91 9837042298

Swadhyay Seva Foundation
www.swadhyayseva.org
    `,
  };
};


// 4. Competition registration confirmed (sent after school submits painting or quiz form)
export const schoolCompetitionRegistrationTemplate = (data) => {
  const {
    schoolName, competitionType,
    classCounts, totalParticipants, availableComputers,
    preferredDates, primaryPreferredDates, secondaryPreferredDates, submittedAt,
  } = data;

  const competitionLabel = competitionType === 'painting'
    ? 'Swadhyay National Environmental Painting Competition (SNEPC)'
    : 'Swadhyay National Environmental Quiz Competition ';

  const classLabel = competitionType === 'painting'
    ? 'Classes 3rd – 8th'
    : 'Classes 6th – 8th';

  const formattedDate = new Date(submittedAt).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata', day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const classRows = Object.entries(classCounts)
    .map(([cls, count]) => `<tr><td style="padding:6px 0; font-size:13px; color:#374151;">Class ${cls}</td><td style="padding:6px 0; font-size:13px; color:#111827; font-weight:500;">${count} students</td></tr>`)
    .join('');

  const classText = Object.entries(classCounts)
    .map(([cls, count]) => `  Class ${cls}: ${count} students`)
    .join('\n');

  const datesHtml =
    competitionType === 'painting'
      ? `
        <div style="margin-bottom:16px;">
          <strong>Primary Category Preferred Dates</strong>
          <ul>
            ${(primaryPreferredDates || [])
              .map((d, i) => `
                <li>
                  ${i + 1}.
                  ${new Date(d).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    timeZone: 'Asia/Kolkata',
                  })}
                </li>
              `)
              .join('')}
          </ul>
        </div>

        <div>
          <strong>Secondary Category Preferred Dates</strong>
          <ul>
            ${(secondaryPreferredDates || [])
              .map((d, i) => `
                <li>
                  ${i + 1}.
                  ${new Date(d).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    timeZone: 'Asia/Kolkata',
                  })}
                </li>
              `)
              .join('')}
          </ul>
        </div>
      `
      : `
        <ul>
          ${(preferredDates || [])
            .map((d, i) => `
              <li>
                ${i === 0 ? 'Preferred' : `Alternate ${i}`}:
                <strong>
                  ${new Date(d).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    timeZone: 'Asia/Kolkata',
                  })}
                </strong>
              </li>
            `)
            .join('')}
        </ul>
      `;

  const datesText =
    competitionType === 'painting'
      ? `
  Primary Category Preferred Dates:
  ${(primaryPreferredDates || [])
    .map(
      (d, i) =>
        `  ${i + 1}. ${new Date(d).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          timeZone: 'Asia/Kolkata',
        })}`
    )
    .join('\n')}

  Secondary Category Preferred Dates:
  ${(secondaryPreferredDates || [])
    .map(
      (d, i) =>
        `  ${i + 1}. ${new Date(d).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          timeZone: 'Asia/Kolkata',
        })}`
    )
    .join('\n')}
  `
      : (preferredDates || [])
          .map(
            (d, i) =>
              `  ${i === 0 ? 'Preferred' : `Alternate ${i}`}: ${new Date(
                d
              ).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                timeZone: 'Asia/Kolkata',
              })}`
          )
          .join('\n');

  return {
    subject: `Registration Confirmed – ${competitionLabel} | SNEAC 2026–27`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>SNEAC 2026–27 – Registration Confirmed</title>
        <style>
          body { margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; color: #111827; }
          .wrapper { width: 100%; padding: 24px 12px; background-color: #f3f4f6; }
          .container { max-width: 640px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12); }
          .header { padding: 24px 28px; background: linear-gradient(135deg, #2f855a 0%, #166534 60%, #14532d 100%); color: #f9fafb; text-align: left; }
          .header-title { margin: 0; font-size: 18px; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.95; color: #ffffff; }
          .header-subtitle { margin: 6px 0 0 0; font-size: 15px; font-weight: 500; opacity: 0.96; color: #f9fafb; }
          .content { padding: 26px 28px 30px 28px; }
          h2 { margin: 0 0 10px 0; font-size: 20px; font-weight: 600; color: #0f172a; }
          p { margin: 0 0 10px 0; font-size: 14px; line-height: 1.7; color: #374151; }
          .pill { display: inline-block; margin-top: 6px; padding: 5px 12px; border-radius: 999px; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; background-color: #dcfce7; color: #166534; }
          .id-box { margin: 20px 0 18px 0; padding: 16px 18px; border-radius: 12px; border: 1px solid #d1fae5; background-color: #f0fdf4; }
          .id-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #6b7280; margin-bottom: 10px; }
          .meta-item-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; margin-bottom: 2px; }
          .meta-item-value { font-size: 13px; color: #111827; margin-bottom: 10px; }
          .section-title { margin: 22px 0 6px 0; font-size: 14px; font-weight: 600; color: #111827; }
          ul, ol { padding-left: 18px; margin: 4px 0 12px 0; }
          li { margin: 5px 0; font-size: 13px; color: #374151; }
          table { width: 100%; border-collapse: collapse; margin-top: 6px; }
          .note-box { margin-top: 18px; padding: 12px 14px; border-radius: 12px; background-color: #fefce8; border: 1px solid #facc15; font-size: 12px; color: #854d0e; }
          .divider { margin: 24px 0 16px 0; height: 1px; background: linear-gradient(to right, transparent, #e5e7eb, transparent); }
          .footer { padding: 14px 20px 10px 20px; text-align: center; font-size: 11px; color: #9ca3af; background-color: #f9fafb; }
          .footer a { color: #4b5563; text-decoration: none; }
          @media (max-width: 600px) { .container { border-radius: 12px; } .header, .content { padding: 20px 18px; } }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <p class="header-title">National Environment Awareness Competitions 2026–27</p>
              <p class="header-subtitle">${competitionLabel} — Registration confirmed</p>
            </div>
            <div class="content">
              <p>Your school's registration for the <strong>${competitionLabel}</strong> has been successfully submitted.</p>
              <span class="pill">Registration submitted</span>
              <div class="id-box">
                <div class="id-label">Registration summary</div>
                <div class="meta-item-label">School</div>
                <div class="meta-item-value">${schoolName}</div>
                <div class="meta-item-label">Competition</div>
                <div class="meta-item-value">${competitionLabel} (${classLabel})</div>
                <div class="meta-item-label">Total participants</div>
                <div class="meta-item-value">${totalParticipants} students</div>
                ${competitionType === 'quiz' ? `
                <div class="meta-item-label">Available computers</div>
                <div class="meta-item-value">${availableComputers}</div>` : ''}
                <div class="meta-item-label">Submitted on</div>
                <div class="meta-item-value">${formattedDate}</div>
              </div>
              <div class="section-title">Class-wise participation</div>
              <table>
                ${classRows}
              </table>
              <div class="section-title">Preferred dates submitted</div>
              <ul>${datesHtml}</ul>
              <div class="note-box">
                Our team will review your preferred dates and send a separate confirmation email with the allotted date for the competition at your school. Please keep these dates available.
              </div>
              <div class="divider"></div>
              <p style="font-size: 12px; margin-bottom: 4px;"><strong>Support</strong></p>
              <p style="font-size: 12px;">
                Email: swadhyaysevafoundation@gmail.com<br/>
                WhatsApp: +91&nbsp;9599224323 | +91&nbsp;9837042298
              </p>
            </div>
            <div class="footer">
              <p style="margin: 0 0 4px 0;"><strong>Swadhyay Seva Foundation</strong></p>
              <p style="margin: 0 0 4px 0;">This is an automated message. Please do not reply.</p>
              <p style="margin: 0;">Website: <a href="https://www.swadhyayseva.org">www.swadhyayseva.org</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
SNEAC 2026–27 – Registration Confirmed

Your school's registration for the ${competitionLabel} has been successfully submitted.

School: ${schoolName}
Competition: ${competitionLabel} (${classLabel})
Total participants: ${totalParticipants} students
${competitionType === 'quiz' ? `Available computers: ${availableComputers}\n` : ''}Submitted on: ${formattedDate}

Class-wise participation:
${classText}

Preferred dates submitted:
${datesText}

Our team will review your preferred dates and send a separate confirmation email with the allotted date.

Support:
Email: swadhyaysevafoundation@gmail.com
WhatsApp: +91 9599224323 | +91 9837042298

Swadhyay Seva Foundation
www.swadhyayseva.org
    `,
  };
};


export const schoolDateAllotmentTemplate = (data) => {
  const {
    schoolName,
    teacherName,
    competitionType,

    // NEW
    category,

    allottedDate,

    primaryAllottedDate,
    secondaryAllottedDate,

    totalParticipants,
  } = data;

  const competitionLabel =
    competitionType === 'painting'
      ? 'Swadhyay National Environmental Painting Competition (SNEPC)'
      : 'Swadhyay National Environmental Quiz Competition';

  // ─────────────────────────────────────────────
  // FORMATTERS
  // ─────────────────────────────────────────────

  const formatDate = (date) => {
    if (!date) return '';

    return new Date(date).toLocaleDateString(
      'en-IN',
      {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Kolkata',
      }
    );
  };

  const formattedAllottedDate =
    formatDate(allottedDate);

  const formattedPrimaryDate =
    formatDate(primaryAllottedDate);

  const formattedSecondaryDate =
    formatDate(secondaryAllottedDate);

  // ─────────────────────────────────────────────
  // DYNAMIC DATE CONTENT
  // ─────────────────────────────────────────────

  let dateHtml = '';
  let dateText = '';

  // QUIZ
  if (competitionType === 'quiz') {

    dateHtml = `
      <div class="date-box">
        <div class="date-label">
          Allotted Date
        </div>

        <div class="date-value">
          ${formattedAllottedDate}
        </div>
      </div>
    `;

    dateText = `
Allotted Date:
${formattedAllottedDate}
`;

  }

  // PAINTING — PRIMARY
  else if (
    competitionType === 'painting' &&
    category === 'primary'
  ) {

    dateHtml = `
      <div class="date-box">
        <div class="date-label">
          Primary Category Date
        </div>

        <div class="date-value">
          ${formattedPrimaryDate}
        </div>
      </div>
    `;

    dateText = `
Primary Category Date:
${formattedPrimaryDate}
`;

  }

  // PAINTING — SECONDARY
  else if (
    competitionType === 'painting' &&
    category === 'secondary'
  ) {

    dateHtml = `
      <div class="date-box">
        <div class="date-label">
          Secondary Category Date
        </div>

        <div class="date-value">
          ${formattedSecondaryDate}
        </div>
      </div>
    `;

    dateText = `
Secondary Category Date:
${formattedSecondaryDate}
`;

  }

  // PAINTING — SCHOOL
  else if (
    competitionType === 'painting' &&
    category === 'school'
  ) {

    dateHtml = `
      <div class="date-box">

        <div class="date-label">
          Primary Category Date
        </div>

        <div class="date-value">
          ${formattedPrimaryDate}
        </div>

        <br/>

        <div class="date-label">
          Secondary Category Date
        </div>

        <div class="date-value">
          ${formattedSecondaryDate}
        </div>

      </div>
    `;

    dateText = `
Primary Category Date:
${formattedPrimaryDate}

Secondary Category Date:
${formattedSecondaryDate}
`;

  }

  return {
    subject: `Date Confirmed – ${competitionLabel} | SNEAC 2026–27`,

    html: `
      <!DOCTYPE html>
      <html lang="en">

      <head>
        <meta charset="UTF-8" />

        <title>
          SNEAC 2026–27 – Date Confirmed
        </title>

        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
            font-family: Arial, sans-serif;
            color: #111827;
          }

          .wrapper {
            width: 100%;
            padding: 24px 12px;
            background-color: #f3f4f6;
          }

          .container {
            max-width: 640px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 12px 30px rgba(15,23,42,0.12);
          }

          .header {
            padding: 24px 28px;
            background: linear-gradient(
              135deg,
              #7c3aed 0%,
              #4c1d95 100%
            );
            color: #ffffff;
          }

          .header-title {
            margin: 0;
            font-size: 18px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }

          .header-subtitle {
            margin-top: 6px;
            font-size: 15px;
          }

          .content {
            padding: 26px 28px 30px 28px;
          }

          p {
            font-size: 14px;
            line-height: 1.7;
            color: #374151;
          }

          .pill {
            display: inline-block;
            margin-top: 6px;
            padding: 5px 12px;
            border-radius: 999px;
            font-size: 11px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            background-color: #ede9fe;
            color: #6d28d9;
          }

          .date-box {
            margin: 22px 0 18px 0;
            padding: 20px 22px;
            border-radius: 12px;
            border: 1px solid #ddd6fe;
            background-color: #f5f3ff;
            text-align: center;
          }

          .date-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: #7c3aed;
            margin-bottom: 8px;
          }

          .date-value {
            font-size: 22px;
            font-weight: 700;
            color: #4c1d95;
          }

          .meta-box {
            margin: 20px 0 18px 0;
            padding: 16px 18px;
            border-radius: 12px;
            border: 1px solid #ddd6fe;
            background-color: #faf5ff;
          }

          .meta-label {
            font-size: 11px;
            text-transform: uppercase;
            color: #9ca3af;
          }

          .meta-value {
            font-size: 13px;
            color: #111827;
            margin-bottom: 10px;
          }

          .footer {
            padding: 14px 20px;
            text-align: center;
            font-size: 11px;
            color: #9ca3af;
            background-color: #f9fafb;
          }
        </style>
      </head>

      <body>

        <div class="wrapper">

          <div class="container">

            <div class="header">

              <p class="header-title">
                Swadhyay National Environment Awareness Competitions 2026–27
              </p>

              <p class="header-subtitle">
                ${competitionLabel} — Date Confirmed
              </p>

            </div>

            <div class="content">

              <p>
                Dear ${teacherName},
              </p>

              <p>
                We are pleased to confirm the scheduled date for the
                <strong>${competitionLabel}</strong>
                at
                <strong>${schoolName}</strong>.
              </p>

              <span class="pill">
                Date Confirmed
              </span>

              ${dateHtml}

              <div class="meta-box">

                <div class="meta-label">
                  School
                </div>

                <div class="meta-value">
                  ${schoolName}
                </div>

                <div class="meta-label">
                  Competition
                </div>

                <div class="meta-value">
                  ${competitionLabel}
                </div>

                <div class="meta-label">
                  Total Participants
                </div>

                <div class="meta-value">
                  ${totalParticipants} students
                </div>

              </div>

              <p>
                Please ensure that all registered participants are informed and prepared accordingly.
              </p>

              <p>
                In case of any scheduling conflict, kindly contact us immediately.
              </p>

              <br/>

              <p>
                Regards,<br/>
                <strong>Swadhyay Seva Foundation</strong>
              </p>

            </div>

            <div class="footer">

              Swadhyay Seva Foundation<br/>
              www.swadhyayseva.org

            </div>

          </div>

        </div>

      </body>
      </html>
    `,

    text: `
SNEAC 2026–27 – Date Confirmed

Dear ${teacherName},

${competitionLabel}
${schoolName}

${dateText}

Total Participants:
${totalParticipants}

Regards,
Swadhyay Seva Foundation
www.swadhyayseva.org
`,
  };
};