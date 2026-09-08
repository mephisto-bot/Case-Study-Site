/**
 * Dynamic CIH Case Study Registration Ticket Generator
 * Uses the authentic CIH Entry Ticket template (Group 3(1).png) as the base layer,
 * and dynamically overlays session Date, Time, Location/Link, and Topic with zero overlap.
 */

export interface TicketDetails {
  date: string;
  time?: string;
  location?: string;
  topic?: string;
  attendeeName?: string;
}

/**
 * Cleans string of any redundant prefixes that are already printed on the template
 */
function cleanValue(text: string, prefixToRemove: string): string {
  let val = (text || '').trim();
  const lower = val.toLowerCase();
  const pLower = prefixToRemove.toLowerCase();
  if (lower.startsWith(pLower)) {
    val = val.substring(prefixToRemove.length).replace(/^[:\s\-]+/, '').trim();
  }
  return val;
}

/**
 * Generates a high-resolution PNG data URL by superimposing dynamic session fields
 * onto the authentic CIH Entry Ticket image template.
 */
export async function generateTicketImage(details: TicketDetails): Promise<string> {
  // Canvas matching the authentic template dimensions (1500 x 2024)
  const width = 1500;
  const height = 2024;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // 1. Load Base Entry Ticket Template Image
  const templateImg = new Image();
  templateImg.crossOrigin = 'anonymous';
  templateImg.src = '/images/entry-ticket.png';

  await new Promise<void>((resolve) => {
    templateImg.onload = () => resolve();
    templateImg.onerror = () => {
      templateImg.src = '/images/ticket-template.png';
      templateImg.onload = () => resolve();
      templateImg.onerror = () => resolve();
    };
  });

  if (templateImg.width > 0) {
    ctx.drawImage(templateImg, 0, 0, width, height);
  } else {
    ctx.fillStyle = '#061325';
    ctx.fillRect(0, 0, width, height);
  }

  // Helper to render auto-wrapped bold centered text inside card slots below the orange underline
  function renderCardText(
    rawText: string,
    centerX: number,
    centerY: number,
    maxW: number,
    baseFontSize = 22,
    color = '#061325'
  ) {
    const text = rawText.trim();
    if (!text) return;

    ctx!.fillStyle = color;
    ctx!.textAlign = 'center';
    ctx!.textBaseline = 'middle';
    ctx!.font = `800 ${baseFontSize}px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;

    const words = text.split(' ');
    let line = '';
    const lines: string[] = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx!.measureText(testLine);
      if (metrics.width > maxW && n > 0) {
        lines.push(line.trim());
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line.trim());

    if (lines.length > 2) {
      const reducedSize = Math.max(15, baseFontSize - 5);
      ctx!.font = `800 ${reducedSize}px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      const lineHeight = reducedSize + 5;
      const initialY = centerY - ((lines.length - 1) * lineHeight) / 2;
      lines.forEach((l, i) => {
        ctx!.fillText(l, centerX, initialY + i * lineHeight);
      });
    } else if (lines.length === 2) {
      const reducedSize = Math.max(17, baseFontSize - 3);
      ctx!.font = `800 ${reducedSize}px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      const lineHeight = reducedSize + 6;
      const initialY = centerY - lineHeight / 2;
      lines.forEach((l, i) => {
        ctx!.fillText(l, centerX, initialY + i * lineHeight);
      });
    } else {
      ctx!.fillText(lines[0], centerX, centerY);
    }
  }

  // 2. Clean values to ensure no duplicate prefixes
  const displayDate = cleanValue(details.date || 'Wednesday, Sep 2, 2026', 'date');
  const displayTime = cleanValue(details.time || '10:00 AM - 4:00 PM (WAT)', 'time');
  const displayLocation = cleanValue(
    details.location || 'Plot 104, 5th Ave Abesan Estate, Ipaja - Strictly On-Site',
    'location'
  ).replace(/•/g, '-');
  const displayTopic = cleanValue(
    details.topic || 'Cognitive Agility, Mental Models & Leadership IKIGAI',
    'topic'
  );

  // 3. Render in the calibrated white space below the orange underlines
  // Card 1: DATE (Top-Left) -> Center X: 435, Center Y: 1070
  renderCardText(displayDate, 435, 1070, 500, 25, '#061325');

  // Card 2: TIME (Top-Right) -> Center X: 1065, Center Y: 1070
  renderCardText(displayTime, 1065, 1070, 500, 22, '#061325');

  // Card 3: LOCATION/LINK (Bottom-Left) -> Center X: 435, Center Y: 1455
  renderCardText(displayLocation, 435, 1455, 500, 19, '#061325');

  // Card 4: TOPIC (Bottom-Right) -> Center X: 1065, Center Y: 1455
  renderCardText(displayTopic, 1065, 1455, 500, 20, '#061325');

  return canvas.toDataURL('image/jpeg', 0.88);
}

/**
 * Triggers instant download of the official ticket PNG
 */
export async function downloadTicketPNG(details: TicketDetails): Promise<void> {
  const dataUrl = await generateTicketImage(details);
  const link = document.createElement('a');
  const safeDate = (details.date || 'session').replace(/[^a-zA-Z0-9]/g, '-');
  link.download = `CIH-Wednesday-Pass-${safeDate}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
