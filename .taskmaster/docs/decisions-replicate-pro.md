# Решения по профессиональному AI-улучшению фото через Replicate

**Дата:** 2025-10-09  
**Статус:** ✅ В разработке

---

## DECISION-IMG-ENGINE-REPLICATE-001: Replicate как основной AI-движок

**Проблема:** Простое улучшение через Sharp дает минимальный эффект. Нужен профессиональный результат уровня портфолио артиста.

**Решение:** Использование Replicate API с трехэтапным пайплайном обработки.

**Архитектура:**
- **Этап 1:** Восстановление лица (CodeFormer с fidelity 0.95)
- **Этап 2:** Художественная стилизация (SDXL с пресетами стилей)
- **Этап 3:** Финальный апскейл (Real-ESRGAN 2x + face_enhance)

**Модели:**
- `sczhou/codeformer` - восстановление и улучшение лица
- `stability-ai/sdxl` - художественная стилизация
- `nightmareai/real-esrgan` - финальный апскейл

---

## FLOW-PHOTO-001: Пайплайн обработки фото

**Проблема:** Необходим структурированный процесс для получения предсказуемого качественного результата.

**Решение:** Трехэтапный пайплайн с fallback системой.

**Схема:**
1. **Upload:** Клиент загружает фото → сохраняется в `/tmp/uploads/`
2. **Face Restore:** CodeFormer восстанавливает детали лица, upscale 2x
3. **Stylize:** SDXL применяет художественный стиль (по пресету)
4. **Upscale:** Real-ESRGAN финальное увеличение качества
5. **Save:** Результат → `/public/generated/`
6. **Fallback:** Если AI недоступен → простое улучшение через Sharp

**Файлы:**
- `lib/aiImage.ts` - основной модуль с пайплайном
- `app/api/enhance-photo/route.ts` - API endpoint
- `lib/simpleImageEnhancement.ts` - fallback решение

---

## PROMPT-IMG-REPLICATE-001: Структура промптов для стилей

**Проблема:** Необходимы готовые промпты для разных музыкальных стилей.

**Решение:** Набор пресетов с positive/negative промптами.

### Базовый шаблон:

**Positive:**
```
editorial DJ portrait, [STYLE_SPECIFIC], soft bokeh, subtle film grain,
fashion magazine look, clean color, natural skin, sharp eyes, [VIBE],
preserve identity, realistic face, modern background
```

**Negative:**
```
distortion, extra limbs, artifacts, over-smoothing, plastic skin,
watermark, text, glitch, nsfw, deformed face, ugly, blurry
```

### Пресеты стилей:

#### 1. Techno Noir
- **Positive:** neon blue purple tones, high contrast, deep shadows, techno vibe, modern club background
- **Negative:** + bright, flat
- **Интенсивность:** Subtle 0.25, Medium 0.4, Bold 0.6

#### 2. Minimal House
- **Positive:** daylight tones, neutral palette, soft matte contrast, minimalist aesthetic, clean background, natural lighting
- **Negative:** + neon, dramatic
- **Интенсивность:** Subtle 0.25, Medium 0.4, Bold 0.6

#### 3. Festival
- **Positive:** warm lights, vibrant energy, artistic motion blur, festival atmosphere, golden hour lighting
- **Negative:** + dark
- **Интенсивность:** Subtle 0.25, Medium 0.4, Bold 0.6

#### 4. Deep Club
- **Positive:** dark background, spotlight glow, green magenta ambience, moody atmosphere, deep house vibe
- **Negative:** + bright
- **Интенсивность:** Subtle 0.25, Medium 0.4, Bold 0.6

#### 5. Natural
- **Positive:** professional portrait photo, natural lighting, clean background, realistic, high quality photography
- **Negative:** + artistic, stylized
- **Интенсивность:** Subtle 0.25, Medium 0.4, Bold 0.6

---

## SEED-POLICY-002: Управление повторяемостью

**Проблема:** Результат должен быть воспроизводимым при необходимости.

**Решение:** Фиксация seed для каждой обработки.

**Детали:**
- По умолчанию: случайный seed (1-1000000)
- Возможность передать конкретный seed для воспроизведения
- Seed возвращается в ответе API для повторного использования
- Логируется вместе с результатом

---

## STYLE-PRESETS-002: Пресеты музыкальных стилей

**Проблема:** Артисты из разных жанров нуждаются в разной визуальной эстетике.

**Решение:** 5 готовых пресетов под разные музыкальные стили.

**Пресеты:**
1. **Techno Noir** - неоновые тона, высокий контраст
2. **Minimal House** - дневной свет, нейтральная палитра
3. **Festival** - теплый свет, энергия
4. **Deep Club** - темный фон, spotlight
5. **Natural** - естественная обработка

**Интенсивность:**
- **Subtle** - минимальные изменения (strength 0.25)
- **Medium** - заметная стилизация (strength 0.4)
- **Bold** - выраженный стиль (strength 0.6)

---

## IMPLEMENTATION STATUS

- [x] Создан модуль `lib/aiImage.ts`
- [x] Добавлены пресеты стилей
- [x] Определены уровни интенсивности
- [x] Создан профессиональный пайплайн `enhanceArtistPortraitPro`
- [ ] Добавить UI для выбора стиля
- [ ] Добавить слайдер интенсивности
- [ ] Добавить отображение seed
- [ ] Добавить возможность повторной обработки с другим seed
- [ ] Протестировать с реальными кредитами Replicate
- [ ] Обновить документацию TESTING_AI_PHOTO.md

---

## ACCEPTANCE CRITERIA

✅ **Результат фотореалистичный**, лицо естественное  
✅ **Разные пресеты визуально отличаются**  
✅ **Обработка ≤ 40 секунд**  
✅ **Seed воспроизводим**  
✅ **В PDF и web одно изображение**  
✅ **Нет артефактов и "пластикового" лица**  

---

## NEXT STEPS

1. Добавить UI компоненты для выбора стиля и интенсивности
2. Протестировать с реальными кредитами Replicate
3. Оптимизировать время обработки
4. Добавить кэширование результатов по seed

