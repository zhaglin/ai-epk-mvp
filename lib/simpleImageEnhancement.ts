import sharp from 'sharp';

/**
 * Простое улучшение качества изображения без AI
 * Сохраняет оригинальную внешность на 100%
 */
export async function enhanceImageSimple(imageBuffer: Buffer): Promise<Buffer> {
  try {
    console.log('[Simple Enhancement] Applying quality improvements...');
    
    const enhancedBuffer = await sharp(imageBuffer)
      .resize(1024, 1024, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .sharpen(2.0) // Более заметное повышение четкости
      .modulate({
        brightness: 1.1, // +10% яркости (более заметно)
        saturation: 1.08, // +8% насыщенности
        hue: 0 // Без изменения оттенка
      })
      .gamma(1.15) // Более заметная коррекция гаммы
      .jpeg({ 
        quality: 95, // Максимальное качество
        progressive: true 
      })
      .toBuffer();
    
    console.log('[Simple Enhancement] Quality enhancement completed');
    return enhancedBuffer;
    
  } catch (error) {
    console.error('[Simple Enhancement] Failed:', error);
    throw error;
  }
}

/**
 * Проверяет, нужно ли использовать простое улучшение вместо AI
 */
export function shouldUseSimpleEnhancement(): boolean {
  // Пока всегда используем простое улучшение для стабильности
  return true;
}
