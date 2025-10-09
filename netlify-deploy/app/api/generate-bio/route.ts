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

    const artistInput: ArtistInput = body;

    // 3. Формирование промптов
    const userPrompt = generateUserPrompt(artistInput);

    console.log('Отправка запроса к OpenAI...');

    // 4. Вызов OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1000,
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
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `Ошибка OpenAI API: ${error.message}` },
        { status: error.status || 500 }
      );
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

