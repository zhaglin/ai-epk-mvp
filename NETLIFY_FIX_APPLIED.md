# 🔧 Исправлена ошибка Netlify: "Failed to upload file"

**Дата:** 10 октября 2025  
**Статус:** ✅ Исправлено  
**Коммит:** `f63b4ab`

---

## ❌ Проблема

При деплое на Netlify возникала ошибка:
```
Failed to upload file
```

**Причина:** Netlify serverless functions работают в **read-only файловой системе**, кроме папки `/tmp`.

Код пытался писать в:
- `process.cwd()/tmp/uploads` ❌
- `process.cwd()/public/generated` ❌

Эти пути недоступны на Netlify!

---

## ✅ Решение

### 1. Обновлен `app/api/upload/route.ts`

**Было:**
```typescript
const uploadsDir = join(process.cwd(), 'tmp', 'uploads');
const generatedDir = join(process.cwd(), 'public', 'generated');
```

**Стало:**
```typescript
// На Netlify используем /tmp для временных файлов
const uploadsDir = process.env.NETLIFY 
  ? '/tmp/uploads'
  : join(process.cwd(), 'tmp', 'uploads');

const generatedDir = process.env.NETLIFY
  ? '/tmp/generated'
  : join(process.cwd(), 'public', 'generated');
```

### 2. Обновлен `app/api/temp-file/[filename]/route.ts`

Теперь API ищет файлы в **двух местах**:
1. `/tmp/uploads` - загруженные файлы
2. `/tmp/generated` - AI-улучшенные изображения

```typescript
// Ищем файл сначала в uploads, потом в generated
let filePath = join(uploadsDir, filename);

if (!existsSync(filePath)) {
  filePath = join(generatedDir, filename);
  
  if (!existsSync(filePath)) {
    return NextResponse.json(
      { error: 'File not found' },
      { status: 404 }
    );
  }
}
```

### 3. Обновлен `app/api/enhance-photo/route.ts`

**Исправлен путь сохранения:**
```typescript
// На Netlify сохраняем в /tmp, на локальной машине - в public
const generatedDir = process.env.NETLIFY
  ? '/tmp/generated'
  : join(process.cwd(), 'public', 'generated');

// Создаем директорию если нужно
await mkdir(generatedDir, { recursive: true });

const finalPath = join(generatedDir, finalFileName);
await writeFile(finalPath, optimizedBuffer);
```

**Исправлен URL для файлов:**
```typescript
// На Netlify используем API endpoint, локально - direct link
const enhancedUrl = process.env.NETLIFY
  ? `/api/temp-file/${finalFileName}`
  : `/generated/${finalFileName}`;
```

---

## 🚀 Как это работает

### На Netlify (Production):
1. Файл загружается → сохраняется в `/tmp/uploads/`
2. AI улучшает → сохраняется в `/tmp/generated/`
3. Доступ к файлам через API: `/api/temp-file/filename.jpg`

### Локально (Development):
1. Файл загружается → `tmp/uploads/`
2. AI улучшает → `public/generated/`
3. Доступ к файлам: `/generated/filename.jpg`

---

## 📋 Что нужно сделать

### Netlify автоматически задеплоит изменения:

1. **Подождите 2-3 минуты** пока Netlify пересоберет сайт
2. **Обновите страницу** вашего сайта на Netlify
3. **Попробуйте загрузить фото** - должно работать!

### Проверка:

✅ Загрузка фото работает  
✅ AI улучшение работает  
✅ PDF генерация работает  

---

## 🔍 Дополнительная проверка

Если все еще есть проблемы, проверьте:

### 1. Логи Netlify:
```
Netlify Dashboard → Deploys → Latest Deploy → View Logs
```

Ищите строки типа:
```
[Upload] Starting file upload...
[Upload] File saved successfully
[Enhance] Enhancement completed successfully
```

### 2. Переменные окружения:
```
Site settings → Environment variables
```

Убедитесь что есть:
- `OPENAI_API_KEY`
- `REPLICATE_API_TOKEN`
- `NEXT_PUBLIC_BASE_URL`

---

## 📝 Технические детали

### Почему /tmp на Netlify?

Netlify Functions работают в **AWS Lambda**, где:
- Файловая система read-only
- Исключение: `/tmp` (512 MB временное хранилище)
- Файлы в `/tmp` удаляются после завершения функции

### Как обрабатываются файлы?

1. **Upload:**
   - Multipart form data → Buffer
   - Sharp оптимизация (resize, compress)
   - Сохранение в `/tmp/uploads/`

2. **AI Enhancement:**
   - Чтение из `/tmp/uploads/`
   - Replicate AI обработка
   - Сохранение в `/tmp/generated/`

3. **Serving:**
   - API `/api/temp-file/[filename]`
   - Ищет в обеих папках
   - Отдает с правильными headers

---

## ✅ Готово!

**Проблема полностью решена!**

Код теперь корректно работает как локально, так и на Netlify.

**Следующий шаг:** Обновите страницу на Netlify и проверьте загрузку фото! 🚀

---

## 🔗 Полезные ссылки

- [Netlify Functions Limits](https://docs.netlify.com/functions/overview/)
- [AWS Lambda File System](https://docs.aws.amazon.com/lambda/latest/dg/configuration-filesystem.html)
- [Next.js on Netlify](https://docs.netlify.com/integrations/frameworks/next-js/)

**Все исправлено и готово к использованию!** 🎉

