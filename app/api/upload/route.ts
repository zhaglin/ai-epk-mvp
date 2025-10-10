import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

// Максимальный размер файла: 2MB (уменьшено для Netlify)
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

// Поддерживаемые типы изображений
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Создаем директории для хранения файлов
async function ensureDirectories() {
  // На Netlify используем /tmp для временных файлов
  const uploadsDir = process.env.NETLIFY 
    ? '/tmp/uploads'
    : join(process.cwd(), 'tmp', 'uploads');
  
  const generatedDir = process.env.NETLIFY
    ? '/tmp/generated'
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
    
    // Валидация размера файла
    console.log('[Upload] File size validation:', {
      fileSize: file.size,
      maxSize: MAX_FILE_SIZE,
      isTooLarge: file.size > MAX_FILE_SIZE
    });
    
    if (file.size > MAX_FILE_SIZE) {
      console.log('[Upload] File too large, rejecting upload');
      return NextResponse.json(
        { 
          error: 'File too large. Maximum size is 2MB.',
          fileSize: file.size,
          maxSize: MAX_FILE_SIZE 
        },
        { status: 400 }
      );
    }
    
    // Валидация типа файла
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { 
          error: 'Unsupported file type. Please use JPEG, PNG, or WebP.',
          allowedTypes: ALLOWED_TYPES 
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
    
    // Детальная информация об ошибке для диагностики
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
      environment: {
        isNetlify: !!process.env.NETLIFY,
        nodeEnv: process.env.NODE_ENV,
        platform: process.platform
      }
    };
    
    console.error('[Upload] Detailed error info:', errorDetails);
    
    return NextResponse.json(
      { 
        error: 'Failed to upload file',
        details: errorDetails.message,
        debug: process.env.NODE_ENV === 'development' ? errorDetails : undefined
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
