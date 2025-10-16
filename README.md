# 🎵 ArtistOne — Профессиональный EPK за минуту

<div align="center">

![ArtistOne](https://img.shields.io/badge/ArtistOne-AI%20EPK%20Generator-blue?style=for-the-badge&logo=music)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![AI](https://img.shields.io/badge/AI-Powered-purple?style=for-the-badge&logo=openai)

**Создайте профессиональный электронный пресс-кит для артиста за 60 секунд**

[Демо](http://localhost:3000) • [Деплой на Netlify](GITHUB_NETLIFY_DEPLOY.md) • [Поддержка](#)

</div>

---

## 🎉 Последние обновления (10 января 2025)

### ✅ GPT-4o + Креативные тексты
- **Модель обновлена**: `gpt-4o-mini` → `gpt-4o` для максимальной креативности
- **Стильные промпты**: Переработаны в стиле топовых музыкальных изданий (Mixmag, Resident Advisor)
- **Ультрасовременный язык**: Актуальные музыкальные термины, метафоры и образы
- **Эмоциональная глубина**: Переживания и ощущения, а не просто факты
- **Кинематографичность**: Описание звука через визуальные образы

### ✅ Улучшения формы и PDF
- **Чистая форма**: Убраны все предзаполненные данные для свежего пользовательского опыта
- **Компактный дизайн**: Уменьшены размеры полей формы для лучшей читаемости
- **Русская локализация**: Все разделы PDF теперь на русском языке
- **Брендинг ArtistOne**: Добавлен логотип в заголовок PDF с градиентным дизайном
- **Улучшенный UX**: Лучшие иконки, анимации и поддержка темной темы

---

## ✨ Что это?

**ArtistOne** — это AI-powered генератор электронных пресс-китов (EPK) для музыкальных артистов и DJ. Просто введите базовую информацию о себе, и наша система автоматически создаст:

- 🎤 **Профессиональное BIO** — elevator pitch, полное описание, ключевые достижения
- 📸 **Улучшенное фото** — AI тонко улучшит качество вашего портрета
- 📄 **Готовый PDF** — стильный пресс-кит для отправки букерам и промо

---

## 🌐 Деплой на Netlify

**🔐 Безопасность гарантирована! API ключи надежно защищены.**

**Быстрый деплой через GitHub:**

1. **Fork репозиторий** или используйте свой
2. **Подключите к Netlify** через GitHub
3. **Добавьте переменные окружения:**
   - `OPENAI_API_KEY` - ваш ключ OpenAI
   - `REPLICATE_API_TOKEN` - ваш токен Replicate
   - `NEXT_PUBLIC_BASE_URL` - URL вашего сайта
4. **Деплой!** 🚀

**📖 Документация:**
- [Быстрый старт](DEPLOY_NOW.md) - деплой за 5 шагов
- [Безопасность](SECURITY_DEPLOY_CHECKLIST.md) - чеклист безопасности
- [Переменные окружения](ENVIRONMENT_SETUP.md) - настройка
- [Подробная инструкция](GITHUB_NETLIFY_DEPLOY.md) - полное руководство

---

## 🚀 Быстрый старт

### 1️⃣ Установка зависимостей

```bash
npm install
```

### 2️⃣ Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```bash
# OpenAI для генерации BIO
OPENAI_API_KEY=your-openai-api-key-here

# Replicate для AI улучшения фото
REPLICATE_API_TOKEN=your-replicate-token-here
```

**Получение ключей:**
- OpenAI: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- Replicate: [https://replicate.com/account/api-tokens](https://replicate.com/account/api-tokens)

### 3. Запуск dev сервера

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

---

## 📦 Деплой на Netlify

### Автоматический деплой:

1. Подключите GitHub репозиторий к [Netlify](https://www.netlify.com/)
2. Netlify автоматически обнаружит Next.js и настроит build
3. Добавьте environment variable в Netlify Dashboard:
   - `OPENAI_API_KEY` = ваш OpenAI ключ

### Ручной деплой:

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

---

## 🏗️ Технологический стек

### Frontend
- ⚡️ **Next.js 15** — React framework с App Router
- 📘 **TypeScript 5** — Type-safe development
- 🎨 **Tailwind CSS** — Utility-first styling
- 🌗 **Dark Mode** — Automatic theme detection

### AI & Processing
- 🤖 **OpenAI GPT-4o-mini** — Bio generation
- 🖼️ **Replicate Real-ESRGAN** — Image enhancement (без изменения лица)
- 📄 **Puppeteer + Chromium** — Server-side PDF generation
- 🔤 **Noto Sans/Serif** — Cyrillic font support

### Deployment
- 🚀 **Netlify** — CI/CD & hosting
- 🌐 **Edge Functions** — Serverless API routes

---

## ✅ Статус проекта

### ✨ Реализовано (90%):

#### 🎨 UI/UX Design
- ✅ Современный минималистичный дизайн
- ✅ Брендинг ArtistOne с градиентным логотипом
- ✅ Glassmorphism эффекты (backdrop blur)
- ✅ Sticky navigation с анимациями
- ✅ Адаптивная верстка (mobile-first)
- ✅ Темная/светлая тема (автоматическая)
- ✅ Кастомные анимации (fade-in, shake, pulse-glow)
- ✅ Gradient scrollbar
- ✅ Hover эффекты на всех интерактивных элементах

#### 🤖 AI Features
- ✅ Генерация BIO через GPT-4o-mini
- ✅ Elevator pitch, full bio, 5 highlights
- ✅ Промпты оптимизированы для русского языка
- ✅ AI улучшение фото (Real-ESRGAN, face_enhance=false)
- ✅ Постобработка (яркость, контраст, резкость)
- ✅ Сохранение оригинальной внешности (100%)

#### 📄 PDF Generation
- ✅ Server-side PDF через Puppeteer
- ✅ Полная поддержка кириллицы (Noto Sans/Serif)
- ✅ Встраивание улучшенных фото
- ✅ Профессиональный макет A4
- ✅ Автоматическое скачивание

#### 🛠️ Developer Experience
- ✅ TypeScript для type safety
- ✅ Валидация форм с UX feedback
- ✅ Error handling с retry logic
- ✅ Loading states для всех операций
- ✅ Логирование для debugging

### ⏳ В планах (10%):
- 🔐 Аутентификация пользователей
- 💾 Сохранение EPK в базе данных
- 🎯 Множественные стилевые пресеты для PDF
- 📊 Analytics и статистика
- 🌍 Мультиязычность (EN/RU)

---

## 🎯 Как использовать

### Шаг 1: Загрузите фото (опционально)
- Поддержка JPEG, PNG, WebP до 5MB
- AI улучшит качество, сохранив вашу внешность
- Обработка занимает ~5-10 секунд

### Шаг 2: Заполните форму
- **Имя артиста** (обязательно)
- **Город** (обязательно)
- **Жанры** — выберите из списка или введите свои
- **Места выступлений** — где вы играете
- **Музыкальный стиль** — ваш уникальный подход
- **Навыки и достижения** — что вы умеете
- **Социальные сети** — ссылки (опционально)

### Шаг 3: Получите результат
- **Генерация BIO** — 5-15 секунд
- **Редактирование** — можно изменить любую часть
- **Скачать PDF** — готовый пресс-кит

### Шаг 4: Используйте EPK
- Отправляйте букерам и промоутерам
- Публикуйте на своем сайте
- Используйте для пресс-релизов

---

## 📄 Архитектурные решения

Все ключевые решения зафиксированы в `.taskmaster/docs/`:

### AI & Content
- **`decisions.md`** — Стек, архитектура, промпты для GPT
  - `PROMPT-SPEC-001`: Финальная версия промптов для BIO
  - `DECISION-001/002`: Выбор технологий и структура данных

### PDF Generation
- **`decisions-cyrillic-pdf.md`** — Поддержка кириллицы
  - `DECISION-PDF-ENGINE-001`: Puppeteer + HTML→PDF
  - `FONT-POLICY-001`: Noto Sans/Serif для русского текста

### Image Enhancement
- **`decisions-replicate-pro.md`** — AI улучшение фото
  - `DECISION-IMG-ENGINE-REPLICATE-001`: Real-ESRGAN без face_enhance
  - `FLOW-PHOTO-001`: Upload → AI → Post-processing → Save
  - `PROMPT-IMG-001`: Тонкая обработка с сохранением внешности

---

## 🎨 Дизайн-система

### Цветовая палитра
```css
Primary:   Blue (#3B82F6) → Purple (#8B5CF6)
Secondary: Pink (#EC4899), Green (#10B981)
Neutral:   Gray-50 → Gray-900 (light/dark modes)
```

### Компоненты
- **Glassmorphism cards** — backdrop-blur с полупрозрачностью
- **Gradient buttons** — blue-to-purple с hover effects
- **Icons** — Heroicons для consistency
- **Typography** — Gradients для заголовков, readable body text
- **Animations** — Fade-in, shake, pulse-glow, scale transforms

### Responsive Breakpoints
- Mobile: < 768px (1 column)
- Tablet: 768px - 1024px (2 columns)
- Desktop: > 1024px (3 columns)

---

## 🔧 Разработка

### Task Management
Проект использует **Task-Master-AI** для управления задачами:
```bash
task-master list              # Список задач
task-master next              # Следующая задача
task-master show <id>         # Детали задачи
```

### Architecture Documentation
**Context7** для фиксации решений в `.taskmaster/docs/`

### Development Workflow
1. Короткие итерации (vibe coding)
2. Continuous deployment на Netlify [[memory:9727643]]
3. Автоматический build в dist [[memory:1353034]]

---

## 📝 Лицензия

MIT

---

**Создано с помощью AI • Для артистов, от артистов**

\n<!-- redeploy 2025-10-16 15:00:06 MSK -->
