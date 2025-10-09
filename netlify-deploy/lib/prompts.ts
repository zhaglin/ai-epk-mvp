import { ArtistInput } from '@/types';

/**
 * System Prompt для GPT
 * Определяет роль и формат ответа AI
 */
export const SYSTEM_PROMPT = `Ты профессиональный музыкальный копирайтер, специализирующийся на создании EPK (Electronic Press Kit) для артистов.

Твоя задача — создать профессиональное, привлекательное и точное описание артиста на русском языке на основе предоставленных данных.

Требования:
- Текст на русском языке
- Профессиональный, но не перегруженный стиль
- Фокус на уникальности артиста
- Конкретика: жанры, достижения, опыт
- Избегай клише типа "уникальный звук" без конкретики

Формат ответа строго JSON:
{
  "pitch": "краткий elevator pitch (2-3 предложения, фокус на уникальности и достижениях)",
  "bio": "полное BIO (1 абзац, 4-6 предложений, подробное описание карьеры и стиля)",
  "highlights": ["highlight 1", "highlight 2", "highlight 3", "highlight 4", "highlight 5"]
}

Highlights должны быть конкретными и измеримыми достижениями (релизы, выступления, навыки).`;

/**
 * Генерирует User Prompt на основе данных артиста
 */
export function generateUserPrompt(artistData: ArtistInput): string {
  const { name, city, genres, venues, style, skills, achievements } = artistData;

  return `Создай EPK для артиста со следующими данными:

- Имя: ${name}
- Город: ${city}
- Жанры: ${genres.join(', ')}
- Места выступлений: ${venues}
- Стиль/подход: ${style}
- Навыки: ${skills}
- Достижения: ${achievements}

Создай профессиональное и привлекательное описание, которое подчеркнёт уникальность артиста и его достижения.`;
}

/**
 * Пример использования:
 * 
 * const messages = [
 *   { role: 'system', content: SYSTEM_PROMPT },
 *   { role: 'user', content: generateUserPrompt(artistInput) }
 * ];
 * 
 * const response = await openai.chat.completions.create({
 *   model: 'gpt-4o-mini',
 *   messages,
 *   response_format: { type: 'json_object' }
 * });
 */

