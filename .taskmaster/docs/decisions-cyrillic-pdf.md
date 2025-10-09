# Решения по кириллической поддержке PDF

**Дата:** 2025-01-27  
**Статус:** ✅ Утверждено и протестировано

## DECISION-PDF-ENGINE-001: HTML→PDF через Puppeteer

**Проблема:** jsPDF и другие клиентские библиотеки не поддерживают кириллицу из коробки.

**Решение:** Переход на server-side генерацию PDF через Puppeteer + HTML→PDF рендеринг.

**Архитектура:**
- **Основной движок:** Puppeteer с локальным Chrome (development) или Chromium (production)
- **HTML шаблон:** Полноценный HTML с CSS и встроенными шрифтами
- **Fallback:** Внешний API (HTMLPDF API) или текстовый экспорт
- **API endpoint:** `/api/generate-pdf` с автоматическим скачиванием

**Файлы:**
- `app/api/generate-pdf/route.ts` - основной API endpoint
- `lib/pdf-html-template.ts` - HTML шаблон с CSS
- `lib/pdf-fallback.ts` - fallback решения
- `public/fonts/` - Noto Sans шрифты для кириллицы

## FONT-POLICY-001: Кириллические шрифты

**Проблема:** Стандартные шрифты не поддерживают кириллицу в PDF.

**Решение:** Использование Noto Sans с полной поддержкой Unicode.

**Реализация:**
```css
@font-face {
  font-family: 'Noto Sans';
  src: url('/fonts/NotoSans-Regular.ttf') format('truetype');
  font-weight: 400;
  unicode-range: U+0400-04FF, U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
```

**Шрифты:**
- `NotoSans-Regular.ttf` - основной шрифт
- `NotoSans-Bold.ttf` - жирный шрифт
- Предзагрузка через `<link rel="preload">`

## BACKUP-PDF-SERVICE-001: Многоуровневый Fallback

**Проблема:** Puppeteer может не работать в некоторых окружениях.

**Решение:** Трехуровневая система fallback:

1. **Puppeteer** (основной) - HTML→PDF через Chrome/Chromium
2. **Внешний API** (HTMLPDF API) - облачный сервис
3. **Текстовый экспорт** (последний resort) - простой текстовый файл

**Логика:**
```typescript
try {
  // Puppeteer
  return await generatePDFWithPuppeteer();
} catch (error) {
  try {
    // Внешний API
    return await generatePDFWithExternalAPI();
  } catch (fallbackError) {
    // Текстовый экспорт
    return await generateTextExport();
  }
}
```

## PUPPETEER-CONFIG-001: Конфигурация для разных окружений

**Development:**
- Использует локальный Google Chrome
- Минимальные аргументы запуска
- Отладочные логи

**Production:**
- Использует Chromium для serverless
- Полные аргументы Chromium
- Оптимизированная конфигурация

**Код:**
```typescript
const executablePath = process.env.NODE_ENV === 'development' 
  ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  : await chromium.executablePath();

const args = process.env.NODE_ENV === 'development'
  ? ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  : chromium.args;
```

## HTML-TEMPLATE-001: Структура PDF шаблона

**Формат:** A4 с полями 24mm
**Секции:**
1. Header (градиентный фон, имя + город + жанры)
2. Elevator Pitch (краткое описание)
3. Biography (полное BIO)
4. Key Highlights (список достижений)
5. Links (социальные сети)
6. Footer (дата генерации)

**CSS особенности:**
- `@page` настройки для A4
- `page-break-inside: avoid` для секций
- Градиентный header
- Стилизованные списки с иконками

## TESTING-001: Тестирование кириллицы

**Тестовые символы:**
- `ё, Й` - специфичные русские буквы
- `«кавычки»` - типографские кавычки
- `—` - длинное тире
- `эмодзи 🎵` - Unicode символы

**Проверка:**
- Все символы отображаются корректно
- Нет "квадратиков" или искажений
- Шрифт читабельный и четкий

## ACCEPTANCE-CRITERIA

✅ `/api/generate-pdf` формирует PDF с русским текстом без артефактов  
✅ В PDF отображаются знаки «Ё/ё», «—», кавычки «» корректно  
✅ PDF одинаков на dev и serverless-окружении  
✅ При падении Chromium — автоматический ретрай через внешний провайдер  
✅ В репо есть кириллица-тест и скрин-пример успешно сгенерированного PDF  

## РЕЗУЛЬТАТ

**Статус:** ✅ УСПЕШНО РЕАЛИЗОВАНО И ПРОТЕСТИРОВАНО

- PDF генерируется автоматически без диалогов
- Кириллица отображается корректно во всех секциях
- Профессиональный дизайн с градиентным заголовком
- Стабильная работа в development и production
- Fallback система обеспечивает надежность

**Файлы в репозитории:**
- `app/api/generate-pdf/route.ts`
- `lib/pdf-html-template.ts`
- `lib/pdf-fallback.ts`
- `public/fonts/NotoSans-*.ttf`
- `.taskmaster/docs/decisions-cyrillic-pdf.md` (этот файл)
