import Replicate from 'replicate';

// Инициализация Replicate клиента
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Промпт для художественной обработки портретов
export const ARTIST_PORTRAIT_PROMPT = `
Professional DJ/music artist portrait with minimal enhancement.
CRITICAL: Preserve original person's identity, gender, age, facial features, and appearance completely.
ONLY minor improvements: slightly better lighting, gentle contrast boost, minimal color correction.
NO changes to: face shape, skin texture, hair, clothing, pose, background.
Keep natural and realistic - no filters, no dramatic effects.
Style: clean, modern, professional music industry look.
Result should look like original photo but slightly better quality.
`;

// Лучшие модели для улучшения портретов на Replicate
const PORTRAIT_MODEL = "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b"; // Real-ESRGAN для улучшения качества
const ALTERNATIVE_MODEL = "jingyunliang/swinir:latest"; // SwinIR для суперразрешения
const FACE_ENHANCEMENT_MODEL = "sczhou/codeformer:7de2ea26c616d5bf2245ad0d5e24f0ff9a6204578a5c876db53142edd9d2cd56"; // CodeFormer для улучшения лиц

export interface ImageEnhancementResult {
  success: boolean;
  enhancedImageUrl?: string;
  error?: string;
  processingTime?: number;
}

/**
 * Улучшает портрет артиста с помощью Real-ESRGAN (лучшая модель для улучшения качества)
 * @param imageBuffer - Buffer изображения для обработки
 * @returns Результат обработки с URL улучшенного изображения
 */
export async function enhanceArtistPortrait(imageBuffer: Buffer): Promise<ImageEnhancementResult> {
  const startTime = Date.now();
  
  try {
    console.log('[AI Image] Starting Real-ESRGAN portrait enhancement...');
    
    // Создаем файл в Replicate
    const file = await replicate.files.create(imageBuffer, {
      contentType: 'image/jpeg'
    });
    
    console.log('[AI Image] File uploaded to Replicate:', file.id);
    
    // Запускаем Real-ESRGAN для улучшения качества изображения
    const output = await replicate.run(PORTRAIT_MODEL, {
      input: {
        image: file.url,
        scale: 2, // Увеличиваем разрешение в 2 раза
        face_enhance: true, // Включаем улучшение лиц
      }
    });
    
    const processingTime = Date.now() - startTime;
    console.log('[AI Image] Real-ESRGAN enhancement completed in', processingTime, 'ms');
    
    // Получаем URL улучшенного изображения
    const enhancedImageUrl = Array.isArray(output) ? output[0] : output;
    
    if (!enhancedImageUrl || typeof enhancedImageUrl !== 'string') {
      throw new Error('Invalid output from Real-ESRGAN model');
    }
    
    return {
      success: true,
      enhancedImageUrl,
      processingTime
    };
    
  } catch (error) {
    console.error('[AI Image] Real-ESRGAN enhancement failed:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Real-ESRGAN enhancement failed'
    };
  }
}

/**
 * Альтернативная модель SwinIR для суперразрешения (fallback)
 */
export async function enhanceArtistPortraitFallback(imageBuffer: Buffer): Promise<ImageEnhancementResult> {
  const startTime = Date.now();
  
  try {
    console.log('[AI Image] Trying SwinIR fallback model...');
    
    const file = await replicate.files.create(imageBuffer, {
      contentType: 'image/jpeg'
    });
    
    const output = await replicate.run(ALTERNATIVE_MODEL, {
      input: {
        image: file.url,
        task_type: "Real-World Image Super-Resolution-Large", // Лучший режим для портретов
      }
    });
    
    const processingTime = Date.now() - startTime;
    console.log('[AI Image] SwinIR enhancement completed in', processingTime, 'ms');
    
    const enhancedImageUrl = Array.isArray(output) ? output[0] : output;
    
    if (!enhancedImageUrl || typeof enhancedImageUrl !== 'string') {
      throw new Error('Invalid output from SwinIR model');
    }
    
    return {
      success: true,
      enhancedImageUrl,
      processingTime
    };
    
  } catch (error) {
    console.error('[AI Image] SwinIR fallback model also failed:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'SwinIR fallback model failed'
    };
  }
}

/**
 * Специализированное улучшение лиц с помощью CodeFormer
 */
export async function enhanceArtistPortraitDramatic(imageBuffer: Buffer): Promise<ImageEnhancementResult> {
  const startTime = Date.now();
  
  try {
    console.log('[AI Image] Starting CodeFormer face enhancement...');
    
    const file = await replicate.files.create(imageBuffer, {
      contentType: 'image/jpeg'
    });
    
    const output = await replicate.run(FACE_ENHANCEMENT_MODEL, {
      input: {
        image: file.url,
        codeformer_fidelity: 0.9, // Высокая точность сохранения лица
        background_enhance: true, // Улучшение фона
        face_upsample: true, // Улучшение разрешения лица
        upscale: 2, // Увеличение разрешения в 2 раза
      }
    });
    
    const processingTime = Date.now() - startTime;
    console.log('[AI Image] CodeFormer face enhancement completed in', processingTime, 'ms');
    
    const enhancedImageUrl = Array.isArray(output) ? output[0] : output;
    
    if (!enhancedImageUrl || typeof enhancedImageUrl !== 'string') {
      throw new Error('Invalid output from CodeFormer model');
    }
    
    return {
      success: true,
      enhancedImageUrl,
      processingTime
    };
    
  } catch (error) {
    console.error('[AI Image] CodeFormer face enhancement failed:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'CodeFormer face enhancement failed'
    };
  }
}

/**
 * Проверяет доступность Replicate API
 */
export async function checkReplicateAvailability(): Promise<boolean> {
  try {
    // Простая проверка - получаем список моделей
    await replicate.models.list();
    return true;
  } catch (error) {
    console.error('[AI Image] Replicate API unavailable:', error);
    return false;
  }
}

/**
 * Валидирует изображение перед обработкой
 */
export function validateImage(imageBuffer: Buffer): { valid: boolean; error?: string } {
  // Проверяем размер файла (максимум 10MB для AI обработки)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (imageBuffer.length > maxSize) {
    return {
      valid: false,
      error: 'Image too large. Maximum size is 10MB.'
    };
  }
  
  // Проверяем минимальный размер
  const minSize = 1024; // 1KB
  if (imageBuffer.length < minSize) {
    return {
      valid: false,
      error: 'Image too small. Minimum size is 1KB.'
    };
  }
  
  // Проверяем заголовки изображения
  const header = imageBuffer.slice(0, 4);
  const isJPEG = header[0] === 0xFF && header[1] === 0xD8;
  const isPNG = header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4E && header[3] === 0x47;
  const isWebP = header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46;
  
  if (!isJPEG && !isPNG && !isWebP) {
    return {
      valid: false,
      error: 'Unsupported image format. Please use JPEG, PNG, or WebP.'
    };
  }
  
  return { valid: true };
}
