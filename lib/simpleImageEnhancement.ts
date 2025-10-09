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
      .sharpen(1.0) // Легкое повышение четкости
      .modulate({
        brightness: 1.05, // +5% яркости
        saturation: 1.02, // +2% насыщенности
        hue: 0 // Без изменения оттенка
      })
      .gamma(1.1) // Легкая коррекция гаммы
      .jpeg({ 
        quality: 92, // Высокое качество
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
