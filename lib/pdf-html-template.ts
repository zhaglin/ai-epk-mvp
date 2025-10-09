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
  
  <style>
    /* Настройка страницы для PDF */
    @page {
      size: A4;
      margin: 15mm;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: system-ui, -apple-system, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
      font-size: 13px;
      line-height: 1.6;
      color: #1f2937;
      background: white;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    .container {
      max-width: 100%;
      margin: 0 auto;
      position: relative;
    }
    
    /* Header с градиентом */
    .header {
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #8b5cf6 100%);
      color: white;
      padding: 30px 0;
      text-align: center;
      margin: -15mm -15mm 30px -15mm;
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
      padding: 0 20px;
    }
    
    .logo {
      display: inline-flex;
      align-items: center;
      margin-bottom: 20px;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 1px;
    }
    
    .logo-icon {
      width: 28px;
      height: 28px;
      background: white;
      border-radius: 6px;
      margin-right: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 900;
      color: #3b82f6;
    }
    
    .header h1 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .header .subtitle {
      font-size: 16px;
      font-weight: 400;
      opacity: 0.95;
    }
    
    /* Основной контент с фото и текстом */
    .main-content {
      display: flex;
      gap: 30px;
      margin-bottom: 30px;
    }
    
    /* Фото артиста */
    .photo-section {
      flex: 0 0 200px;
    }
    
    .artist-photo {
      width: 200px;
      height: 200px;
      border-radius: 16px;
      object-fit: cover;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      border: 3px solid white;
    }
    
    /* Контент справа от фото */
    .content-section {
      flex: 1;
      padding-top: 10px;
    }
    
    /* Секции контента */
    .section {
      margin-bottom: 25px;
      padding: 20px 24px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 16px;
      border-left: 5px solid #3b82f6;
      page-break-inside: avoid;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      position: relative;
    }
    
    .section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(139, 92, 246, 0.02) 100%);
      border-radius: 16px;
      z-index: 0;
    }
    
    .section > * {
      position: relative;
      z-index: 1;
    }
    
    .section h2 {
      font-size: 18px;
      font-weight: 700;
      color: #1e3a8a;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
    }
    
    .section h2::before {
      content: '';
      width: 5px;
      height: 20px;
      background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
      border-radius: 3px;
      margin-right: 10px;
    }
    
    .section p {
      font-size: 14px;
      line-height: 1.7;
      margin-bottom: 8px;
      text-align: justify;
      color: #374151;
    }
    
    /* Highlights список */
    .highlights {
      list-style: none;
      padding: 0;
    }
    
    .highlights li {
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
      font-size: 14px;
      line-height: 1.6;
      color: #374151;
      position: relative;
      padding-left: 25px;
    }
    
    .highlights li:before {
      content: "✦";
      color: #3b82f6;
      font-weight: bold;
      position: absolute;
      left: 0;
      top: 10px;
      font-size: 16px;
    }
    
    .highlights li:last-child {
      border-bottom: none;
    }
    
    /* Links */
    .links {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
    }
    
    .link-item {
      display: inline-block;
      padding: 10px 16px;
      background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
      color: #0369a1;
      text-decoration: none;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 500;
      border: 1px solid #bae6fd;
      transition: all 0.2s ease;
    }
    
    /* Footer */
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      color: #6b7280;
      font-size: 12px;
      position: relative;
    }
    
    .footer::before {
      content: '';
      position: absolute;
      top: -1px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 2px;
      background: linear-gradient(to right, #3b82f6, #8b5cf6);
    }
    
    /* Watermark */
    .watermark {
      position: fixed;
      bottom: 10mm;
      right: 10mm;
      font-size: 9px;
      color: #d1d5db;
      opacity: 0.4;
      font-weight: 500;
    }
    
    /* Адаптивность для PDF */
    @media print {
      .main-content {
        display: flex !important;
        gap: 25px !important;
      }
      
      .photo-section {
        flex: 0 0 180px !important;
      }
      
      .artist-photo {
        width: 180px !important;
        height: 180px !important;
      }
    }
  </style>
</head>
<body>
  <div class="container">
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
    
    <!-- Основной контент -->
    <div class="main-content">
      <!-- Фото артиста -->
      <div class="photo-section">
        ${photoUrl ? `<img src="${baseUrl}${photoUrl}" alt="${name}" class="artist-photo" />` : '<div class="artist-photo" style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 14px;">Нет фото</div>'}
      </div>
      
      <!-- Контент справа -->
      <div class="content-section">
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
      </div>
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
