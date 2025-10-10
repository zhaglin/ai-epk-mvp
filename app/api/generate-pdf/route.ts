import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { generateHTMLTemplate } from '@/lib/pdf-html-template';
import { generatePDFFallback } from '@/lib/pdf-fallback';
import { ArtistData } from '@/types';

// DECISION-UPLOAD-RUNTIME-001: Принудительный Node.js runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  let browser = null;
  let artistData: ArtistData | null = null;

  try {
    console.log('[PDF] Starting PDF generation...');
    
    // Получаем данные артиста
    artistData = await request.json();
    
    if (!artistData || !artistData.name || !artistData.generated) {
      return NextResponse.json(
        { error: 'Missing required data: name and generated BIO' },
        { status: 400 }
      );
    }

    console.log(`[PDF] Generating PDF for: ${artistData.name}`);

    // Генерируем HTML контент
    const htmlContent = generateHTMLTemplate(artistData);
    
    // Определяем путь к Chrome/Chromium
    let executablePath: string;
    
    // В development используем локальный Chrome
    if (process.env.NODE_ENV === 'development') {
      // Пути для разных ОС
      const possiblePaths = [
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // macOS
        '/usr/bin/google-chrome', // Linux
        '/usr/bin/chromium-browser', // Linux Chromium
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Windows
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', // Windows 32-bit
      ];
      
      // Проверяем доступные пути
      const fs = await import('fs');
      executablePath = possiblePaths.find(path => fs.existsSync(path)) || possiblePaths[0];
    } else {
      // В production используем Chromium для serverless
      executablePath = await chromium.executablePath();
    }

    console.log('[PDF] Launching browser...');

    // Запускаем Puppeteer
    const launchOptions: any = {
      defaultViewport: {
        width: 1280,
        height: 1024,
      },
      executablePath,
      headless: true,
    };

    // В development используем минимальные аргументы, в production - Chromium args
    if (process.env.NODE_ENV === 'development') {
      launchOptions.args = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ];
    } else {
      launchOptions.args = chromium.args;
    }

    browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();
    
    console.log('[PDF] Setting content...');

    // Устанавливаем HTML контент
    await page.setContent(htmlContent, {
      waitUntil: ['networkidle0', 'load'],
      timeout: 30000,
    });

    // Ждем загрузки шрифтов
    await page.evaluateHandle('document.fonts.ready');
    
    console.log('[PDF] Generating PDF...');

    // Генерируем PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm',
      },
      preferCSSPageSize: true,
    });

    await browser.close();
    browser = null;

    console.log('[PDF] PDF generated successfully!');

    // Создаем slug для имени файла
    const slug = artistData.name
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_-]/g, '');

    // Возвращаем PDF
    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="EPK_${slug}.pdf"`,
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('[PDF] Error generating PDF with Puppeteer:', error);
    
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('[PDF] Error closing browser:', closeError);
      }
    }

    // Пробуем fallback метод (только если artistData инициализирован)
    if (artistData) {
      try {
        console.log('[PDF] Trying fallback PDF generation...');
        const pdfBuffer = await generatePDFFallback(artistData);
        
        const slug = artistData.name
          .replace(/\s+/g, '_')
          .replace(/[^a-zA-Z0-9_-]/g, '');

        return new NextResponse(Buffer.from(pdfBuffer), {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="EPK_${slug}.pdf"`,
            'Cache-Control': 'no-cache',
          },
        });
        
      } catch (fallbackError) {
        console.error('[PDF] Fallback also failed:', fallbackError);
        
        return NextResponse.json(
          { 
            error: 'Failed to generate PDF with both methods',
            details: error instanceof Error ? error.message : 'Unknown error',
            fallbackError: fallbackError instanceof Error ? fallbackError.message : 'Unknown fallback error'
          },
          { status: 500 }
        );
      }
    }
    
    // Если artistData не инициализирован, возвращаем ошибку парсинга
    return NextResponse.json(
      { 
        error: 'Failed to parse request data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
