/**
 * Artist Input Data Types
 * Данные, которые вводит артист через форму
 */
export interface ArtistInput {
  name: string;              // Имя артиста
  city: string;              // Город
  genres: string[];          // Жанры (массив)
  venues: string;            // Где играл (текстовое описание)
  style: string;             // Стиль/подход к музыке
  skills: string;            // Навыки (микс, продакшн и т.д.)
  achievements: string;      // Достижения
  links: {
    instagram?: string;
    soundcloud?: string;
    mixcloud?: string;
    website?: string;
  };
}

/**
 * GPT Generated Bio Content
 * Структура данных, которую возвращает GPT API
 */
export interface GeneratedBio {
  pitch: string;       // Elevator pitch (2-3 предложения)
  bio: string;         // Full BIO (1 абзац)
  highlights: string[]; // Key highlights (список из 3-5 пунктов)
}

/**
 * Complete Artist Data (Input + Generated)
 * Полные данные артиста для генерации PDF
 */
export interface ArtistData extends ArtistInput {
  generated?: GeneratedBio;
  generatedAt?: string;
}

