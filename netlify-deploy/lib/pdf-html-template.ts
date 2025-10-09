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
    
    /* Header с градиентом и логотипом */
    .header {
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #8b5cf6 100%);
      color: white;
      padding: 24px 24px;
      text-align: center;
      margin: -24mm -24mm 20px -24mm;
      border-radius: 0;
      position: relative;
      overflow: hidden;
    }
    
    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
      opacity: 0.3;
    }
    
    .header-content {
      position: relative;
      z-index: 1;
    }
    
    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 1px;
    }
    
    .logo-icon {
      width: 32px;
      height: 32px;
      background: white;
      border-radius: 8px;
      margin-right: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 900;
      color: #3b82f6;
    }
    
    .header h1 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 6px;
      letter-spacing: -0.5px;
    }
    
    .header .subtitle {
      font-size: 14px;
      font-weight: 400;
      opacity: 0.95;
    }
    
    /* Artist Photo */
    .artist-photo {
      width: 180px;
      height: 180px;
      border-radius: 12px;
      margin: 0 auto 24px auto;
      display: block;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      object-fit: cover;
    }
    
    /* Секции контента */
    .section {
      margin-bottom: 18px;
      padding: 16px 20px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 12px;
      border-left: 4px solid #3b82f6;
      page-break-inside: avoid;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    
    .section h2 {
      font-size: 16px;
      font-weight: 700;
      color: #1e3a8a;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
    }
    
    .section h2::before {
      content: '';
      width: 4px;
      height: 16px;
      background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
      border-radius: 2px;
      margin-right: 8px;
    }
    
    .section p {
      font-size: 13px;
      line-height: 1.6;
      margin-bottom: 6px;
      text-align: justify;
      color: #374151;
    }
    
    /* Highlights список */
    .highlights {
      list-style: none;
      padding: 0;
    }
    
    .highlights li {
      padding: 8px 0;
      border-bottom: 1px solid #e2e8f0;
      font-size: 13px;
      line-height: 1.5;
      color: #374151;
    }
    
    .highlights li:before {
      content: "✦ ";
      color: #3b82f6;
      font-weight: bold;
      margin-right: 8px;
      font-size: 14px;
    }
    
    .highlights li:last-child {
      border-bottom: none;
    }
    
    /* Links */
    .links {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .link-item {
      display: inline-block;
      padding: 6px 12px;
      background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
      color: #0369a1;
      text-decoration: none;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 500;
      border: 1px solid #bae6fd;
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
      <div class="header-content">
        <div class="logo">
          <div class="logo-icon">A</div>
          <span>ArtistOne</span>
        </div>
        <h1>${name}</h1>
        <div class="subtitle">${city} • ${genres.join(', ')}</div>
      </div>
    </div>
    
    <!-- Краткая презентация -->
    <div class="section">
      <h2>Краткая презентация</h2>
      <p>${generated.pitch}</p>
    </div>
    
    <!-- Биография -->
    <div class="section">
      <h2>Биография</h2>
      <p>${generated.bio}</p>
    </div>
    
    <!-- Ключевые достижения -->
    ${generated.highlights && generated.highlights.length > 0 ? `
    <div class="section">
      <h2>Ключевые достижения</h2>
      <ul class="highlights">
        ${generated.highlights.map(highlight => `<li>${highlight}</li>`).join('\n        ')}
      </ul>
    </div>
    ` : ''}
    
    <!-- Ссылки -->
    ${Object.values(links).some(link => link) ? `
    <div class="section">
      <h2>Ссылки</h2>
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
      Создано с помощью ArtistOne • ${new Date().toLocaleDateString('ru-RU', { 
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })}
    </div>
    
    <!-- Watermark -->
    <div class="watermark">ArtistOne EPK v1.0</div>
  </div>
</body>
</html>
  `.trim();
}
