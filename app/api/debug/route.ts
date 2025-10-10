import { NextRequest, NextResponse } from 'next/server';

/**
 * Debug endpoint для диагностики проблем на Netlify
 */
export async function GET(request: NextRequest) {
  try {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      isNetlify: !!process.env.NETLIFY,
      // Проверяем переменные окружения (без значений для безопасности)
      hasOpenAI: !!process.env.OPENAI_API_KEY,
      hasReplicate: !!process.env.REPLICATE_API_TOKEN,
      hasBaseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
      // Информация о системе
      platform: process.platform,
      nodeVersion: process.version,
      // Проверяем доступность директорий
      tmpDir: process.env.NETLIFY ? '/tmp' : process.cwd() + '/tmp',
      // Информация о запросе
      userAgent: request.headers.get('user-agent'),
      origin: request.headers.get('origin'),
    };

    return NextResponse.json({
      status: 'success',
      message: 'Debug info collected',
      data: debugInfo
    });
  } catch (error) {
    console.error('[Debug] Error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to collect debug info',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testType } = body;

    if (testType === 'file-upload') {
      // Тестируем загрузку файла
      return NextResponse.json({
        status: 'success',
        message: 'File upload test endpoint ready',
        testType: 'file-upload'
      });
    }

    if (testType === 'replicate') {
      // Тестируем Replicate API
      const hasToken = !!process.env.REPLICATE_API_TOKEN;
      return NextResponse.json({
        status: hasToken ? 'success' : 'error',
        message: hasToken ? 'Replicate token is configured' : 'Replicate token is missing',
        hasToken
      });
    }

    return NextResponse.json({
      status: 'error',
      message: 'Unknown test type'
    }, { status: 400 });

  } catch (error) {
    console.error('[Debug POST] Error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Debug test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
