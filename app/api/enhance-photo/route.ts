import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { enhanceArtistPortrait, enhanceArtistPortraitFallback, enhanceArtistPortraitDramatic, validateImage } from '@/lib/aiImage';
import { enhanceImageSimple, shouldUseSimpleEnhancement } from '@/lib/simpleImageEnhancement';
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
    const tempFilePath = join(process.cwd(), 'tmp', 'uploads', `${fileId}.jpg`);
    
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
    
           console.log('[Enhance] Image validated, starting processing...');
           
           let enhancedBuffer: Buffer;
           let processingTime = 0;
           
           // Проверяем, использовать ли простое улучшение
           if (shouldUseSimpleEnhancement()) {
             console.log('[Enhance] Using simple enhancement (no AI changes)...');
             const startTime = Date.now();
             enhancedBuffer = await enhanceImageSimple(imageBuffer);
             processingTime = Date.now() - startTime;
             console.log('[Enhance] Simple enhancement completed in', processingTime, 'ms');
           } else {
             // Трехуровневая система AI-улучшения с лучшими моделями
             let result = await enhanceArtistPortrait(imageBuffer); // Real-ESRGAN (основная)
             
             // Если Real-ESRGAN не сработала, пробуем SwinIR
             if (!result.success) {
               console.log('[Enhance] Real-ESRGAN failed, trying SwinIR...');
               result = await enhanceArtistPortraitFallback(imageBuffer);
             }
             
             // Если и SwinIR не сработала, пробуем CodeFormer
             if (!result.success) {
               console.log('[Enhance] SwinIR failed, trying CodeFormer...');
               result = await enhanceArtistPortraitDramatic(imageBuffer);
             }
             
             if (!result.success) {
               console.error('[Enhance] All AI models failed, falling back to simple enhancement');
               
               // Fallback к простому улучшению
               const startTime = Date.now();
               enhancedBuffer = await enhanceImageSimple(imageBuffer);
               processingTime = Date.now() - startTime;
             } else {
               // Скачиваем улучшенное изображение от AI
               console.log('[Enhance] Downloading AI enhanced image from:', result.enhancedImageUrl);
               
               const enhancedResponse = await fetch(result.enhancedImageUrl!);
               if (!enhancedResponse.ok) {
                 throw new Error('Failed to download enhanced image');
               }
               
               enhancedBuffer = Buffer.from(await enhancedResponse.arrayBuffer());
               processingTime = result.processingTime || 0;
             }
           }
    
    // Дополнительная оптимизация уже обработанного изображения
    const optimizedBuffer = await sharp(enhancedBuffer)
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
             processingTime: processingTime
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
             processingTime: processingTime,
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
