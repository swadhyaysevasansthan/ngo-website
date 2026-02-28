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
