# 🔍 Диагностика проблемы "Failed to upload file" на Netlify

**Статус:** Фото загружается ✅, но AI enhancement падает ❌

---

## 🎯 Что именно происходит:

Судя по скриншоту:
1. ✅ **Фото загружено успешно** - отображается на странице
2. ❌ **AI Enhancement падает** - ошибка "Failed to upload file"

Это означает, что проблема не в `/api/upload`, а в `/api/enhance-photo`!

---

## 🔍 Проверьте логи Netlify:

### 1. Откройте логи функций:

```
Netlify Dashboard → Functions → enhance-photo → View logs
```

### 2. Ищите конкретную ошибку:

Возможные причины:

#### A) Проблема с переменными окружения:
```
[Enhance] Error: REPLICATE_API_TOKEN is not set
```
**Решение:** Добавьте `REPLICATE_API_TOKEN` в Environment variables

#### B) Проблема с правами доступа:
```
EACCES: permission denied, mkdir '/tmp/generated'
```
**Решение:** Уже исправлено в последнем коммите

#### C) Проблема с Replicate API:
```
402 Payment Required
429 Too Many Requests
```
**Решение:** Проверьте кредиты на Replicate

#### D) Проблема с размером функции:
```
Function size exceeds limit
```
**Решение:** Нужно оптимизировать зависимости

---

## ✅ Что нужно проверить прямо сейчас:

### 1. Переменные окружения в Netlify

**Site settings → Environment:**

| Variable | Должно быть | Проверка |
|----------|-------------|----------|
| `OPENAI_API_KEY` | `sk-xxx...` | ✅ Есть? |
| `REPLICATE_API_TOKEN` | `r8_xxx...` | ✅ Есть? |
| `NEXT_PUBLIC_BASE_URL` | `https://artist-one.netlify.app` | ✅ Правильный URL? |

⚠️ **ВАЖНО:** После добавления переменных нужно **Redeploy**!

### 2. Redeploy с очисткой кэша:

```
Deploys → Trigger deploy → Clear cache and deploy
```

### 3. Проверьте логи деплоя:

```
Deploys → Latest → View logs
```

Ищите строки:
```
✓ Compiled successfully
✓ Functions deployed
```

---

## 🔧 Быстрое исправление:

Если логи показывают проблему с `/tmp`, давайте попробуем альтернативный подход - **хранение файлов в памяти** вместо файловой системы.

### Вариант 1: Использовать Netlify Blobs (рекомендуется)

Netlify Blobs - это встроенное хранилище для временных файлов.

### Вариант 2: Передавать файлы через base64

Вместо сохранения в `/tmp`, передавать изображения как base64 строки между API endpoints.

---

## 📊 Диагностический чеклист:

Выполните по порядку и отметьте результаты:

- [ ] **Проверить переменные окружения** в Netlify
  - [ ] `OPENAI_API_KEY` присутствует
  - [ ] `REPLICATE_API_TOKEN` присутствует  
  - [ ] `NEXT_PUBLIC_BASE_URL` правильный

- [ ] **Проверить логи Functions**
  - [ ] Открыть Functions → enhance-photo
  - [ ] Найти ошибку в логах
  - [ ] Скопировать точное сообщение ошибки

- [ ] **Проверить последний деплой**
  - [ ] Коммит `4e88929` задеплоен
  - [ ] Build прошел успешно
  - [ ] Functions созданы

- [ ] **Redeploy с очисткой**
  - [ ] Trigger deploy
  - [ ] Clear cache and deploy
  - [ ] Дождаться завершения

---

## 🚀 Следующие шаги:

### Если переменные окружения не добавлены:

1. **Site settings → Environment**
2. **Add variable** для каждой:
   ```
   OPENAI_API_KEY = ваш-ключ
   REPLICATE_API_TOKEN = ваш-токен
   NEXT_PUBLIC_BASE_URL = https://artist-one.netlify.app
   ```
3. **Save**
4. **Deploys → Trigger deploy**

### Если переменные есть, но ошибка остается:

**Отправьте точное сообщение об ошибке из логов Netlify Functions!**

Мне нужно увидеть:
```
[Enhance] Starting AI enhancement...
[Enhance] Error: <ТОЧНАЯ ОШИБКА ЗДЕСЬ>
```

С этой информацией я смогу точно определить проблему и исправить!

---

## 💡 Временное решение:

Пока ищем проблему, можно попробовать:

1. **Обновить страницу** и попробовать снова
2. **Загрузить фото меньшего размера** (< 500KB)
3. **Подождать 2-3 минуты** между попытками (rate limit)

---

## 📞 Нужна помощь?

**Отправьте мне:**
1. Скриншот или текст ошибки из Netlify Functions logs
2. Подтверждение что переменные окружения добавлены
3. URL вашего сайта на Netlify

И я сразу исправлю проблему! 🚀

---

**Скорее всего проблема в том, что REPLICATE_API_TOKEN не добавлен в Netlify Environment!**

Проверьте это в первую очередь! ⬆️

