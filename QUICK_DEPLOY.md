# ⚡ Быстрый деплой ArtistOne на Netlify

## 🎯 5 минут до продакшена!

### Шаг 1: Подготовка (2 мин)
```bash
# Перейти в папку для деплоя
cd netlify-deploy

# Инициализировать Git (если еще не сделано)
git init
git add .
git commit -m "ArtistOne EPK Generator - Production Ready"
```

### Шаг 2: GitHub (1 мин)
```bash
# Создать репозиторий на GitHub и запушить
git remote add origin https://github.com/your-username/artistone-epk.git
git branch -M main
git push -u origin main
```

### Шаг 3: Netlify (2 мин)
1. **Заходим на [netlify.com](https://netlify.com)**
2. **New site from Git** → выбираем GitHub репозиторий
3. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Root directory: `netlify-deploy`

### Шаг 4: Environment Variables (30 сек)
В Netlify Dashboard → Site settings → Environment variables:

```
OPENAI_API_KEY = sk-proj-ваш-ключ-openai
REPLICATE_API_TOKEN = r8_ваш-токен-replicate
```

### Шаг 5: Деплой! 🚀
- Нажимаем **"Deploy site"**
- Ждем 2-3 минуты
- Получаем ссылку на сайт!

---

## 🎉 Готово!

Ваш **ArtistOne EPK Generator** теперь работает в продакшене!

**URL будет:** `https://your-site-name.netlify.app`

---

## 🧪 Быстрый тест
1. Загрузите фото артиста
2. Заполните форму
3. Нажмите "Создать EPK"
4. Дождитесь AI обработки (5-10 сек)
5. Скачайте готовый PDF!

---

## 🔧 Если что-то пошло не так

**Ошибка 500 при AI обработке:**
- Проверьте `REPLICATE_API_TOKEN`
- Убедитесь, что есть кредиты на Replicate

**Ошибка 500 при генерации биографии:**
- Проверьте `OPENAI_API_KEY`
- Убедитесь в доступе к OpenAI API

**Медленная работа:**
- Это нормально! AI обработка занимает 5-10 секунд

---

## 📞 Поддержка

Если нужна помощь:
- 📖 Полная документация: `DEPLOY_INSTRUCTIONS.md`
- 🔑 Настройка переменных: `ENVIRONMENT_VARIABLES.md`
- 📊 Статус готовности: `DEPLOYMENT_STATUS.md`

---

**Удачи с деплоем! 🎵✨**
