import ngoLogo from '../../assets/ngo-logo.png';

/**
 * Returns a Tailwind CSS class string for a given pass category badge.
 */
export const getCategoryColor = (category) => {
  const cat = (category || '').toUpperCase();
  if (cat === 'VIP') return 'bg-red-100 text-red-800 border-red-200';
  if (cat === 'PATRON') return 'bg-pink-100 text-pink-800 border-pink-200';
  if (cat === 'GUEST') return 'bg-blue-100 text-blue-800 border-blue-200';
  if (cat === 'DELEGATE') return 'bg-green-100 text-green-800 border-green-200';
  if (cat === 'ORGANISER' || cat === 'ORGANIZER') return 'bg-purple-100 text-purple-800 border-purple-200';
  return 'bg-amber-100 text-amber-800 border-amber-200';
};

/**
 * Generates a random human-readable password for scanner device registration.
 */
export const generateScannerPassword = () => {
  const charset = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let pass = '';
  for (let i = 0; i < 10; i++) {
    pass += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return pass;
};

/**
 * Renders an official event entry pass on a canvas and triggers a PNG download.
 */
export const downloadPassAsImage = (pass, eventName) => {
  return new Promise((resolve, reject) => {
    const displayName = eventName || pass.event_name || 'Swadhyay Event';

    // Parse the event name into lines.
    const splitEventName = (str) => {
      if (!str) return ['Swadhyay Event'];
      // Split by dashes if present
      if (str.includes('-')) {
        return str.split(/\s*-\s*/).map(s => s.trim()).filter(Boolean);
      }

      // Word wrap fallback if no dash exists but the string is long
      const words = str.split(' ');
      const lines = [];
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (testLine.length > 25) {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        lines.push(currentLine);
      }
      return lines;
    };

    const eventTitleLines = splitEventName(displayName).slice(0, 3);
    const numLines = eventTitleLines.length;
    const titleLineHeight = 26;
    const blockHeight = numLines * titleLineHeight;
    const blockCenterY = 210;
    const titleStartY = blockCenterY - (blockHeight / 2) + (titleLineHeight / 2);

    // Calculate dynamic layout variables
    const dividerY = blockCenterY + (blockHeight / 2) + 15;
    const qrFrameTopY = dividerY + 25;
    const qrFrameHeight = 280;
    const guestNameY = qrFrameTopY + qrFrameHeight + 35;
    const passNumBadgeTopY = guestNameY + 28;
    const passNumTextY = passNumBadgeTopY + 16;
    const catBadgeTopY = passNumBadgeTopY + 47;
    const catTextY = catBadgeTopY + 14;
    const bottomDividerY = catBadgeTopY + 65;
    const bottomNoteY = bottomDividerY + 40;
    const cardBorderHeight = bottomNoteY + 45;
    const totalCanvasHeight = cardBorderHeight + 30;

    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = totalCanvasHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    const logoUrl = window.location.origin + ngoLogo;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pass.qr_token)}`;

    // Helper for rounded rectangles
    const drawRoundedRect = (c, x, y, width, height, radius) => {
      c.beginPath();
      c.moveTo(x + radius, y);
      c.lineTo(x + width - radius, y);
      c.quadraticCurveTo(x + width, y, x + width, y + radius);
      c.lineTo(x + width, y + height - radius);
      c.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      c.lineTo(x + radius, y + height);
      c.quadraticCurveTo(x, y + height, x, y + height - radius);
      c.lineTo(x, y + radius);
      c.quadraticCurveTo(x, y, x + radius, y);
      c.closePath();
    };

    // Load images
    const logoImg = new Image();
    const qrImg = new Image();

    logoImg.crossOrigin = 'anonymous';
    qrImg.crossOrigin = 'anonymous';

    let loadedCount = 0;
    const checkLoaded = () => {
      loadedCount++;
      if (loadedCount === 2) {
        renderAndDownload();
      }
    };

    logoImg.onload = checkLoaded;
    qrImg.onload = checkLoaded;
    logoImg.onerror = () => {
      // Fallback if logo fails to load (e.g. CORS or path issue)
      checkLoaded();
    };
    qrImg.onerror = () => {
      reject(new Error(`Failed to load QR code for pass ${pass.pass_number}`));
    };

    logoImg.src = logoUrl;
    qrImg.src = qrUrl;

    const renderAndDownload = () => {
      try {
        // 1. Draw card background with solid white
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Draw card boundary (dashed green border)
        ctx.strokeStyle = '#1b4d3e';
        ctx.lineWidth = 4;
        ctx.setLineDash([8, 8]);
        drawRoundedRect(ctx, 15, 15, 570, cardBorderHeight, 24);
        ctx.stroke();
        ctx.setLineDash([]); // Reset line dash

        // 3. Draw logo (circular)
        if (logoImg.complete && logoImg.naturalWidth !== 0) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(300, 80, 35, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(logoImg, 265, 45, 70, 70);
          ctx.restore();

          // Outer circle border for logo
          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(300, 80, 35, 0, Math.PI * 2);
          ctx.stroke();
        }

        // 4. Draw Org Title
        ctx.fillStyle = '#1b4d3e';
        ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SWADHYAY SEVA FOUNDATION', 300, 140);

        // 5. Draw Pass Label
        ctx.fillStyle = '#d97706';
        ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText('OFFICIAL ENTRY PASS', 300, 168);

        // 6. Draw Event Title
        ctx.fillStyle = '#0f172a';
        ctx.font = numLines > 1
          ? 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          : 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        eventTitleLines.forEach((line, index) => {
          ctx.fillText(line, 300, titleStartY + index * titleLineHeight);
        });

        // Draw solid thin divider line under Event Title
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(50, dividerY);
        ctx.lineTo(550, dividerY);
        ctx.stroke();

        // 7. Draw QR Code Frame (rounded card)
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 2;
        ctx.fillStyle = '#ffffff';
        drawRoundedRect(ctx, 160, qrFrameTopY, 280, 280, 16);
        ctx.fill();
        ctx.stroke();

        // Draw QR code image inside the frame
        ctx.drawImage(qrImg, 180, qrFrameTopY + 20, 240, 240);

        // 8. Draw Guest Name
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(pass.guest_name, 300, guestNameY);

        // 9. Draw Pass Number (badge)
        const passNumText = pass.pass_number || '';
        ctx.font = 'bold 16px monospace';
        const numWidth = ctx.measureText(passNumText).width;

        ctx.fillStyle = '#f1f5f9';
        drawRoundedRect(ctx, 300 - (numWidth + 24) / 2, passNumBadgeTopY, numWidth + 24, 32, 6);
        ctx.fill();

        ctx.fillStyle = '#64748b';
        ctx.fillText(passNumText, 300, passNumTextY);

        // 10. Draw Category Badge
        const categoryText = (pass.category || 'General').toUpperCase();
        ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        const catWidth = ctx.measureText(categoryText).width;

        let catBg = '#d97706'; // default saffron
        if (categoryText === 'VIP') catBg = '#dc2626';
        else if (categoryText === 'PATRON') catBg = '#db2777';
        else if (categoryText === 'GUEST') catBg = '#2563eb';
        else if (categoryText === 'DELEGATE') catBg = '#16a34a';
        else if (categoryText === 'ORGANISER' || categoryText === 'ORGANIZER') catBg = '#7c3aed';

        ctx.fillStyle = catBg;
        drawRoundedRect(ctx, 300 - (catWidth + 28) / 2, catBadgeTopY, catWidth + 28, 28, 14);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.fillText(categoryText, 300, catTextY);

        // 11. Draw bottom note with dashed line
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(50, bottomDividerY);
        ctx.lineTo(550, bottomDividerY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText('Please present this QR code at the entry gate.', 300, bottomNoteY);

        // 12. Trigger image download
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${pass.guest_name.replace(/\s+/g, '_')}_${pass.pass_number}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        resolve();
      } catch (err) {
        reject(err);
      }
    };
  });
};
