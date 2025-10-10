# 🔐 Чеклист безопасности перед деплоем

## ✅ Проверка безопасности

### 1. API ключи и секреты

- [x] **Все API ключи в переменных окружения**
  - `OPENAI_API_KEY` - только в `.env.local` и Netlify Environment
  - `REPLICATE_API_TOKEN` - только в `.env.local` и Netlify Environment
  
- [x] **Файлы `.env` в `.gitignore`**
  - `.env`
  - `.env*.local`
  - `.taskmaster/.env`

- [x] **Нет хардкодных ключей в коде**
  - ✅ Проверено grep поиском
  - ✅ Нет реальных токенов в репозитории

### 2. Конфигурация Next.js

- [x] **`next.config.js` безопасен**
  - ❌ ~~Убраны API ключи из блока `env`~~ (исправлено)
  - ✅ API ключи доступны только на сервере
  - ✅ Добавлены webpack fallbacks для безопасности

- [x] **Оптимизации включены**
  - ✅ `reactStrictMode: true`
  - ✅ `swcMinify: true`
  - ✅ `compress: true`
  - ✅ `poweredByHeader: false` (скрывает технологию)

### 3. Использование переменных окружения

- [x] **Серверные переменные**
  - `process.env.OPENAI_API_KEY` - только в API routes
  - `process.env.REPLICATE_API_TOKEN` - только в API routes
  
- [x] **Публичные переменные**
  - `NEXT_PUBLIC_BASE_URL` - безопасно использовать в клиенте
  - Префикс `NEXT_PUBLIC_` для клиентских переменных

### 4. Netlify конфигурация

- [x] **`netlify.toml` настроен**
  - ✅ Корректная команда сборки: `npm run build`
  - ✅ Правильная папка публикации: `.next`
  - ✅ Node.js версия 18 указана
  - ✅ Next.js плагин добавлен

---

## 🚀 Инструкция по деплою на Netlify

### Шаг 1: Подготовка репозитория

```bash
# Убедитесь, что все изменения закоммичены
git status

# Проверьте, что .env файлы не отслеживаются
git ls-files | grep .env
# Должно быть пусто!

# Отправьте код в GitHub
git push origin main
```

### Шаг 2: Создание сайта на Netlify

1. Откройте [Netlify](https://app.netlify.com)
2. Нажмите **"Add new site"** → **"Import an existing project"**
3. Выберите **"Deploy with GitHub"**
4. Найдите репозиторий `zhaglin/ai-epk-mvp`
5. **Важно:** Netlify автоматически определит Next.js настройки

### Шаг 3: Настройка переменных окружения

**В Netlify Dashboard:**

1. Перейдите в **Site settings**
2. **Build & deploy** → **Environment**
3. Нажмите **"Add a variable"** для каждой:

| Variable | Value | Описание |
|----------|-------|----------|
| `OPENAI_API_KEY` | `sk-xxx...` | Ваш ключ OpenAI API |
| `REPLICATE_API_TOKEN` | `r8_xxx...` | Ваш токен Replicate API |
| `NEXT_PUBLIC_BASE_URL` | `https://ваш-сайт.netlify.app` | URL сайта (обновить после деплоя) |

### Шаг 4: Деплой

1. Нажмите **"Deploy site"**
2. Дождитесь завершения сборки (2-3 минуты)
3. Получите URL сайта

### Шаг 5: Обновление Base URL

1. Скопируйте URL вашего сайта (например, `https://artistic-epk.netlify.app`)
2. Вернитесь в **Environment variables**
3. Обновите `NEXT_PUBLIC_BASE_URL` на ваш Netlify URL
4. Нажмите **"Redeploy"** для применения изменений

---

## 🔍 Проверка безопасности после деплоя

### 1. Проверьте логи деплоя

```
✓ Build succeeded!
✓ Functions deployed successfully
✓ Site is live!
```

### 2. Проверьте функциональность

- ✅ AI улучшение фото работает
- ✅ Генерация BIO работает
- ✅ PDF генерация работает
- ✅ Нет ошибок 401/403 в консоли

### 3. Проверьте секретность ключей

**В браузере откройте DevTools → Sources:**

- ❌ API ключи НЕ должны быть видны в клиентском коде
- ❌ Токены НЕ должны быть в Network запросах (кроме заголовков сервера)
- ✅ Только `NEXT_PUBLIC_BASE_URL` может быть виден

---

## 🛡️ Рекомендации по безопасности

### Обязательно:

✅ **Ротация ключей**
- Меняйте API ключи каждые 90 дней
- Используйте разные ключи для dev/prod

✅ **Мониторинг использования**
- Следите за расходом API через OpenAI Dashboard
- Настройте алерты на превышение лимитов

✅ **Резервные копии**
- Сохраните конфигурацию Netlify
- Документируйте все переменные окружения

### Дополнительно:

🔒 **Rate Limiting**
- Рассмотрите добавление rate limiting для API endpoints
- Используйте Next.js Middleware для защиты

🔒 **CORS настройки**
- Ограничьте домены для API запросов
- Добавьте проверку origin в API routes

🔒 **Логирование**
- Логируйте все API вызовы (без ключей!)
- Настройте мониторинг ошибок (Sentry, LogRocket)

---

## 📋 Финальный чеклист

Перед деплоем убедитесь:

- [ ] ✅ Все API ключи в Netlify Environment
- [ ] ✅ `.env` файлы не в Git
- [ ] ✅ `next.config.js` не содержит секретов
- [ ] ✅ Build проходит локально (`npm run build`)
- [ ] ✅ Все функции протестированы
- [ ] ✅ Документация обновлена

---

## 🚨 Что делать при утечке ключей

### Если API ключ попал в Git:

1. **Немедленно ревокните** скомпрометированный ключ
2. **Создайте новый** ключ в соответствующем сервисе
3. **Обновите** переменные окружения в Netlify
4. **Очистите Git историю** (используйте `git filter-branch` или BFG Repo-Cleaner)
5. **Force push** очищенный репозиторий

### Контакты поддержки:

- OpenAI: https://help.openai.com
- Replicate: https://replicate.com/docs/get-started/support
- Netlify: https://www.netlify.com/support/

---

**Безопасность настроена! Готово к деплою! 🚀🔐**

