import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { 
  enhanceArtistPortraitPro, 
  enhanceArtistPortrait, 
  enhanceArtistPortraitDramatic, 
  validateImage,
  type StylePreset,
  type Intensity 
} from '@/lib/aiImage';
import sharp from 'sharp';

// DECISION-UPLOAD-RUNTIME-001: Принудительный Node.js runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { fileId, fileName, style, intensity, seed } = await request.json();
    
    if (!fileId && !fileName) {
      return NextResponse.json(
        { error: 'File ID or file name is required' },
        { status: 400 }
      );
    }
    
    const actualFileName = fileName || `${fileId}.jpg`;
    const enhancementStyle = (style as StylePreset) || 'natural';
    const enhancementIntensity = (intensity as Intensity) || 'medium';
    
    console.log('[Enhance] Starting AI enhancement for file:', actualFileName, {
      style: enhancementStyle,
      intensity: enhancementIntensity,
      seed
    });
    
    // Читаем временный файл
    // Определяем Netlify по другим признакам
    const isNetlify = process.env.NODE_ENV === 'production' && process.platform === 'linux' && process.env.AWS_LAMBDA_FUNCTION_NAME;
    
    const uploadsDir = isNetlify 
      ? '/tmp/uploads'
      : join(process.cwd(), 'tmp', 'uploads');
    
    const tempFilePath = join(uploadsDir, actualFileName);
    
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
           
           // ТОЛЬКО AI - НЕТ ПРОСТОГО УЛУЧШЕНИЯ
           console.log('[Enhance] Starting AI-only enhancement (no fallback)...');
           
           // ПРОФЕССИОНАЛЬНЫЙ ПАЙПЛАЙН с тремя этапами
           let result = await enhanceArtistPortraitPro(imageBuffer, {
             style: enhancementStyle,
             intensity: enhancementIntensity,
             seed
           });
           
           // Если профессиональный пайплайн не сработал, пробуем упрощенные AI версии
           if (!result.success) {
             console.log('[Enhance] Pro pipeline failed, trying Real-ESRGAN only...');
             result = await enhanceArtistPortrait(imageBuffer);
           }
           
           if (!result.success) {
             console.log('[Enhance] Real-ESRGAN failed, trying CodeFormer...');
             result = await enhanceArtistPortraitDramatic(imageBuffer);
           }
           
           if (!result.success) {
             // НЕТ FALLBACK - возвращаем ошибку
             throw new Error(`All AI models failed: ${result.error || 'Unknown error'}`);
           }
           
           // Скачиваем улучшенное изображение от AI
           console.log('[Enhance] Downloading AI enhanced image from:', result.enhancedImageUrl);
           
           const enhancedResponse = await fetch(result.enhancedImageUrl!);
           if (!enhancedResponse.ok) {
             throw new Error('Failed to download enhanced image');
           }
           
           enhancedBuffer = Buffer.from(await enhancedResponse.arrayBuffer());
           processingTime = result.processingTime || 0;
    
    // Дополнительная тонкая постобработка (яркость, контраст, насыщенность)
    const optimizedBuffer = await sharp(enhancedBuffer)
      .modulate({
        brightness: 1.05, // +5% яркости для свежести
        saturation: 1.08, // +8% насыщенности для живости
      })
      .sharpen(1.2) // Легкая резкость
      .linear(1.05, 0) // Легкое повышение контраста
      .jpeg({ 
        quality: 92,
        chromaSubsampling: '4:4:4' // Лучшая цветопередача
      })
      .toBuffer();
    
    // Создаем уникальное имя для финального файла
    const finalFileName = `enhanced_${fileId}_${Date.now()}.jpg`;
    
    // На Netlify используем /tmp, локально - public/generated
    const generatedDir = isNetlify
      ? '/tmp'
      : join(process.cwd(), 'public', 'generated');
    
    // Создаем директорию если нужно
    const { mkdir } = await import('fs/promises');
    try {
      await mkdir(generatedDir, { recursive: true });
    } catch (err) {
      // Директория уже существует
    }
    
    const finalPath = join(generatedDir, finalFileName);
    await writeFile(finalPath, optimizedBuffer);
    
    // На Netlify возвращаем base64, локально - URL файла
    let enhancedUrl: string;
    const isNetlifyEnv = process.env.NODE_ENV === 'production' && process.platform === 'linux' && !!process.env.AWS_LAMBDA_FUNCTION_NAME;
    
    if (isNetlifyEnv) {
      // Конвертируем в base64 для Netlify (Lambda контейнеры изолированы)
      const base64Image = optimizedBuffer.toString('base64');
      enhancedUrl = `data:image/jpeg;base64,${base64Image}`;
      console.log('[Enhance] Returning base64 image for Netlify (size: ' + Math.round(base64Image.length / 1024) + ' KB)');
    } else {
      // Локально используем файловую систему
      enhancedUrl = `/generated/${finalFileName}`;
    }
    
           console.log('[Enhance] Enhancement completed successfully:', {
             fileId,
             finalFileName,
             enhancedUrl: isNetlifyEnv ? 'data:image/jpeg;base64,...' : enhancedUrl,
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
