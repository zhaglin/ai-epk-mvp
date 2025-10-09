import sharp from 'sharp';

/**
 * Простое улучшение качества изображения без AI
 * Сохраняет оригинальную внешность на 100%
 */
export async function enhanceImageSimple(imageBuffer: Buffer): Promise<Buffer> {
  try {
    console.log('[Simple Enhancement] Applying professional quality improvements...');
    
    const enhancedBuffer = await sharp(imageBuffer)
      .resize(1024, 1024, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .sharpen({
        sigma: 1.5, // Умеренная резкость
        m1: 1.0,    // Маска резкости
        m2: 0.8,    // Порог
      })
      .modulate({
        brightness: 1.15, // +15% яркости (заметнее)
        saturation: 1.12, // +12% насыщенности (более живые цвета)
        hue: 0 // Без изменения оттенка
      })
      .linear(1.1, -(128 * 0.1)) // Увеличение контраста
      .gamma(1.2) // Более выраженная коррекция гаммы
      .jpeg({ 
        quality: 95, // Максимальное качество
        progressive: true,
        chromaSubsampling: '4:4:4' // Лучшая цветопередача
      })
      .toBuffer();
    
    console.log('[Simple Enhancement] Professional enhancement completed - brightness +15%, saturation +12%, enhanced contrast');
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
  // ОТКЛЮЧЕНО: Используем только AI модели
  return false;
}
