# Решения по AI-обработке изображений артистов

**Дата:** 2025-01-27  
**Статус:** ✅ Утверждено

## DECISION-IMG-AI-001: AI-обработка изображений

**Проблема:** Нужно автоматически улучшать фото артистов для профессионального EPK.

**Решение:** Использование Replicate API с Stable Diffusion XL для художественной обработки.

**Архитектура:**
- **Провайдер:** Replicate API (replicate-javascript client)
- **Модель:** Stable Diffusion XL или аналогичная для портретов
- **Стиль:** Artist portrait, editorial lighting, cinematic color grading
- **Формат:** Сохранение естественности лица, добавление музыкальной атмосферы

## PROMPT-IMG-001: Промпт для визуального стиля

**Полный текст промпта:**
```
Artist portrait, editorial lighting, soft contrast, cinematic color grading. 
Preserve natural facial features and expression, add modern musical visual style (house/techno aesthetic). 
Maintain original pose and gender, enhance with artistic atmosphere and professional photography feel.
High quality, detailed, studio lighting, magazine cover style.
```

**Параметры:**
- **Style:** Editorial/Fashion photography
- **Lighting:** Soft, cinematic
- **Color:** Professional grading
- **Atmosphere:** Musical/electronic music aesthetic
- **Quality:** High resolution, detailed

## FILEFLOW-001: Схема движения файлов

**Поток обработки:**
1. **Upload:** Клиент загружает фото → `/api/upload` → временное сохранение
2. **Enhance:** `/api/enhance-photo` → отправка в Replicate → обработка AI
3. **Save:** Результат сохраняется в `/public/generated/` → возврат URL
4. **Embed:** URL используется в onepager и PDF

**Структура файлов:**
```
/tmp/                    # Временные загрузки
/public/generated/       # Обработанные изображения
  └── artist_[id].jpg    # Финальные фото
```

## PDF-SPEC-002: Интеграция фото в PDF

**Обложка EPK:**
- **Позиция:** Верх страницы, над заголовком
- **Размеры:** Ширина 100%, высота auto (сохранить пропорции)
- **Отступы:** 20mm от верхнего края, центрирование
- **Стиль:** Профессиональное фото с градиентным overlay

**CSS правила:**
```css
.artist-photo {
  width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: cover;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
```

## API-ENDPOINTS-001: Структура API

**Upload Endpoint:** `/api/upload`
- **Method:** POST (multipart/form-data)
- **Input:** File (image/*, max 5MB)
- **Output:** `{ fileId: string, tempUrl: string }`

**Enhance Endpoint:** `/api/enhance-photo`
- **Method:** POST
- **Input:** `{ fileId: string }`
- **Output:** `{ enhancedUrl: string, status: 'processing' | 'done' }`

**Status:** Polling или WebSocket для отслеживания прогресса

## ERROR-HANDLING-001: Обработка ошибок

**Fallback стратегия:**
1. **AI обработка не удалась** → использовать оригинальное фото
2. **Replicate API недоступен** → показать сообщение "фото будет добавлено позже"
3. **Превышен размер файла** → сжать изображение перед обработкой
4. **Неподдерживаемый формат** → конвертировать в JPEG

**UX индикаторы:**
- "Загрузка фото..." (upload)
- "AI обрабатывает изображение..." (enhance)
- "Готово!" (success)
- "Используем оригинальное фото" (fallback)

## SECURITY-001: Безопасность загрузок

**Валидация файлов:**
- **Типы:** image/jpeg, image/png, image/webp
- **Размер:** максимум 5MB
- **Сканирование:** проверка на вредоносный контент
- **Время жизни:** временные файлы удаляются через 24 часа

**API ключи:**
- `REPLICATE_API_TOKEN` - для Replicate API
- Безопасное хранение в environment variables

## PERFORMANCE-001: Оптимизация производительности

**Кэширование:**
- Обработанные изображения сохраняются навсегда
- CDN для быстрой загрузки
- Lazy loading в UI

**Асинхронная обработка:**
- Неблокирующий UI во время обработки
- Progress indicators
- Background processing

## TESTING-001: Тестирование

**Тестовые сценарии:**
- Загрузка различных форматов (JPG, PNG, WebP)
- Обработка больших файлов (5MB)
- Проверка fallback при ошибках AI
- Интеграция с PDF генерацией
- Проверка качества улучшенных фото

**Метрики:**
- Время обработки AI (< 30 секунд)
- Качество улучшения (subjective evaluation)
- Успешность интеграции в PDF (100%)

## ACCEPTANCE-CRITERIA

✅ Пользователь может загрузить фото артиста (до 5MB)  
✅ AI автоматически улучшает фото в художественном стиле  
✅ Улучшенное фото отображается в превью onepager  
✅ Фото автоматически включается в PDF как обложка  
✅ Fallback на оригинальное фото при ошибках AI  
✅ Все пути логируются и устойчивы к ошибкам  

## РЕЗУЛЬТАТ

**Статус:** 🚧 В РАЗРАБОТКЕ

**Планируемые файлы:**
- `app/api/upload/route.ts` - загрузка файлов
- `app/api/enhance-photo/route.ts` - AI обработка
- `lib/aiImage.ts` - обёртка Replicate API
- `lib/fileStorage.ts` - управление файлами
- Обновление `types/index.ts` - добавление photoUrl
- Обновление `components/ArtistForm.tsx` - поле загрузки
- Обновление `lib/pdf-html-template.ts` - интеграция в PDF

**Зависимости:**
- `replicate` - JavaScript клиент
- `multer` или `formidable` - обработка multipart
- `sharp` - оптимизация изображений
