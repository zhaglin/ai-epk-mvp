# Настройка AI Photo Enhancement

## Требуемые API ключи

### 1. Replicate API Token
Для AI обработки изображений нужен токен Replicate:

1. Зарегистрируйтесь на [replicate.com](https://replicate.com)
2. Получите API токен в разделе Account → API tokens
3. Добавьте в `.env.local`:
```
REPLICATE_API_TOKEN=your_replicate_api_token_here
```

### 2. OpenAI API Key (уже настроен)
Для генерации BIO текста:
```
OPENAI_API_KEY=your_openai_api_key_here
```

## Тестирование

1. **Загрузка фото**: Откройте форму и загрузите изображение
2. **AI обработка**: Система автоматически улучшит фото
3. **PDF интеграция**: Сгенерированный EPK будет включать улучшенное фото

## Функциональность

✅ **Загрузка файлов**: JPEG, PNG, WebP до 5MB  
✅ **AI улучшение**: Stable Diffusion XL для портретов  
✅ **PDF интеграция**: Фото включается как обложка EPK  
✅ **Fallback**: Использование оригинального фото при ошибках AI  
✅ **UX**: Индикаторы прогресса и обработка ошибок  

## Архитектура

- **Upload**: `/api/upload` - загрузка и оптимизация файлов
- **Enhance**: `/api/enhance-photo` - AI обработка через Replicate
- **PDF**: Обновленный шаблон с поддержкой фото
- **UI**: Drag-and-drop загрузка с превью

## Следующие шаги

1. Настройте REPLICATE_API_TOKEN
2. Протестируйте загрузку и AI обработку
3. Проверьте интеграцию в PDF
4. Деплой на Netlify
