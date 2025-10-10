import { NextRequest, NextResponse } from 'next/server';

// DECISION-UPLOAD-RUNTIME-001: Принудительный Node.js runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * EPIC E: Debug endpoint для диагностики проблем на Netlify
 */
export async function GET(request: NextRequest) {
  try {
    // EPIC E3: Обновленный debug endpoint
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      isNetlify: process.env.NODE_ENV === 'production' && process.platform === 'linux' && !!process.env.AWS_LAMBDA_FUNCTION_NAME,
      runtime: 'nodejs', // Подтверждаем runtime
      // Проверяем переменные окружения (без значений для безопасности)
      hasOpenAI: !!process.env.OPENAI_API_KEY,
      openAiKeyLength: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0,
      openAiKeyPrefix: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 10) : null,
      hasReplicate: !!process.env.REPLICATE_API_TOKEN,
      replicateKeyLength: process.env.REPLICATE_API_TOKEN ? process.env.REPLICATE_API_TOKEN.length : 0,
      hasBaseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
      // EPIC D: Проверяем стратегию загрузки
      uploadStrategy: process.env.UPLOAD_STRATEGY || 'server',
      // Информация о системе
      platform: process.platform,
      nodeVersion: process.version,
      // Проверяем доступность директорий
      tmpDir: (process.env.NODE_ENV === 'production' && process.platform === 'linux' && !!process.env.AWS_LAMBDA_FUNCTION_NAME) ? '/tmp' : process.cwd() + '/tmp',
      uploadsDir: (process.env.NODE_ENV === 'production' && process.platform === 'linux' && !!process.env.AWS_LAMBDA_FUNCTION_NAME) ? '/tmp/uploads' : process.cwd() + '/tmp/uploads',
      generatedDir: (process.env.NODE_ENV === 'production' && process.platform === 'linux' && !!process.env.AWS_LAMBDA_FUNCTION_NAME) ? '/tmp' : process.cwd() + '/public/generated',
      // Лимиты
      maxFileSize: '10MB',
      clientMaxSize: '8MB',
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

    if (testType === 'openai') {
      // Тестируем OpenAI API
      const hasKey = !!process.env.OPENAI_API_KEY;
      const keyLength = process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0;
      
      if (!hasKey || keyLength === 0) {
        return NextResponse.json({
          status: 'error',
          message: 'OpenAI API key is missing or empty',
          hasKey,
          keyLength
        });
      }

      try {
        // Тестируем реальный запрос к OpenAI
        const response = await fetch('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        
        return NextResponse.json({
          status: response.ok ? 'success' : 'error',
          message: response.ok ? 'OpenAI API key is valid' : 'OpenAI API key is invalid',
          httpStatus: response.status,
          error: data.error || null,
          hasKey,
          keyLength
        });
      } catch (error) {
        return NextResponse.json({
          status: 'error',
          message: 'Failed to test OpenAI API',
          error: error instanceof Error ? error.message : 'Unknown error',
          hasKey,
          keyLength
        });
      }
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
