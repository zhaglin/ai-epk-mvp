# 🚀 Инструкция по деплою ArtistOne на Netlify

## Подготовка к деплою

### 1. Создание аккаунта Netlify
- Зарегистрируйтесь на [netlify.com](https://netlify.com)
- Подключите GitHub аккаунт (рекомендуется)

### 2. Настройка репозитория
```bash
# В папке netlify-deploy выполните:
git init
git add .
git commit -m "Initial commit: ArtistOne EPK Generator"
git branch -M main
git remote add origin https://github.com/your-username/artistone-epk.git
git push -u origin main
```

## Деплой на Netlify

### Метод 1: Через Netlify Dashboard (Рекомендуется)

1. **Создание нового сайта:**
   - Войдите в [Netlify Dashboard](https://app.netlify.com)
   - Нажмите **"New site from Git"**
   - Выберите ваш GitHub репозиторий
   - Выберите папку `netlify-deploy` как корневую

2. **Настройка сборки:**
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Node version:** 18

3. **Переменные окружения:**
   - Перейдите в **Site settings** → **Environment variables**
   - Добавьте переменные (см. ENVIRONMENT_VARIABLES.md)

4. **Деплой:**
   - Нажмите **"Deploy site"**
   - Дождитесь завершения сборки

### Метод 2: Drag & Drop

1. Соберите проект локально:
```bash
cd netlify-deploy
npm install
npm run build
```

2. Перетащите папку `.next` в область деплоя на Netlify Dashboard

### Метод 3: Netlify CLI

```bash
# Установка Netlify CLI
npm install -g netlify-cli

# Вход в аккаунт
netlify login

# Деплой
cd netlify-deploy
netlify deploy --prod --dir=.next
```

## Проверка работы

После успешного деплоя:

1. **Откройте ваш сайт** (URL будет вида `https://your-site-name.netlify.app`)

2. **Протестируйте функциональность:**
   - ✅ Загрузка фотографии
   - ✅ Заполнение формы артиста
   - ✅ AI улучшение фото (должно работать за 5-10 сек)
   - ✅ Генерация биографии
   - ✅ Создание PDF

3. **Проверьте API endpoints:**
   - `/api/upload` - загрузка файлов
   - `/api/enhance-photo` - улучшение фото
   - `/api/generate-bio` - генерация биографии
   - `/api/generate-pdf` - создание PDF

## Возможные проблемы

### Ошибка 500 при AI обработке
- Проверьте правильность `REPLICATE_API_TOKEN`
- Убедитесь, что на аккаунте Replicate есть кредиты

### Ошибка 500 при генерации биографии  
- Проверьте правильность `OPENAI_API_KEY`
- Убедитесь, что у аккаунта OpenAI есть доступ к API

### Медленная работа
- Это нормально для AI обработки (5-10 секунд)
- Replicate использует GPU очередь

## Мониторинг

- **Netlify Dashboard** → **Functions** - мониторинг API вызовов
- **Netlify Dashboard** → **Analytics** - статистика посещений
- **Console в браузере** - отладка клиентской части

## Обновления

Для обновления сайта:
```bash
cd netlify-deploy
git add .
git commit -m "Update: описание изменений"
git push origin main
```

Netlify автоматически выполнит новый деплой при пуше в main ветку.

---

🎉 **Поздравляем!** ArtistOne EPK Generator успешно развернут на Netlify!
