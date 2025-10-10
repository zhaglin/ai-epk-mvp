import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

// DECISION-UPLOAD-RUNTIME-001: Принудительный Node.js runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// DECISION-SIZE-LIMITS-001: Лимиты клиент ≤ 8 MB, сервер ≤ 10 MB
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB для сервера
const CLIENT_MAX_SIZE = 8 * 1024 * 1024; // 8MB для клиента

// Поддерживаемые типы изображений
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// DECISION-TMP-STORAGE-001: Временное хранилище — /tmp/artistone/uploads
async function ensureDirectories() {
  const uploadsDir = process.env.NETLIFY 
    ? '/tmp/artistone/uploads'
    : join(process.cwd(), 'tmp', 'uploads');
  
  const generatedDir = process.env.NETLIFY
    ? '/tmp/artistone/generated'
    : join(process.cwd(), 'public', 'generated');
  
  console.log('[Upload] Creating directories:', {
    uploadsDir,
    generatedDir,
    isNetlify: !!process.env.NETLIFY
  });
  
  try {
    await mkdir(uploadsDir, { recursive: true });
    console.log('[Upload] Created uploads directory:', uploadsDir);
    
    await mkdir(generatedDir, { recursive: true });
    console.log('[Upload] Created generated directory:', generatedDir);
  } catch (error) {
    console.error('[Upload] Error creating directories:', error);
    throw new Error(`Failed to create directories: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  return { uploadsDir, generatedDir };
}

export async function POST(request: NextRequest) {
  try {
    console.log('[Upload] Starting file upload...');
    console.log('[Upload] Environment check:', {
      isNetlify: !!process.env.NETLIFY,
      nodeEnv: process.env.NODE_ENV,
      platform: process.platform
    });
    
    // Получаем данные формы
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      console.log('[Upload] No file provided in form data');
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }
    
    console.log('[Upload] File received:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    // DECISION-SIZE-LIMITS-001: Валидация размера файла
    console.log('[Upload] File size validation:', {
      fileSize: file.size,
      maxSize: MAX_FILE_SIZE,
      clientMaxSize: CLIENT_MAX_SIZE,
      isTooLarge: file.size > MAX_FILE_SIZE
    });
    
    if (file.size > MAX_FILE_SIZE) {
      console.log('[Upload] File too large, rejecting upload');
      return NextResponse.json(
        { 
          error: 'ERR_SIZE_LIMIT',
          message: `Файл слишком большой (${Math.round(file.size / 1024 / 1024)} MB). Максимальный размер: ${Math.round(MAX_FILE_SIZE / 1024 / 1024)} MB.`,
          fileSize: file.size,
          maxSize: MAX_FILE_SIZE,
          requestId: uuidv4()
        },
        { status: 413 }
      );
    }
    
    // Валидация типа файла
    if (!ALLOWED_TYPES.includes(file.type)) {
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
    
    // Создаем уникальный ID для файла
    const fileId = uuidv4();
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${fileId}.${fileExtension}`;
    
    // Конвертируем File в Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Оптимизируем изображение с помощью Sharp
    const optimizedBuffer = await sharp(buffer)
      .resize(1024, 1024, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ quality: 85 })
      .toBuffer();
    
    console.log('[Upload] Image optimized:', {
      originalSize: buffer.length,
      optimizedSize: optimizedBuffer.length
    });
    
    // Создаем директории и получаем пути
    const { uploadsDir } = await ensureDirectories();
    console.log('[Upload] Directories created:', { uploadsDir });
    
    // Сохраняем файл во временную папку
    const tempPath = join(uploadsDir, fileName);
    console.log('[Upload] Attempting to save file to:', tempPath);
    
    try {
      await writeFile(tempPath, optimizedBuffer);
      console.log('[Upload] File saved successfully to:', tempPath);
    } catch (writeError) {
      console.error('[Upload] Failed to write file:', writeError);
      throw new Error(`Failed to write file to ${tempPath}: ${writeError instanceof Error ? writeError.message : 'Unknown error'}`);
    }
    
    // Создаем URL для доступа к файлу
    const tempUrl = `/api/temp-file/${fileName}`;
    
    console.log('[Upload] File saved successfully:', {
      fileId,
      fileName,
      tempUrl,
      size: optimizedBuffer.length
    });
    
    return NextResponse.json({
      success: true,
      fileId,
      fileName,
      tempUrl,
      size: optimizedBuffer.length,
      type: 'image/jpeg'
    });
    
  } catch (error) {
    console.error('[Upload] Error uploading file:', error);
    
    // DECISION-E1: Унифицированные ответы ошибок
    const requestId = uuidv4();
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
      environment: {
        isNetlify: !!process.env.NETLIFY,
        nodeEnv: process.env.NODE_ENV,
        platform: process.platform,
        runtime: 'nodejs'
      }
    };
    
    console.error('[Upload] Detailed error info:', {
      requestId,
      ...errorDetails
    });
    
    // Определяем тип ошибки
    let errorCode = 'ERR_UPLOAD_FAILED';
    let statusCode = 500;
    let userMessage = 'Ошибка при загрузке файла. Попробуйте еще раз.';
    
    if (error instanceof Error) {
      if (error.message.includes('ENOENT')) {
        errorCode = 'ERR_TMP_ACCESS';
        userMessage = 'Ошибка доступа к временной папке.';
      } else if (error.message.includes('timeout')) {
        errorCode = 'ERR_TIMEOUT';
        userMessage = 'Превышено время ожидания загрузки.';
        statusCode = 408;
      }
    }
    
    return NextResponse.json(
      { 
        error: errorCode,
        message: userMessage,
        requestId,
        details: errorDetails.message,
        debug: process.env.NODE_ENV === 'development' ? errorDetails : undefined
      },
      { status: statusCode }
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
