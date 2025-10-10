# 🔐 Настройка переменных окружения

## 📋 Обязательные переменные

### 1. OpenAI API Key
**Переменная:** `OPENAI_API_KEY`  
**Назначение:** Используется для генерации профессиональных биографий артистов через GPT-4o  
**Где получить:** [OpenAI API Keys](https://platform.openai.com/api-keys)

### 2. Replicate API Token
**Переменная:** `REPLICATE_API_TOKEN`  
**Назначение:** Используется для AI-улучшения фотографий артистов  
**Где получить:** [Replicate Account Settings](https://replicate.com/account/api-tokens)

### 3. Public Base URL
**Переменная:** `NEXT_PUBLIC_BASE_URL`  
**Назначение:** Базовый URL приложения для корректной работы API  
**Значение для локальной разработки:** `http://localhost:3000`  
**Значение для Netlify:** Автоматически устанавливается как URL вашего сайта (например, `https://your-site.netlify.app`)

---

## 🖥️ Локальная разработка

### Шаг 1: Создайте файл `.env.local`

```bash
# В корне проекта создайте файл .env.local
touch .env.local
```

### Шаг 2: Добавьте переменные

```env
# .env.local
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Шаг 3: Перезапустите dev-сервер

```bash
npm run dev
```

---

## 🚀 Netlify Deployment

### Настройка переменных окружения в Netlify:

1. **Откройте ваш сайт в Netlify Dashboard**
2. **Перейдите в:** Site settings → Build & deploy → Environment
3. **Добавьте переменные:**

| Key | Value | Описание |
|-----|-------|----------|
| `OPENAI_API_KEY` | `sk-xxx...` | Ваш ключ OpenAI API |
| `REPLICATE_API_TOKEN` | `r8_xxx...` | Ваш токен Replicate API |
| `NEXT_PUBLIC_BASE_URL` | `https://your-site.netlify.app` | URL вашего сайта на Netlify |

### ⚠️ Важно:

- **Не коммитьте** файлы `.env` или `.env.local` в Git!
- **Всегда используйте** переменные окружения для секретных ключей
- **Обновляйте** `NEXT_PUBLIC_BASE_URL` после получения URL от Netlify

---

## 🔍 Проверка настройки

### Локально:
```bash
# Убедитесь, что переменные загружены
npm run dev

# В логах должно быть:
# ✓ Ready in XXXXms
# - Environments: .env.local
```

### На Netlify:
1. Перейдите в **Deploys**
2. Откройте последний деплой
3. Проверьте логи на наличие ошибок с API ключами

---

## 🛡️ Безопасность

✅ **Что МОЖНО:**
- Хранить `.env.local` локально (он в `.gitignore`)
- Использовать переменные окружения в Netlify
- Делиться `.env.example` (без реальных значений)

❌ **Что НЕЛЬЗЯ:**
- Коммитить `.env` файлы в Git
- Публиковать API ключи в коде
- Использовать одни ключи для dev/prod

---

## 📝 Шаблон .env.local

Создайте файл `.env.local` в корне проекта:

```env
# OpenAI API Key (обязательно для генерации BIO)
# Получить: https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here

# Replicate API Token (обязательно для AI улучшения фото)
# Получить: https://replicate.com/account/api-tokens
REPLICATE_API_TOKEN=your_replicate_api_token_here

# Public Base URL (для локальной разработки)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## 🚨 Устранение неполадок

### Ошибка: "Missing OPENAI_API_KEY"
✅ Проверьте, что переменная добавлена в `.env.local` или Netlify Environment

### Ошибка: "Replicate API 401 Unauthorized"
✅ Убедитесь, что `REPLICATE_API_TOKEN` корректный и активный

### Ошибка: "Failed to fetch image"
✅ Проверьте `NEXT_PUBLIC_BASE_URL` - он должен совпадать с текущим URL

---

**Готово!** Переменные окружения настроены безопасно и профессионально. 🎉

