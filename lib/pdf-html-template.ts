import { ArtistData } from '@/types';

// HTML шаблон для генерации PDF с полной поддержкой кириллицы
export function generateHTMLTemplate(artistData: ArtistData): string {
  const { name, city, genres, links, generated, photoUrl } = artistData;

  if (!generated) {
    throw new Error('Generated BIO data is missing.');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EPK - ${name}</title>
  
  <!-- Предзагрузка шрифтов для быстрого рендера -->
  <link rel="preload" href="${baseUrl}/fonts/NotoSans-Regular.ttf" as="font" type="font/ttf" crossorigin>
  <link rel="preload" href="${baseUrl}/fonts/NotoSans-Bold.ttf" as="font" type="font/ttf" crossorigin>
  
  <style>
    /* Регистрация кириллических шрифтов */
    @font-face {
      font-family: 'Noto Sans';
      src: url('${baseUrl}/fonts/NotoSans-Regular.ttf') format('truetype');
      font-weight: 400;
      font-style: normal;
      unicode-range: U+0400-04FF, U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    
    @font-face {
      font-family: 'Noto Sans';
      src: url('${baseUrl}/fonts/NotoSans-Bold.ttf') format('truetype');
      font-weight: 700;
      font-style: normal;
      unicode-range: U+0400-04FF, U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    
    /* Настройка страницы для PDF */
    @page {
      size: A4;
      margin: 24mm;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: "Noto Sans", system-ui, -apple-system, "Segoe UI", sans-serif;
      font-size: 14px;
      line-height: 1.6;
      color: #333;
      background: white;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    .container {
      max-width: 100%;
      margin: 0 auto;
    }
    
    /* Header с градиентом */
    .header {
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      color: white;
      padding: 32px 24px;
      text-align: center;
      margin: -24mm -24mm 24px -24mm;
      border-radius: 0;
    }
    
    .header h1 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }
    
    .header .subtitle {
      font-size: 16px;
      font-weight: 400;
      opacity: 0.95;
    }
    
    /* Artist Photo */
    .artist-photo {
      width: 100%;
      max-width: 200px;
      height: auto;
      border-radius: 12px;
      margin: 0 auto 24px auto;
      display: block;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      object-fit: cover;
    }
    
    /* Секции контента */
    .section {
      margin-bottom: 24px;
      padding: 20px;
      background: #f8fafc;
      border-radius: 8px;
      border-left: 4px solid #3b82f6;
      page-break-inside: avoid;
    }
    
    .section h2 {
      font-size: 18px;
      font-weight: 700;
      color: #1e3a8a;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .section p {
      font-size: 14px;
      line-height: 1.7;
      margin-bottom: 8px;
      text-align: justify;
    }
    
    /* Highlights список */
    .highlights {
      list-style: none;
      padding: 0;
    }
    
    .highlights li {
      padding: 10px 0;
      border-bottom: 1px solid #e2e8f0;
      font-size: 14px;
      line-height: 1.6;
    }
    
    .highlights li:before {
      content: "★ ";
      color: #f59e0b;
      font-weight: bold;
      margin-right: 8px;
    }
    
    .highlights li:last-child {
      border-bottom: none;
    }
    
    /* Links */
    .links {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    
    .link-item {
      display: inline-block;
      padding: 8px 16px;
      background: #e0f2fe;
      color: #0369a1;
      text-decoration: none;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
    }
    
    /* Footer */
    .footer {
      text-align: center;
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
      color: #64748b;
      font-size: 11px;
    }
    
    /* Watermark (скрытый) */
    .watermark {
      position: fixed;
      bottom: 5mm;
      right: 5mm;
      font-size: 8px;
      color: #cbd5e1;
      opacity: 0.3;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Artist Photo -->
    ${photoUrl ? `<img src="${baseUrl}${photoUrl}" alt="${name}" class="artist-photo" />` : ''}
    
    <!-- Header -->
    <div class="header">
      <h1>${name}</h1>
      <div class="subtitle">${city} • ${genres.join(', ')}</div>
    </div>
    
    <!-- Elevator Pitch -->
    <div class="section">
      <h2>ELEVATOR PITCH</h2>
      <p>${generated.pitch}</p>
    </div>
    
    <!-- Biography -->
    <div class="section">
      <h2>BIOGRAPHY</h2>
      <p>${generated.bio}</p>
    </div>
    
    <!-- Key Highlights -->
    ${generated.highlights && generated.highlights.length > 0 ? `
    <div class="section">
      <h2>KEY HIGHLIGHTS</h2>
      <ul class="highlights">
        ${generated.highlights.map(highlight => `<li>${highlight}</li>`).join('\n        ')}
      </ul>
    </div>
    ` : ''}
    
    <!-- Links -->
    ${Object.values(links).some(link => link) ? `
    <div class="section">
      <h2>LINKS</h2>
      <div class="links">
        ${links.instagram ? `<div class="link-item">Instagram: ${links.instagram}</div>` : ''}
        ${links.soundcloud ? `<div class="link-item">SoundCloud: ${links.soundcloud}</div>` : ''}
        ${links.mixcloud ? `<div class="link-item">Mixcloud: ${links.mixcloud}</div>` : ''}
        ${links.website ? `<div class="link-item">Website: ${links.website}</div>` : ''}
      </div>
    </div>
    ` : ''}
    
    <!-- Footer -->
    <div class="footer">
      Generated by AI-EPK • ${new Date().toLocaleDateString('ru-RU', { 
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })}
    </div>
    
    <!-- Watermark -->
    <div class="watermark">EPK v1.0 (chromium)</div>
  </div>
</body>
</html>
  `.trim();
}
