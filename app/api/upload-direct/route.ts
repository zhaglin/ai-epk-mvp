import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// DECISION-UPLOAD-RUNTIME-001: Принудительный Node.js runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * EPIC D: Direct-to-Cloud upload endpoint
 * Фоллбэк стратегия для загрузки файлов напрямую в облако
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { publicUrl, fileName, fileSize, mimeType } = body;

    if (!publicUrl || !fileName) {
      return NextResponse.json(
        { 
          error: 'ERR_MISSING_DATA',
          message: 'Отсутствуют обязательные данные: publicUrl и fileName',
          requestId: uuidv4()
        },
        { status: 400 }
      );
    }

    // Валидация размера файла
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (fileSize && fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          error: 'ERR_SIZE_LIMIT',
          message: `Файл слишком большой (${Math.round(fileSize / 1024 / 1024)} MB). Максимальный размер: ${Math.round(MAX_FILE_SIZE / 1024 / 1024)} MB.`,
          fileSize,
          maxSize: MAX_FILE_SIZE,
          requestId: uuidv4()
        },
        { status: 413 }
      );
    }

    // Валидация типа файла
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    if (mimeType && !ALLOWED_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { 
          error: 'ERR_UNSUPPORTED_TYPE',
          message: `Неподдерживаемый формат файла. Используйте JPEG, PNG или WebP.`,
          allowedTypes: ALLOWED_TYPES,
          requestId: uuidv4()
        },
        { status: 400 }
      );
    }

    const fileId = uuidv4();
    const fileExtension = fileName.split('.').pop() || 'jpg';

    console.log('[Direct Upload] File accepted:', {
      fileId,
      fileName,
      publicUrl,
      fileSize,
      mimeType
    });

    return NextResponse.json({
      success: true,
      fileId,
      fileName,
      publicUrl,
      size: fileSize || 0,
      type: mimeType || 'image/jpeg',
      uploadStrategy: 'direct'
    });

  } catch (error) {
    console.error('[Direct Upload] Error:', error);
    
    const requestId = uuidv4();
    return NextResponse.json(
      { 
        error: 'ERR_DIRECT_UPLOAD_FAILED',
        message: 'Ошибка при обработке прямого аплоада.',
        requestId,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Обработка OPTIONS запроса для CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
