import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

// Максимальный размер файла: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Поддерживаемые типы изображений
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Создаем директории для хранения файлов
async function ensureDirectories() {
  const uploadsDir = join(process.cwd(), 'tmp', 'uploads');
  const generatedDir = join(process.cwd(), 'public', 'generated');
  
  try {
    await mkdir(uploadsDir, { recursive: true });
    await mkdir(generatedDir, { recursive: true });
  } catch (error) {
    // Директории уже существуют
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('[Upload] Starting file upload...');
    
    // Получаем данные формы
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
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
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          error: 'File too large. Maximum size is 5MB.',
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
    
    // Создаем директории
    await ensureDirectories();
    
    // Сохраняем файл во временную папку
    const tempPath = join(process.cwd(), 'tmp', 'uploads', fileName);
    await writeFile(tempPath, optimizedBuffer);
    
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
    
    return NextResponse.json(
      { 
        error: 'Failed to upload file',
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
