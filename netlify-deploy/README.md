# 🎨 ArtistOne EPK Generator

**Современный генератор электронных пресс-китов для артистов с AI-улучшением фотографий**

## ✨ Основные возможности

- 🤖 **AI-улучшение фотографий** - Real-ESRGAN для повышения качества без изменения лица
- 📝 **Автоматическая генерация биографии** - OpenAI GPT для создания профессиональных описаний
- 📄 **PDF-генерация** - Красивые пресс-киты в формате PDF
- 🎨 **Современный дизайн** - Glassmorphism, градиенты, темная/светлая темы
- 📱 **Адаптивность** - Оптимизировано для всех устройств

## 🚀 Быстрый старт

### Локальная разработка

```bash
# Установка зависимостей
npm install

# Настройка переменных окружения
cp .env.example .env.local
# Отредактируйте .env.local с вашими API ключами

# Запуск в режиме разработки
npm run dev
```

### Деплой на Netlify

1. **Подготовка:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: ArtistOne EPK Generator"
   git branch -M main
   git remote add origin https://github.com/your-username/artistone-epk.git
   git push -u origin main
   ```

2. **Настройка в Netlify:**
   - Создайте новый сайт из GitHub репозитория
   - Установите переменные окружения (см. `ENVIRONMENT_VARIABLES.md`)
   - Выполните деплой

Подробная инструкция: [DEPLOY_INSTRUCTIONS.md](./DEPLOY_INSTRUCTIONS.md)

## 🔧 Технологический стек

### Frontend
- **Next.js 15** - React фреймворк
- **TypeScript** - Типизация
- **Tailwind CSS** - Стилизация
- **Heroicons** - Иконки

### Backend & AI
- **OpenAI API** - Генерация биографий
- **Replicate API** - AI улучшение фотографий
- **Sharp** - Обработка изображений
- **Puppeteer** - PDF генерация

### Деплой
- **Netlify** - Хостинг и CDN
- **@netlify/plugin-nextjs** - Интеграция с Next.js

## 📁 Структура проекта

```
netlify-deploy/
├── app/                    # Next.js App Router
│   ├── api/               # API маршруты
│   ├── globals.css        # Глобальные стили
│   ├── layout.tsx         # Корневой layout
│   └── page.tsx           # Главная страница
├── components/            # React компоненты
│   ├── ArtistForm.tsx     # Форма артиста
│   └── BioEditor.tsx      # Редактор биографии
├── lib/                   # Утилиты и логика
│   ├── aiImage.ts         # AI обработка изображений
│   ├── pdf-*.ts          # PDF генерация
│   └── prompts.ts         # AI промпты
├── public/                # Статические файлы
├── netlify.toml           # Конфигурация Netlify
└── package.json           # Зависимости
```

## 🎯 API Endpoints

| Endpoint | Описание | Метод |
|----------|----------|-------|
| `/api/upload` | Загрузка фотографии | POST |
| `/api/enhance-photo` | AI улучшение фото | POST |
| `/api/generate-bio` | Генерация биографии | POST |
| `/api/generate-pdf` | Создание PDF | POST |
| `/api/temp-file/[filename]` | Временные файлы | GET/DELETE |

## 🔑 Переменные окружения

### Обязательные
- `OPENAI_API_KEY` - API ключ OpenAI
- `REPLICATE_API_TOKEN` - Токен Replicate

### Опциональные
- `NODE_ENV` - Окружение (production/development)

Подробнее: [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)

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

## 📊 Производительность

### AI Обработка
- **Время обработки:** 5-10 секунд (было 40+ секунд)
- **Модель:** Real-ESRGAN с `face_enhance: false`
- **Качество:** Высокое без изменения черт лица

### PDF Генерация
- **Размер:** ~1-2 MB
- **Время:** 2-3 секунды
- **Формат:** A4, оптимизированный для печати

## 🧪 Тестирование

```bash
# Линтинг
npm run lint

# Проверка типов
npx tsc --noEmit

# Сборка
npm run build
```

## 📈 Мониторинг

- **Netlify Dashboard** - Аналитика, функции, деплои
- **Console logs** - Отладка в браузере
- **API статус** - Проверка доступности сервисов

## 🔄 Обновления

```bash
# Обновление зависимостей
npm update

# Новый деплой
git add .
git commit -m "Update: описание изменений"
git push origin main
```

## 📞 Поддержка

При возникновении проблем:

1. Проверьте переменные окружения
2. Убедитесь в наличии кредитов на OpenAI/Replicate
3. Проверьте логи в Netlify Dashboard
4. Создайте issue в репозитории

---

**ArtistOne** - Создавайте профессиональные EPK за минуты! 🎵✨