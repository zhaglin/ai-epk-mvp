import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ArtistInput, GeneratedBio } from '@/types';
import { SYSTEM_PROMPT, generateUserPrompt } from '@/lib/prompts';

// Инициализация OpenAI клиента
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

/**
 * POST /api/generate-bio
 * Генерирует профессиональное BIO артиста с помощью GPT
 */
export async function POST(request: NextRequest) {
  let artistInput: ArtistInput | null = null;
  
  try {
    // 1. Парсинг тела запроса
    const body = await request.json();

    // 2. Валидация входных данных
    if (!validateArtistInput(body)) {
      return NextResponse.json(
        { error: 'Некорректные данные. Проверьте обязательные поля.' },
        { status: 400 }
      );
    }

    artistInput = body;

    // 3. Формирование промптов
    const userPrompt = generateUserPrompt(artistInput);

    console.log('Отправка запроса к OpenAI...');

    // 4. Вызов OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // Используем более продвинутую модель
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.9, // Увеличиваем креативность
      max_tokens: 1500, // Увеличиваем лимит для более детальных текстов
    });

    // 5. Извлечение ответа
    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error('GPT не вернул ответ');
    }

    // 6. Парсинг JSON ответа
    const generatedBio: GeneratedBio = JSON.parse(responseContent);

    // 7. Валидация структуры ответа
    if (!generatedBio.pitch || !generatedBio.bio || !Array.isArray(generatedBio.highlights)) {
      throw new Error('Некорректная структура ответа от GPT');
    }

    console.log('BIO успешно сгенерирован');

    // 8. Возврат результата
    return NextResponse.json(generatedBio, { status: 200 });
  } catch (error) {
    console.error('Ошибка генерации BIO:', error);

    // Обработка различных типов ошибок
    if (error instanceof OpenAI.APIError && artistInput) {
      console.log('OpenAI API недоступен, используем fallback генерацию...');
      
      // Fallback: простая генерация без AI
      const fallbackBio = generateFallbackBio(artistInput);
      return NextResponse.json(fallbackBio, { status: 200 });
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Ошибка парсинга ответа GPT. Попробуйте ещё раз.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Произошла ошибка при генерации BIO. Попробуйте ещё раз.' },
      { status: 500 }
    );
  }
}

/**
 * Fallback генерация BIO без AI
 */
function generateFallbackBio(artistInput: ArtistInput): GeneratedBio {
  const { name, city, genres, venues, style, skills, achievements } = artistInput;
  
  const genreText = Array.isArray(genres) ? genres.join(', ') : genres;
  
  return {
    pitch: `${name} — талантливый ${genreText.toLowerCase()} артист из ${city}, создающий уникальные звуковые ландшафты, которые захватывают слушателей с первых нот.`,
    bio: `${name} представляет собой яркое явление в мире ${genreText.toLowerCase()} музыки. Базируясь в ${city}, артист развивает свой уникальный стиль, сочетая ${style}. Техническое мастерство ${name} проявляется в ${skills}, что позволяет создавать глубокие и эмоциональные композиции. ${achievements} — это лишь начало большого творческого пути артиста, который продолжает удивлять и вдохновлять аудиторию по всему миру.`,
    highlights: [
      `Выступления в ${venues}`,
      `Уникальный стиль: ${style}`,
      `Технические навыки: ${skills}`,
      achievements,
      `Активная деятельность в ${city}`
    ]
  };
}

/**
 * Валидация входных данных типа ArtistInput
 */
function validateArtistInput(data: any): data is ArtistInput {
  if (!data || typeof data !== 'object') return false;

  const required: (keyof ArtistInput)[] = [
    'name',
    'city',
    'genres',
    'venues',
    'style',
    'skills',
    'achievements',
  ];

  for (const field of required) {
    if (!data[field]) {
      console.error(`Отсутствует обязательное поле: ${field}`);
      return false;
    }
  }

  if (!Array.isArray(data.genres) || data.genres.length === 0) {
    console.error('genres должен быть непустым массивом');
    return false;
  }

  return true;
}

