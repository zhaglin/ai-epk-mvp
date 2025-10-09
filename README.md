# AI-EPK MVP

**Генератор профессионального электронного пресс-кита для артистов**

Автоматическая генерация BIO артиста с помощью GPT и экспорт в PDF.

---

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```bash
OPENAI_API_KEY=your-openai-api-key-here
```

Получите API ключ на [OpenAI Platform](https://platform.openai.com/api-keys).

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

- **Frontend:** Next.js 14 (App Router), React, TypeScript
- **Styling:** TailwindCSS
- **AI:** OpenAI GPT-4o-mini
- **PDF:** (в разработке)
- **Deploy:** Netlify

---

## 📋 Текущий статус (66.7% готово)

✅ **Реализовано:**
- Форма ввода данных артиста с валидацией
- AI-генерация BIO через GPT (elevator pitch, full bio, highlights)
- Отображение результатов на странице
- Красивый UI с TailwindCSS

⏳ **В разработке:**
- PDF генерация и скачивание
- End-to-end тестирование

---

## 🎯 Как использовать

1. Откройте приложение
2. Заполните форму с информацией об артисте:
   - Имя, город, жанры
   - Места выступлений
   - Стиль и подход к музыке
   - Навыки и достижения
   - Ссылки на соцсети (опционально)
3. Нажмите "Сгенерировать BIO"
4. Получите профессиональное описание
5. (Скоро) Скачайте готовый PDF

---

## 📄 Архитектурные решения

Все ключевые решения зафиксированы в `.taskmaster/docs/decisions.md`:
- **DECISION-001:** Стек и архитектура
- **DECISION-002:** Структура данных
- **PROMPT-SPEC-001:** GPT промпты
- **PDF-SPEC-001:** Макет PDF (в разработке)
- **DOD-MVP-001:** Критерии готовности MVP

---

## 🔧 Разработка

Проект использует:
- **Task-Master-AI** для управления задачами
- **Context7** для фиксации архитектурных решений
- Вайбкодинг подход — короткие итерации

Просмотр задач:
```bash
task-master list
task-master next
```

---

## 📝 Лицензия

MIT

---

**Создано с помощью AI • Для артистов, от артистов**

