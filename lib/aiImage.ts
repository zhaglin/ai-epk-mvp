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

// Модель Stable Diffusion для портретов
const PORTRAIT_MODEL = "stability-ai/sdxl:8beff3369e81422112d93b89ca01426147de542cd4684c244b673b105188fe5f";

// Альтернативная модель для более заметных эффектов (используем тот же SDXL)
const ALTERNATIVE_MODEL = "stability-ai/sdxl:8beff3369e81422112d93b89ca01426147de542cd4684c244b673b105188fe5f";

export interface ImageEnhancementResult {
  success: boolean;
  enhancedImageUrl?: string;
  error?: string;
  processingTime?: number;
}

/**
 * Улучшает портрет артиста с помощью AI
 * @param imageBuffer - Buffer изображения для обработки
 * @returns Результат обработки с URL улучшенного изображения
 */
export async function enhanceArtistPortrait(imageBuffer: Buffer): Promise<ImageEnhancementResult> {
  const startTime = Date.now();
  
  try {
    console.log('[AI Image] Starting portrait enhancement...');
    
    // Создаем файл в Replicate
    const file = await replicate.files.create(imageBuffer, {
      contentType: 'image/jpeg'
    });
    
    console.log('[AI Image] File uploaded to Replicate:', file.id);
    
    // Запускаем модель для улучшения портрета
    const output = await replicate.run(PORTRAIT_MODEL, {
      input: {
        prompt: ARTIST_PORTRAIT_PROMPT,
        image: file.url,
        num_inference_steps: 10, // Еще меньше шагов для минимальной обработки
        guidance_scale: 3.0, // Очень слабое следование промпту - максимально сохранить оригинал
        strength: 0.15, // Минимальная обработка - только качество, без изменений
        scheduler: "K_EULER",
      }
    });
    
    const processingTime = Date.now() - startTime;
    console.log('[AI Image] Enhancement completed in', processingTime, 'ms');
    
    // Получаем URL улучшенного изображения
    const enhancedImageUrl = Array.isArray(output) ? output[0] : output;
    
    if (!enhancedImageUrl || typeof enhancedImageUrl !== 'string') {
      throw new Error('Invalid output from AI model');
    }
    
    return {
      success: true,
      enhancedImageUrl,
      processingTime
    };
    
  } catch (error) {
    console.error('[AI Image] Enhancement failed:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Альтернативная модель для портретов (fallback)
 */
export async function enhanceArtistPortraitFallback(imageBuffer: Buffer): Promise<ImageEnhancementResult> {
  const startTime = Date.now();
  
  try {
    console.log('[AI Image] Trying fallback model...');
    
    const file = await replicate.files.create(imageBuffer, {
      contentType: 'image/jpeg'
    });
    
    const output = await replicate.run(ALTERNATIVE_MODEL, {
      input: {
        prompt: "DJ portrait quality improvement only. Preserve person completely - no face/identity changes. Only lighting and contrast.",
        image: file.url,
        num_inference_steps: 8,
        guidance_scale: 2.0,
        strength: 0.10, // Минимальная обработка
        scheduler: "K_EULER",
      }
    });
    
    const processingTime = Date.now() - startTime;
    
    const enhancedImageUrl = Array.isArray(output) ? output[0] : output;
    
    return {
      success: true,
      enhancedImageUrl,
      processingTime
    };
    
  } catch (error) {
    console.error('[AI Image] Fallback model also failed:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Fallback model failed'
    };
  }
}

/**
 * Тонкая обработка портрета с минимальными изменениями
 */
export async function enhanceArtistPortraitDramatic(imageBuffer: Buffer): Promise<ImageEnhancementResult> {
  const startTime = Date.now();
  
  try {
    console.log('[AI Image] Starting subtle portrait enhancement...');
    
    const file = await replicate.files.create(imageBuffer, {
      contentType: 'image/jpeg'
    });
    
    const subtlePrompt = `
    DJ/music artist portrait with minimal quality improvement.
    CRITICAL: Keep exact same person - no gender/age/face changes.
    ONLY: slightly better lighting, gentle contrast, minimal sharpness.
    NO: filters, dramatic effects, color grading, face changes.
    Preserve: identity, features, clothing, background, pose.
    Result: original photo with subtle quality enhancement.
    `;
    
    const output = await replicate.run(PORTRAIT_MODEL, {
      input: {
        prompt: subtlePrompt,
        image: file.url,
        num_inference_steps: 8, // Минимум шагов
        guidance_scale: 2.5, // Очень слабое влияние промпта
        strength: 0.12, // Почти не изменяем
        scheduler: "K_EULER",
      }
    });
    
    const processingTime = Date.now() - startTime;
    console.log('[AI Image] Subtle enhancement completed in', processingTime, 'ms');
    
    const enhancedImageUrl = Array.isArray(output) ? output[0] : output;
    
    if (!enhancedImageUrl || typeof enhancedImageUrl !== 'string') {
      throw new Error('Invalid output from subtle AI model');
    }
    
    return {
      success: true,
      enhancedImageUrl,
      processingTime
    };
    
  } catch (error) {
    console.error('[AI Image] Subtle enhancement failed:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Subtle enhancement failed'
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
