import { ArtistData } from '@/types';
import { PDFDocument, rgb, RotationTypes } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

// Fallback PDF генератор: локально собираем PDF без Chromium
export async function generatePDFFallback(artistData: ArtistData): Promise<Buffer> {
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 points

    // Load Cyrillic-capable fonts (Noto Sans) from public/fonts
    // We read from the deployed bundle's working directory
    const fontsDir = path.join(process.cwd(), 'public', 'fonts');
    const regularFontPath = path.join(fontsDir, 'NotoSans-Regular.ttf');
    const boldFontPath = path.join(fontsDir, 'NotoSans-Bold.ttf');

    let regularFontBytes: Uint8Array | null = null;
    let boldFontBytes: Uint8Array | null = null;
    try {
      regularFontBytes = fs.readFileSync(regularFontPath);
      boldFontBytes = fs.readFileSync(boldFontPath);
    } catch {
      // If reading from filesystem fails (serverless layout), try fallback relative paths
      try {
        const altRegular = path.resolve('public/fonts/NotoSans-Regular.ttf');
        const altBold = path.resolve('public/fonts/NotoSans-Bold.ttf');
        regularFontBytes = fs.readFileSync(altRegular);
        boldFontBytes = fs.readFileSync(altBold);
      } catch {}
    }

    // Embed fonts; if unavailable, pdf-lib will still allow standard fonts but Cyrillic may not render
    const regularFont = regularFontBytes ? await pdfDoc.embedFont(regularFontBytes) : undefined;
    const boldFont = boldFontBytes ? await pdfDoc.embedFont(boldFontBytes) : regularFont;

    // Фон
    page.drawRectangle({ x: 0, y: 0, width: page.getWidth(), height: page.getHeight(), color: rgb(1, 1, 1) });

    // Водяной знак
    const watermark = 'ARTISTONE';
    const font = boldFont || (regularFont as any);
    const fontSizeWatermark = 64;
    const textWidth = font.widthOfTextAtSize(watermark, fontSizeWatermark);
    const textHeight = font.heightAtSize(fontSizeWatermark);
    page.drawText(watermark, {
      x: (page.getWidth() - textWidth) / 2,
      y: (page.getHeight() - textHeight) / 2,
      size: fontSizeWatermark,
      font,
      color: rgb(0.23, 0.51, 0.96),
      opacity: 0.08,
      rotate: { type: RotationTypes.Degrees, angle: -30 },
    });

    // Заголовок
    const titleSize = 22;
    page.drawText(`EPK — ${artistData.name}`, { x: 48, y: 780, size: titleSize, font: font || undefined, color: rgb(0.12, 0.19, 0.35) });

    // Подзаголовок
    const subFont = regularFont || font;
    page.drawText(`${artistData.city} • ${artistData.genres.join(', ')}`, { x: 48, y: 758, size: 12, font: subFont || undefined, color: rgb(0.25, 0.4, 0.8) });

    // Фото, если есть data URL (jpeg/png)
    let nextY = 720;
    const photoUrl = artistData.photoUrl || artistData.originalPhotoUrl;
    if (photoUrl && photoUrl.startsWith('data:')) {
      const isPng = photoUrl.startsWith('data:image/png');
      const base64 = photoUrl.split(',')[1] || '';
      const bytes = Buffer.from(base64, 'base64');
      try {
        const img = isPng ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes);
        const imgWidth = 160;
        const scale = imgWidth / img.width;
        const imgHeight = img.height * scale;
        page.drawImage(img, { x: 48, y: nextY - imgHeight, width: imgWidth, height: imgHeight });
      } catch {}
    }

    // Контент
    const left = 48;
    let y = 700;
    const writeBlock = (title: string, text: string) => {
      page.drawText(title, { x: left, y, size: 12, font: font || undefined, color: rgb(0.12, 0.19, 0.35) });
      y -= 16;
      const wrapped = wrapText(text || '', 80);
      wrapped.forEach((line) => {
        page.drawText(line, { x: left, y, size: 11, font: subFont || undefined, color: rgb(0.21, 0.22, 0.25) });
        y -= 14;
      });
      y -= 8;
    };

    writeBlock('Краткая презентация', artistData.generated?.pitch || '');
    writeBlock('Биография', artistData.generated?.bio || '');
    writeBlock('Ключевые достижения', (artistData.generated?.highlights || []).map((h) => `• ${h}`).join('\n'));

    const linksList = Object.entries(artistData.links || {})
      .filter(([, link]) => link)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');
    writeBlock('Ссылки', linksList);

    // Footer
    page.drawText('Создано с помощью ArtistOne', { x: left, y: 36, size: 10, font: subFont || undefined, color: rgb(0.55, 0.58, 0.62) });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  } catch (e) {
    // В крайнем случае — пустой корректный PDF
    const doc = await PDFDocument.create();
    doc.addPage();
    const bytes = await doc.save();
    return Buffer.from(bytes);
  }
}

function wrapText(text: string, maxChars: number): string[] {
  const lines: string[] = [];
  const words = text.split(/\s+/);
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > maxChars) {
      if (line) lines.push(line.trim());
      line = w;
    } else {
      line += (line ? ' ' : '') + w;
    }
  }
  if (line) lines.push(line.trim());
  return lines;
}
