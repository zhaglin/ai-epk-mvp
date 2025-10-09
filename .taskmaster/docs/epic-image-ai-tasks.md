# EPIC P-Q-R-S-T: AI Image Enhancement Tasks

## EPIC P — Upload & Storage

### P1: Добавить поле загрузки фото в форму
- **Описание:** Добавить `<input type="file" accept="image/*">` в `ArtistForm.tsx`
- **Ограничения:** Максимум 5MB, типы: JPG, PNG, WebP
- **UX:** Показывать превью загруженного изображения
- **Валидация:** Размер файла и тип на клиенте

### P2: Создать API /api/upload
- **Описание:** Endpoint для загрузки изображений
- **Input:** multipart/form-data с файлом
- **Output:** `{ fileId: string, tempUrl: string }`
- **Хранение:** Временная папка `/tmp` или Cloudinary
- **Безопасность:** Валидация типа и размера файла

### P3: Возврат fileId или URL
- **Описание:** API возвращает идентификатор временного файла
- **Использование:** Для последующей AI обработки
- **Время жизни:** 24 часа для временных файлов

## EPIC Q — AI Image Enhancement

### Q1: Создать модуль lib/aiImage.ts
- **Описание:** Обёртка над Replicate API
- **Функции:** Инициализация клиента, обработка изображений
- **Модель:** Stable Diffusion XL для портретов
- **Обработка ошибок:** Retry логика, fallback

### Q2: Промпт для модели (PROMPT-IMG-001)
```
Artist portrait, editorial lighting, soft contrast, cinematic color grading. 
Preserve natural facial features and expression, add modern musical visual style (house/techno aesthetic). 
Maintain original pose and gender, enhance with artistic atmosphere and professional photography feel.
High quality, detailed, studio lighting, magazine cover style.
```

### Q3: Создать API /api/enhance-photo
- **Input:** `{ fileId: string }`
- **Process:** Загрузка файла → отправка в Replicate → обработка
- **Output:** `{ enhancedUrl: string, status: 'processing' | 'done' }`
- **Сохранение:** Результат в `/public/generated/`

### Q4: Флаг прогресса/статуса
- **Status:** 'uploading', 'processing', 'done', 'error'
- **UI:** Индикатор прогресса "AI обрабатывает изображение..."
- **Polling:** Проверка статуса каждые 2 секунды

## EPIC R — Onepager Integration

### R1: Hero-section с фото
- **Позиция:** Верх страницы после обработки
- **Стиль:** Профессиональное фото с градиентным overlay
- **Responsive:** Адаптивное масштабирование
- **Fallback:** Оригинальное фото при ошибке AI

### R2: Сохранение URL в ArtistProfile
- **Объект:** Добавить `photoUrl: string` в `ArtistData`
- **Использование:** Для PDF генерации
- **Состояние:** Сохранять в локальном состоянии

### R3: Обновить превью EPK
- **Структура:** Фото → текст → highlights → ссылки
- **Стиль:** Современный макет с фото-заголовком
- **Анимация:** Плавное появление улучшенного фото

## EPIC S — PDF Integration

### S1: Обновить HTML шаблон PDF
- **Добавить:** `<img src="..." />` в начало страницы
- **Позиция:** Обложка над заголовком
- **CSS:** Адаптивные стили для фото

### S2: Адаптировать CSS для фото
- **Размеры:** Ширина 100%, высота auto
- **Отступы:** 20mm от верхнего края
- **Пропорции:** Не обрезать голову, сохранить соотношение
- **Стиль:** Профессиональное оформление

### S3: Тестирование интеграции
- **Кириллица + фото:** Проверить совместимость
- **Шрифты:** Embed Noto Sans с изображениями
- **PDF качество:** Четкость и читаемость

## EPIC T — UX & Error Handling

### T1: Индикатор прогресса
- **Состояния:** "Загрузка фото...", "AI обрабатывает...", "Готово!"
- **UI:** Анимированный прогресс-бар
- **Время:** Ожидаемое время обработки (15-30 сек)

### T2: Fallback стратегия
- **AI недоступен:** Использовать оригинальное фото
- **Ошибка обработки:** Показать сообщение и fallback
- **Таймаут:** Автоматический fallback через 60 секунд

### T3: Подсказки пользователю
- **Текст:** "Загрузите портрет или промо-фото — AI сделает его стильным"
- **Примеры:** Показать before/after примеры
- **Советы:** Рекомендации по качеству фото

## Приоритеты реализации:

1. **Высокий:** P1, P2, Q1, Q3 (базовая функциональность)
2. **Средний:** R1, R2, S1, S2 (интеграция)
3. **Низкий:** T1, T2, T3 (UX улучшения)

## Зависимости:

- `replicate` - JavaScript клиент для AI
- `multer` или `formidable` - обработка multipart
- `sharp` - оптимизация изображений
- Обновление `types/index.ts` - добавление photoUrl
- Обновление существующих компонентов
