# Environment Variables для Netlify

Для корректной работы ArtistOne на Netlify необходимо настроить следующие переменные окружения:

## Обязательные переменные:

1. **OPENAI_API_KEY**
   - Описание: API ключ OpenAI для генерации биографий артистов
   - Получить: https://platform.openai.com/api-keys
   - Пример: `sk-proj-...`

2. **REPLICATE_API_TOKEN** 
   - Описание: Токен Replicate для улучшения фотографий с помощью AI
   - Получить: https://replicate.com/account/api-tokens
   - Пример: `r8_...`

## Настройка в Netlify:

1. Перейдите в Dashboard вашего сайта на Netlify
2. Откройте **Site settings** → **Environment variables**
3. Добавьте переменные:
   ```
   OPENAI_API_KEY = sk-proj-ваш-ключ-openai
   REPLICATE_API_TOKEN = r8_ваш-токен-replicate
   ```
4. Нажмите **Save**

## Локальная разработка:

Создайте файл `.env.local` в корне проекта:
```bash
OPENAI_API_KEY=sk-proj-ваш-ключ-openai
REPLICATE_API_TOKEN=r8_ваш-токен-replicate
NODE_ENV=development
```

## Проверка:

После деплоя проверьте работу:
1. Загрузите фото артиста
2. Заполните форму с информацией об артисте  
3. Нажмите "Создать EPK"
4. Убедитесь, что AI обработка работает корректно
