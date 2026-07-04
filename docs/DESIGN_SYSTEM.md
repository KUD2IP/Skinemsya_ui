# Дизайн-система «Скинемся»

Это **единый источник истины** по визуальному языку приложения. Здесь собрано всё: палитра, токены, типографика, отступы, скругления, тени, стили всех базовых компонентов, анимации, скелетоны, экран загрузки и адаптивность. Любой новый экран или компонент должен опираться только на эти токены — никаких «магических» значений и хардкода цветов.

Технически дизайн-система реализуется через **vanilla-extract** (`src/shared/theme`). Все значения ниже — это контракт темы (`theme.css.ts`), к которому обращаются компоненты через `vars`.

> Правило №1: цвета, размеры, тени, тайминги анимаций берутся **только** из токенов. Если нужного токена нет — он добавляется в тему, а не пишется инлайном.

---

## 1. Философия визуала

Цель — премиальный, «финтех-серьёзный», но тёплый интерфейс, который **не выглядит как типовая ИИ-генерация**. Достигается за счёт:

- **Тёмного фона с зелёным подтоном** (не чистый серый, не чистый чёрный) — глубокий, «ламповый».
- **Фирменного зелёного в стиле Сбера** на акцентных элементах, с управляемым свечением (glow), а не плоской заливкой.
- **Крупных скруглений и мягких теней** — дружелюбная «капсульная» эстетика, привычная в Telegram.
- **Уникальной типографики** (Onest) и **duotone-иконок** (Phosphor) вместо дефолтных Inter + Lucide.
- **Плавных пружинных анимаций** на каждом взаимодействии.

Анти-паттерны (чего избегаем): Tailwind-классы в разметке, палитры `slate/zinc/gray-500`, синий `#3B82F6` как акцент, иконки Lucide/Heroicons по умолчанию, резкие линейные `transition: all 0.2s`.

---

## 2. Цветовая палитра

### 2.1 Базовые нейтрали (тёмный фон с зелёным подтоном)

| Токен | HEX | Назначение |
| --- | --- | --- |
| `color.bg.base` | `#0A0F0D` | Фон самого приложения (за всем контентом) |
| `color.bg.surface` | `#101714` | Карточки, листы, базовые поверхности |
| `color.bg.elevated` | `#16201C` | Приподнятые поверхности (модалки, поповеры, шапки) |
| `color.bg.inset` | `#0C120F` | Утопленные блоки (поля ввода, «колодцы») |
| `color.bg.overlay` | `rgba(6, 10, 8, 0.72)` | Затемнение под модалками/шторками |
| `color.border.subtle` | `#1E2A25` | Малозаметные разделители |
| `color.border.default` | `#28362F` | Бордеры карточек и полей |
| `color.border.strong` | `#36493F` | Акцентные/hover-бордеры |

### 2.2 Текст

| Токен | HEX | Назначение |
| --- | --- | --- |
| `color.text.primary` | `#EAF2EE` | Основной текст, заголовки |
| `color.text.secondary` | `#9DB3AA` | Вторичный текст, подписи |
| `color.text.muted` | `#6B8078` | Плейсхолдеры, отключённое |
| `color.text.inverse` | `#06120C` | Текст на зелёных (ярких) подложках |
| `color.text.link` | `#3BE07A` | Ссылки |

### 2.3 Фирменный зелёный (Сбер-направленный)

Шкала от светлого к тёмному. `primary` — основной бренд-цвет, близкий к зелёному Сбера `#21A038`.

| Токен | HEX | Назначение |
| --- | --- | --- |
| `color.green.50` | `#E8FBEE` | Тонкие подложки, бейджи |
| `color.green.100` | `#C6F4D5` | Подложки success |
| `color.green.200` | `#9CE9B5` | — |
| `color.green.300` | `#6BDA93` | Светлый акцент, иконки |
| `color.green.400` | `#3FCB74` | Hover-свечение |
| `color.green.500` | `#21A038` | **primary** (бренд, как у Сбера) |
| `color.green.600` | `#1B8A30` | Hover основной кнопки |
| `color.green.700` | `#16762A` | Active/нажатие |
| `color.green.800` | `#0F5A20` | Тёмные акценты |
| `color.green.900` | `#0A3D16` | Глубокие подложки |
| `color.accent` | `#2FD37A` | Яркий акцент/градиент/свечение |

### 2.4 Семантические цвета

| Токен | HEX | Назначение |
| --- | --- | --- |
| `color.success` | `#21A038` | Успех (совпадает с брендом) |
| `color.success.bg` | `#0F2417` | Подложка success |
| `color.warning` | `#E5A33B` | Предупреждение |
| `color.warning.bg` | `#2A2110` | Подложка warning |
| `color.danger` | `#E5484D` | Ошибка/удаление |
| `color.danger.bg` | `#2A1314` | Подложка danger |
| `color.info` | `#3B9BE5` | Инфо (используется редко, не как акцент) |
| `color.info.bg` | `#10202A` | Подложка info |

### 2.5 Семантические роли (interaction)

| Токен | Значение | Назначение |
| --- | --- | --- |
| `color.brand` | `green.500` | Основной интерактив |
| `color.brand.hover` | `green.600` | Наведение |
| `color.brand.active` | `green.700` | Нажатие |
| `color.focusRing` | `rgba(47, 211, 122, 0.45)` | Кольцо фокуса |
| `color.glow` | `rgba(33, 160, 56, 0.35)` | Свечение под кнопками/активными |

### 2.6 Градиенты

| Токен | Значение | Назначение |
| --- | --- | --- |
| `gradient.brand` | `linear-gradient(135deg, #21A038 0%, #2FD37A 100%)` | Кнопки-герои, бейджи баланса |
| `gradient.surface` | `linear-gradient(180deg, #16201C 0%, #101714 100%)` | Карточки-герои |
| `gradient.glowSpot` | `radial-gradient(circle at 50% 0%, rgba(47,211,122,0.18), transparent 70%)` | Свечение в шапке экрана |

### 2.7 Light theme

Базовая тема — **тёмная** (по требованию проекта). Light-тема не является приоритетом; при необходимости заводится второй контракт темы с теми же ключами. Цвет берётся из Telegram (`themeParams`) только для согласования системного фона, но палитра приложения остаётся собственной (см. [TELEGRAM_MINIAPP.md](TELEGRAM_MINIAPP.md), раздел про тему).

---

## 3. Типографика

### 3.1 Шрифты

- **Основной (UI):** `Onest` — вариативный, отличная кириллица, современный нейтральный характер, редко используется по умолчанию.
- **Display (опционально, для крупных чисел/балансов):** `Geologica` — выразительные цифры.
- **Моноширинный (суммы, коды):** `JetBrains Mono` или системный `ui-monospace`.

Подключение: self-hosted `.woff2` (вариативные) из `src/assets/fonts`, через `@font-face`. Не использовать Google Fonts по сети (скорость + приватность в Telegram).

```
fontFamily.sans:    'Onest', -apple-system, 'Segoe UI', Roboto, sans-serif
fontFamily.display: 'Geologica', 'Onest', sans-serif
fontFamily.mono:    'JetBrains Mono', ui-monospace, monospace
```

### 3.2 Шкала размеров (типографические токены)

| Токен | Размер / line-height | Вес | Назначение |
| --- | --- | --- | --- |
| `text.display` | 34 / 40 | 700 | Большой баланс, hero-число |
| `text.h1` | 28 / 34 | 700 | Заголовок экрана |
| `text.h2` | 22 / 28 | 600 | Заголовок секции |
| `text.h3` | 18 / 24 | 600 | Заголовок карточки |
| `text.bodyLg` | 17 / 24 | 400 | Крупный body (нативный TG размер) |
| `text.body` | 15 / 22 | 400 | Основной текст |
| `text.bodySm` | 13 / 18 | 400 | Подписи, вторичное |
| `text.caption` | 12 / 16 | 500 | Лейблы, бейджи |
| `text.button` | 16 / 20 | 600 | Текст кнопок |
| `text.mono` | 15 / 20 | 500 | Денежные суммы |

Правила:
- Заголовки — вес 600–700, `letter-spacing: -0.01em` для крупных.
- Денежные суммы — `font-feature-settings: "tnum"` (табличные цифры), моно-семейство.
- Базовый размер body 15–17px — комфортно для мобильных и совпадает с эстетикой Telegram.

---

## 4. Отступы, размеры, сетка

### 4.1 Spacing (база 4px)

| Токен | px |
| --- | --- |
| `space.0` | 0 |
| `space.1` | 2 |
| `space.2` | 4 |
| `space.3` | 8 |
| `space.4` | 12 |
| `space.5` | 16 |
| `space.6` | 20 |
| `space.7` | 24 |
| `space.8` | 32 |
| `space.9` | 40 |
| `space.10` | 48 |
| `space.12` | 64 |

Базовый внешний горизонтальный отступ контента экрана — `space.5` (16px), на широких экранах ограничиваем контейнер (см. §10).

### 4.2 Скругления (radius)

Капсульная, дружелюбная эстетика — скругления крупные.

| Токен | px | Назначение |
| --- | --- | --- |
| `radius.sm` | 8 | Бейджи, мелкие чипы |
| `radius.md` | 12 | Поля ввода, мелкие кнопки |
| `radius.lg` | 16 | Кнопки, карточки |
| `radius.xl` | 20 | Крупные карточки |
| `radius.2xl` | 28 | Модалки, листы, hero-блоки |
| `radius.full` | 9999 | Аватары, пилюли, FAB |

### 4.3 Размеры контролов

| Токен | px | Назначение |
| --- | --- | --- |
| `size.control.sm` | 36 | Маленькая кнопка/поле |
| `size.control.md` | 44 | Базовая высота (комфорт для тача) |
| `size.control.lg` | 52 | Главная кнопка экрана |
| `size.icon.sm` | 18 | Иконка в тексте |
| `size.icon.md` | 22 | Иконка в кнопке |
| `size.icon.lg` | 28 | Иконка-акцент |
| `size.avatar.sm` | 32 | — |
| `size.avatar.md` | 44 | — |
| `size.avatar.lg` | 64 | — |

Минимальная тач-цель — **44×44px**.

### 4.4 z-index

| Токен | Значение |
| --- | --- |
| `z.base` | 0 |
| `z.sticky` | 100 |
| `z.header` | 200 |
| `z.dropdown` | 300 |
| `z.overlay` | 400 |
| `z.modal` | 500 |
| `z.toast` | 600 |

---

## 5. Тени и свечение (elevation)

Тени мягкие, с зелёным подтоном для бренд-элементов.

| Токен | Значение |
| --- | --- |
| `shadow.sm` | `0 1px 2px rgba(0,0,0,0.4)` |
| `shadow.md` | `0 4px 16px rgba(0,0,0,0.45)` |
| `shadow.lg` | `0 12px 32px rgba(0,0,0,0.55)` |
| `shadow.glow` | `0 8px 24px rgba(33,160,56,0.35)` |
| `shadow.glowSoft` | `0 4px 18px rgba(47,211,122,0.22)` |
| `shadow.inset` | `inset 0 1px 0 rgba(255,255,255,0.04)` |

Правило: «приподнятость» = тень + чуть более светлая поверхность (`bg.elevated`). Бренд-кнопки дополнительно получают `shadow.glow`.

---

## 6. Кнопки

Базовый компонент `Button` (`src/shared/ui/Button`). Построен на доступном `<button>` с состояниями hover / active / focus-visible / disabled / loading и анимацией нажатия (scale 0.97).

### 6.1 Варианты (variant)

| Variant | Фон | Текст | Бордер | Назначение |
| --- | --- | --- | --- | --- |
| `primary` | `gradient.brand` + `shadow.glow` | `text.inverse` | нет | Главное действие экрана |
| `secondary` | `bg.elevated` | `text.primary` | `border.default` | Вторичное действие |
| `ghost` | прозрачный | `text.primary` | нет | Третичное, в плотных списках |
| `tonal` | `green.900` | `green.300` | нет | Мягкий акцент (фильтры, чипы) |
| `danger` | `danger.bg` | `danger` | `danger` (1px) | Деструктивное действие |
| `link` | нет | `text.link` | нет | Инлайн-ссылка |

### 6.2 Размеры (size)

| Size | Высота | Padding (h) | Текст | Радиус |
| --- | --- | --- | --- | --- |
| `sm` | `control.sm` (36) | `space.5` (16) | `bodySm` | `radius.md` |
| `md` | `control.md` (44) | `space.6` (20) | `button` | `radius.lg` |
| `lg` | `control.lg` (52) | `space.7` (24) | `button` | `radius.lg` |

Модификаторы: `fullWidth` (на всю ширину — стандарт для главного CTA внизу экрана), `iconOnly` (квадрат, `radius.full` для круглых), `iconLeft` / `iconRight`.

### 6.3 Состояния

- **hover** (только на устройствах с указателем): primary → фон `green.600`, усиление `shadow.glow`.
- **active / press**: `scale(0.97)`, фон `green.700`; тактильный отклик `impactOccurred('light')` (Telegram haptics).
- **focus-visible**: кольцо `0 0 0 3px color.focusRing`.
- **disabled**: `opacity 0.45`, без теней, `cursor: not-allowed`, без haptics.
- **loading**: содержимое заменяется на `Spinner`, ширина фиксируется, клики блокируются.

### 6.4 Пример (vanilla-extract recipe)

```ts
// src/shared/ui/Button/Button.css.ts
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@/shared/theme';

export const button = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: vars.space[3],
    fontFamily: vars.font.sans,
    fontWeight: 600,
    borderRadius: vars.radius.lg,
    transition: `transform ${vars.motion.duration.fast} ${vars.motion.ease.spring}, background ${vars.motion.duration.base} ${vars.motion.ease.standard}`,
    selectors: {
      '&:active:not(:disabled)': { transform: 'scale(0.97)' },
      '&:focus-visible': { boxShadow: `0 0 0 3px ${vars.color.focusRing}` },
      '&:disabled': { opacity: 0.45, cursor: 'not-allowed' },
    },
  },
  variants: {
    variant: {
      primary: {
        backgroundImage: vars.gradient.brand,
        color: vars.color.text.inverse,
        boxShadow: vars.shadow.glow,
      },
      secondary: {
        background: vars.color.bg.elevated,
        color: vars.color.text.primary,
        border: `1px solid ${vars.color.border.default}`,
      },
      ghost: { background: 'transparent', color: vars.color.text.primary },
    },
    size: {
      sm: { height: vars.size.control.sm, paddingInline: vars.space[5] },
      md: { height: vars.size.control.md, paddingInline: vars.space[6] },
      lg: { height: vars.size.control.lg, paddingInline: vars.space[7] },
    },
    fullWidth: { true: { width: '100%' } },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});
```

---

## 7. Поля ввода и формы

Компоненты: `Input`, `Textarea`, `Select`, `Switch`, `Checkbox`, `Radio`, `FieldGroup` (лейбл + поле + ошибка). Селекты/свитчи/чекбоксы строятся на **Ark UI** для доступности, стилизуются токенами.

| Свойство | Значение |
| --- | --- |
| Высота | `control.md` (44) |
| Фон | `bg.inset` |
| Бордер | `border.default`, при фокусе → `border.strong` + `focusRing` |
| Радиус | `radius.md` |
| Текст / плейсхолдер | `text.primary` / `text.muted` |
| Ошибка | бордер `danger`, текст ошибки `bodySm` цветом `danger` под полем |
| Иконка-префикс/суффикс | `size.icon.md`, цвет `text.secondary` |

Состояния: `default / focus / filled / error / disabled / readonly`. Поля с денежным вводом используют моно-шрифт и табличные цифры.

`Switch` — пилюля `radius.full`: выключен `border.default` фон `bg.elevated`, включён — `gradient.brand` с `shadow.glowSoft`, кружок-ползунок с пружинной анимацией.

---

## 8. Поверхности и контейнеры

### 8.1 Card

| Свойство | Значение |
| --- | --- |
| Фон | `bg.surface` (или `gradient.surface` для hero) |
| Бордер | `border.subtle` (1px) |
| Радиус | `radius.xl` |
| Padding | `space.6` (20) |
| Тень | `shadow.md` для приподнятых |

Подвиды: `Card` (базовая), `StatCard` (число + подпись + иконка), `ListItem` (строка списка с лево/право-слотами), `HeroCard` (баланс с градиентом и `gradient.glowSpot`).

### 8.2 Списки

`List` + `ListItem`: слоты `leading` (аватар/иконка), `title`, `subtitle`, `trailing` (сумма/шеврон). Разделители `border.subtle`. Нажимаемые строки получают press-анимацию и haptics.

### 8.3 Модалки / нижние шторки (Sheet)

В Telegram Mini App предпочтительны **bottom sheets** (нативно для мобильных).

| Свойство | Значение |
| --- | --- |
| Подложка | `bg.overlay` + blur 8px, fade-in |
| Контейнер | `bg.elevated`, `radius.2xl` (верхние углы), `shadow.lg` |
| Анимация | slide-up + пружина (см. §11) |
| Жесты | свайп вниз для закрытия, «ручка» (grabber) сверху |

`Modal` (центрированная) — для критичных подтверждений; `Sheet` (снизу) — для форм и выбора.

### 8.4 Прочее

- `Toast` — всплывает сверху/снизу, `bg.elevated`, цветной левый акцент по типу (success/warning/danger), авто-скрытие.
- `Badge` / `Chip` — `radius.full`, `caption`, цветные тональные варианты (`green.900`/`green.300` и т.п.).
- `Avatar` — `radius.full`, фолбэк-инициалы на тональном фоне, поддержка фото из Telegram.
- `EmptyState` — иллюстрация/иконка + заголовок + подпись + CTA.
- `Divider` — `border.subtle`.
- `Tabs` / `SegmentedControl` — на Ark UI, индикатор с пружинным `layout`-переходом (Motion).

---

## 9. Иконография

- **Библиотека:** `@phosphor-icons/react`, основной вес — **duotone** (двутоновые, фирменный почерк). Допускается `regular` для нейтральных мест.
- Цвет основной части — `text.secondary`/`text.primary`, вторичного тона — `green.500`/`accent` для акцентных иконок.
- Размеры — из `size.icon.*`.
- Иконки навигации/действий обёрнуты в собственный `Icon`-адаптер, чтобы единообразно прокидывать размер/вес/цвет из токенов и при необходимости заменить набор в одном месте.
- **Не использовать** Lucide / Heroicons / Material Icons по умолчанию — это узнаваемый «ИИ-дефолт».

Эмодзи — только как контент (например, реакции), не как UI-иконки.

---

## 10. Адаптивность

Приложение — мобильный Mini App, но обязана корректно работать на любых разрешениях (узкие телефоны, планшеты, десктоп-клиент Telegram).

### 10.1 Брейкпоинты

| Токен | min-width | Назначение |
| --- | --- | --- |
| `bp.xs` | 0 | Узкие телефоны (320–359) |
| `bp.sm` | 360 | Базовый телефон |
| `bp.md` | 480 | Крупные телефоны |
| `bp.lg` | 768 | Планшеты / десктоп-Telegram |
| `bp.xl` | 1024 | Широкий десктоп |

### 10.2 Правила

- **Контейнер контента** центрируется и ограничивается `max-width: 560px` на `lg+`, чтобы на десктопе не «растягивалось» — выглядит как аккуратное мобильное окно по центру.
- Базовая вёрстка — **flex/grid с относительными единицами**; фиксированные px только для бордеров/иконок.
- Главный CTA закреплён внизу (`position: sticky/fixed`) с учётом safe-area.
- Текст не обрезается жёстко: длинные имена/суммы — `min-width: 0` + `text-overflow: ellipsis`.
- Тестовые контрольные ширины: **320, 360, 390, 414, 768, 1024**.

### 10.3 Safe-area (Telegram + iOS)

Учитываем системные отступы и переменные Telegram viewport:

```css
padding-top: max(env(safe-area-inset-top), var(--tg-safe-area-top, 0px));
padding-bottom: max(env(safe-area-inset-bottom), var(--tg-safe-area-bottom, 0px));
```

Высота вьюпорта — через переменные Telegram (`viewportStableHeight`), не `100vh`. Подробности — в [TELEGRAM_MINIAPP.md](TELEGRAM_MINIAPP.md).

---

## 11. Анимации

Анимации — плавные, пружинные, осмысленные (подкрепляют действие, а не отвлекают). Реализация — **Motion** (`motion/react`); простые transition — через токены в CSS.

### 11.1 Тайминги и easing (токены)

| Токен | Значение |
| --- | --- |
| `motion.duration.fast` | 150ms |
| `motion.duration.base` | 220ms |
| `motion.duration.slow` | 360ms |
| `motion.ease.standard` | `cubic-bezier(0.22, 1, 0.36, 1)` (easeOutExpo-подобный) |
| `motion.ease.in` | `cubic-bezier(0.4, 0, 1, 1)` |
| `motion.ease.spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` (лёгкий overshoot) |

### 11.2 Пружинные пресеты (Motion)

```ts
// src/shared/lib/motion.ts
export const spring = {
  soft:   { type: 'spring', stiffness: 260, damping: 30, mass: 0.9 },
  snappy: { type: 'spring', stiffness: 420, damping: 32 },
  bouncy: { type: 'spring', stiffness: 500, damping: 24 },
} as const;

export const fadeInUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: 8 },
  transition: spring.soft,
};
```

### 11.3 Где какие анимации

| Сценарий | Анимация |
| --- | --- |
| Нажатие кнопки/строки | `scale(0.97)`, `spring.snappy` + haptic |
| Появление экрана/секции | `fadeInUp`, `spring.soft` |
| Список элементов | stagger по 30–50ms, `fadeInUp` |
| Bottom sheet | slide-up `spring.soft`, подложка fade |
| Переключатели/табы | `layout`-анимация индикатора, `spring.snappy` |
| Числа/баланс | плавный count-up при изменении |
| Переход между роутами | cross-fade + лёгкий сдвиг, `motion.duration.base` |

### 11.4 Доступность

Уважаем `prefers-reduced-motion`: при включённом — отключаем смещения/overshoot, оставляем мгновенные/fade переходы. Реализуется хелпером, который подменяет пресеты на «reduced».

---

## 12. Скелетоны загрузки

**Каждый** экран и крупный блок при загрузке данных показывает скелетон (а не спиннер по центру). Скелетон повторяет реальную раскладку контента.

- Компонент `Skeleton` (`src/shared/ui/Skeleton`) + готовые композиции под экраны (`ProfileSkeleton`, `ListSkeleton` и т.п.).
- Фон — `bg.elevated`, поверх — анимированный **shimmer** (бегущий блик).
- Радиусы скелетонов совпадают с радиусами реальных элементов.
- Длительность shimmer — ~1.2s, бесконечно; уважает `prefers-reduced-motion` (тогда мягкое pulse-затухание вместо бегущего блика).

```ts
// src/shared/ui/Skeleton/Skeleton.css.ts (фрагмент)
import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/shared/theme';

const shimmer = keyframes({
  '0%':   { backgroundPosition: '-200% 0' },
  '100%': { backgroundPosition: '200% 0' },
});

export const skeleton = style({
  borderRadius: vars.radius.md,
  background: `linear-gradient(90deg, ${vars.color.bg.elevated} 25%, ${vars.color.border.default} 37%, ${vars.color.bg.elevated} 63%)`,
  backgroundSize: '200% 100%',
  animation: `${shimmer} 1.2s ease-in-out infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none', opacity: 0.6 },
  },
});
```

Паттерн использования с TanStack Query: `isLoading → <XSkeleton/>`, `isError → <ErrorState/>`, `data → <Content/>` (см. [API.md](API.md)).

---

## 13. Экран загрузки приложения (Splash)

При старте Mini App (инициализация SDK, проверка/обновление токенов, первый запрос профиля) показывается **анимированная заставка** по теме проекта.

- **Технология:** **Rive** (`@rive-app/react-canvas`) — лёгкая, векторная, плавная, редко встречается у конкурентов. Fallback — Lottie (`lottie-react`), если для сцены проще.
- **Сюжет анимации:** тематика «скидываемся» — монеты падают в общий котёл/копилку и складываются в зелёный логотип; либо аватары участников сходятся в круг и в центре загорается сумма. Палитра — фирменный зелёный на тёмном фоне.
- Под анимацией — название/логотип и тонкий прогресс/пульс.
- Минимальное время показа — ~600–900ms (чтобы не «мигало»), затем плавный cross-fade в контент.
- Файлы анимаций — в `src/assets/rive` (`.riv`) / `src/assets/lottie` (`.json`).

Заставка — это отдельный компонент `AppSplash` (`src/app`), управляется состоянием инициализации приложения.

---

## 14. Чек-лист соответствия дизайн-системе

Перед мерджем любого UI убедись, что:

- [ ] Нет хардкод-цветов/размеров — всё через `vars` (токены).
- [ ] Использованы компоненты из `src/shared/ui`, а не «одноразовая» вёрстка.
- [ ] Нет Tailwind и дефолтных палитр/иконок (Lucide/Heroicons).
- [ ] Кнопки/строки имеют press-анимацию и (где уместно) haptics.
- [ ] У экрана есть скелетон загрузки и состояние ошибки/пустоты.
- [ ] Учтены safe-area и адаптивность (проверено на 320 и 768px).
- [ ] Анимации используют пресеты и уважают `prefers-reduced-motion`.
- [ ] Тач-цели ≥ 44px.
