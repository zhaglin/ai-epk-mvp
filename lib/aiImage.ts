import Replicate from 'replicate';

// Проверяем наличие API токена
const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;

if (!REPLICATE_TOKEN) {
  console.warn('[AI Image] WARNING: REPLICATE_API_TOKEN is not set!');
}

// Инициализация Replicate клиента
const replicate = new Replicate({
  auth: REPLICATE_TOKEN,
});

// Модели для улучшения портретов на Replicate
const REAL_ESRGAN_MODEL = "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b";
const CODEFORMER_MODEL = "sczhou/codeformer:7de2ea26c616d5bf2245ad0d5e24f0ff9a6204578a5c876db53142edd9d2cd56";
const SDXL_MODEL = "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b";

// Стили для пресетов
export type StylePreset = 'techno-noir' | 'minimal-house' | 'festival' | 'deep-club' | 'natural';
export type Intensity = 'subtle' | 'medium' | 'bold';

// Промпты для разных стилей
const STYLE_PROMPTS: Record<StylePreset, { positive: string; negative: string }> = {
  'techno-noir': {
    positive: 'editorial DJ portrait, cinematic lighting, neon blue purple tones, high contrast, deep shadows, soft bokeh, subtle film grain, fashion magazine look, clean color, natural skin, sharp eyes, techno vibe, preserve identity, realistic face, modern club background',
    negative: 'distortion, extra limbs, artifacts, over-smoothing, plastic skin, watermark, text, glitch, nsfw, deformed face, ugly, blurry'
  },
  'minimal-house': {
    positive: 'editorial DJ portrait, daylight tones, neutral palette, soft matte contrast, minimalist aesthetic, clean background, natural lighting, subtle film grain, fashion magazine look, natural skin, sharp eyes, minimal house vibe, preserve identity, realistic face',
    negative: 'distortion, extra limbs, artifacts, over-smoothing, plastic skin, watermark, text, glitch, nsfw, deformed face, ugly, blurry, neon, dramatic'
  },
  'festival': {
    positive: 'editorial DJ portrait, warm lights, vibrant energy, artistic motion blur, festival atmosphere, golden hour lighting, soft bokeh, subtle film grain, fashion magazine look, natural skin, sharp eyes, energetic vibe, preserve identity, realistic face',
    negative: 'distortion, extra limbs, artifacts, over-smoothing, plastic skin, watermark, text, glitch, nsfw, deformed face, ugly, blurry, dark'
  },
  'deep-club': {
    positive: 'editorial DJ portrait, dark background, spotlight glow, green magenta ambience, moody atmosphere, cinematic lighting, soft bokeh, subtle film grain, fashion magazine look, natural skin, sharp eyes, deep house vibe, preserve identity, realistic face',
    negative: 'distortion, extra limbs, artifacts, over-smoothing, plastic skin, watermark, text, glitch, nsfw, deformed face, ugly, blurry, bright'
  },
  'natural': {
    positive: 'professional portrait photo, natural lighting, clean background, realistic, high quality photography, sharp focus, natural skin tones, preserve identity',
    negative: 'distortion, extra limbs, artifacts, over-smoothing, plastic skin, watermark, text, glitch, nsfw, deformed face, ugly, blurry, artistic, stylized'
  }
};

export interface ImageEnhancementResult {
  success: boolean;
  enhancedImageUrl?: string;
  error?: string;
  processingTime?: number;
  seed?: number;
  style?: StylePreset;
  intensity?: Intensity;
}

export interface EnhancementOptions {
  style?: StylePreset;
  intensity?: Intensity;
  seed?: number;
}

/**
 * ГЛАВНАЯ ФУНКЦИЯ: Профессиональное улучшение портрета артиста
 * Пайплайн: Restore Face → Stylize → Upscale
 */
export async function enhanceArtistPortraitPro(
  imageBuffer: Buffer, 
  options: EnhancementOptions = {}
): Promise<ImageEnhancementResult> {
  const startTime = Date.now();
  const style = options.style || 'natural';
  const intensity = options.intensity || 'medium';
  const seed = options.seed || Math.floor(Math.random() * 1000000);
  
  try {
    console.log('[AI Image Pro] Starting professional enhancement pipeline...', {
      style,
      intensity,
      seed
    });
    
    if (!REPLICATE_TOKEN) {
      throw new Error('REPLICATE_API_TOKEN is not configured');
    }
    
    // Загружаем изображение в Replicate
    const file = await replicate.files.create(imageBuffer, {
      contentType: 'image/jpeg'
    });
    
    console.log('[AI Image Pro] Image uploaded to Replicate:', file.id);
    
    // ЭТАП 1: Улучшение лица с помощью CodeFormer
    console.log('[AI Image Pro] Step 1: Face restoration with CodeFormer...');
    const faceRestored = await replicate.run(CODEFORMER_MODEL, {
      input: {
        image: file.url,
        upscale: 2,
        face_upsample: true,
        background_enhance: true,
        codeformer_fidelity: 0.9,
      }
    });
    
    const faceRestoredUrl = Array.isArray(faceRestored) ? faceRestored[0] : faceRestored;
    console.log('[AI Image Pro] Face restored:', faceRestoredUrl);
    
    // ЭТАП 2: Художественная стилизация с SDXL
    console.log('[AI Image Pro] Step 2: Artistic stylization with SDXL...', style);
    const stylePrompts = STYLE_PROMPTS[style];
    
    // Определяем силу стилизации
    const strengthMap: Record<Intensity, number> = {
      subtle: 0.25,
      medium: 0.4,
      bold: 0.6
    };
    
    const guidanceMap: Record<Intensity, number> = {
      subtle: 5,
      medium: 7,
      bold: 9
    };
    
    const stylized = await replicate.run(SDXL_MODEL, {
      input: {
        image: faceRestoredUrl,
        prompt: stylePrompts.positive,
        negative_prompt: stylePrompts.negative,
        num_inference_steps: 30,
        guidance_scale: guidanceMap[intensity],
        strength: strengthMap[intensity],
        seed: seed,
      }
    });
    
    const stylizedUrl = Array.isArray(stylized) ? stylized[0] : stylized;
    console.log('[AI Image Pro] Stylized:', stylizedUrl);
    
    // ЭТАП 3: Финальный апскейл с Real-ESRGAN
    console.log('[AI Image Pro] Step 3: Final upscale with Real-ESRGAN...');
    const upscaled = await replicate.run(REAL_ESRGAN_MODEL, {
      input: {
        image: stylizedUrl,
        scale: 2,
        face_enhance: true,
      }
    });
    
    const finalUrl = Array.isArray(upscaled) ? upscaled[0] : upscaled;
    
    const processingTime = Date.now() - startTime;
    console.log('[AI Image Pro] Professional enhancement completed!', {
      processingTime,
      seed,
      style,
      intensity
    });
    
    return {
      success: true,
      enhancedImageUrl: finalUrl,
      processingTime,
      seed,
      style,
      intensity
    };
    
  } catch (error) {
    console.error('[AI Image Pro] Professional enhancement failed:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Professional enhancement failed',
      seed,
      style,
      intensity
    };
  }
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
    const output = await replicate.run(REAL_ESRGAN_MODEL, {
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
    
    const output = await replicate.run(CODEFORMER_MODEL, {
      input: {
        image: file.url,
        upscale: 2, // Увеличение разрешения в 2 раза
        face_upsample: true, // Улучшение разрешения лица
        background_enhance: true, // Улучшение фона
        codeformer_fidelity: 0.9, // Высокая точность сохранения лица
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
