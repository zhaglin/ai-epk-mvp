import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { enhanceArtistPortrait, enhanceArtistPortraitFallback, validateImage } from '@/lib/aiImage';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const { fileId } = await request.json();
    
    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      );
    }
    
    console.log('[Enhance] Starting AI enhancement for file:', fileId);
    
    // Читаем временный файл
    const tempFilePath = join(process.cwd(), 'tmp', `${fileId}.jpg`);
    
    if (!existsSync(tempFilePath)) {
      return NextResponse.json(
        { error: 'Temporary file not found' },
        { status: 404 }
      );
    }
    
    const imageBuffer = await readFile(tempFilePath);
    
    // Валидируем изображение
    const validation = validateImage(imageBuffer);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }
    
    console.log('[Enhance] Image validated, starting AI processing...');
    
    // Пытаемся улучшить изображение с помощью AI
    let result = await enhanceArtistPortrait(imageBuffer);
    
    // Если основная модель не сработала, пробуем fallback
    if (!result.success) {
      console.log('[Enhance] Primary model failed, trying fallback...');
      result = await enhanceArtistPortraitFallback(imageBuffer);
    }
    
    if (!result.success) {
      console.error('[Enhance] All AI models failed:', result.error);
      
      // Возвращаем ошибку, но не удаляем оригинальный файл
      return NextResponse.json({
        success: false,
        error: 'AI enhancement failed. Using original photo.',
        fallback: true
      }, { status: 200 }); // 200 чтобы фронтенд мог обработать fallback
    }
    
    // Скачиваем улучшенное изображение
    console.log('[Enhance] Downloading enhanced image from:', result.enhancedImageUrl);
    
    const enhancedResponse = await fetch(result.enhancedImageUrl!);
    if (!enhancedResponse.ok) {
      throw new Error('Failed to download enhanced image');
    }
    
    const enhancedBuffer = Buffer.from(await enhancedResponse.arrayBuffer());
    
    // Оптимизируем и сохраняем улучшенное изображение
    const optimizedBuffer = await sharp(enhancedBuffer)
      .resize(1024, 1024, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ quality: 90 })
      .toBuffer();
    
    // Создаем уникальное имя для финального файла
    const finalFileName = `enhanced_${fileId}_${Date.now()}.jpg`;
    const finalPath = join(process.cwd(), 'public', 'generated', finalFileName);
    
    await writeFile(finalPath, optimizedBuffer);
    
    // Создаем URL для доступа к улучшенному изображению
    const enhancedUrl = `/generated/${finalFileName}`;
    
    console.log('[Enhance] Enhancement completed successfully:', {
      fileId,
      finalFileName,
      enhancedUrl,
      processingTime: result.processingTime
    });
    
    // Удаляем временный файл
    try {
      await unlink(tempFilePath);
      console.log('[Enhance] Temporary file deleted:', tempFilePath);
    } catch (deleteError) {
      console.warn('[Enhance] Failed to delete temporary file:', deleteError);
    }
    
    return NextResponse.json({
      success: true,
      enhancedUrl,
      fileName: finalFileName,
      processingTime: result.processingTime,
      message: 'Photo enhanced successfully!'
    });
    
  } catch (error) {
    console.error('[Enhance] Error during enhancement:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to enhance photo',
      details: error instanceof Error ? error.message : 'Unknown error',
      fallback: true
    }, { status: 500 });
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
