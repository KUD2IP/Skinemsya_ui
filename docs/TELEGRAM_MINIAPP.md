# Telegram Mini App: интеграция

Приложение работает **внутри Telegram** как Mini App (запускается в WebView клиента Telegram). Здесь — правила интеграции с платформой: SDK, тема, viewport и safe-area, кнопки, haptics, хранилище, а также адаптивность под все клиенты.

SDK: **`@telegram-apps/sdk-react`** (актуальный официальный SDK). Не используем `@telegram-apps/telegram-ui` — UI у нас собственный (см. [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)).

---

## 1. Инициализация

Инициализация SDK происходит один раз в `src/app` до рендера контента и оборачивает приложение провайдером.

```ts
// app/providers/telegram.ts (схема)
import { init, miniApp, viewport, themeParams, backButton } from '@telegram-apps/sdk-react';

export function initTelegram() {
  init();                 // монтирование событий/окружения
  miniApp.mount();
  themeParams.mount();
  viewport.mount();       // даёт CSS-переменные высоты/insets
  backButton.mount();

  miniApp.ready();        // сообщаем Telegram, что готовы к показу
  viewport.expand();      // разворачиваем на всю высоту
  viewport.bindCssVars(); // --tg-viewport-* в :root
  themeParams.bindCssVars();
}
```

Порядок старта приложения:
1. `initTelegram()` — поднять SDK, привязать CSS-переменные.
2. Показать `AppSplash` (анимация Rive) пока идёт инициализация.
3. Авторизация через `initData` → токены → запрос профиля (см. [API.md](API.md)).
4. Cross-fade splash → основной интерфейс.

---

## 2. Авторизация через initData

`initData` — подписанная строка от Telegram, которую бэкенд валидирует по HMAC. Берём её из SDK и отправляем на `POST /api/v1/auth/telegram`.

```ts
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';

const { initDataRaw } = retrieveLaunchParams();
// initDataRaw — это та самая строка для тела запроса { initData: initDataRaw }
```

Детали флоу токенов, рефреша и обработки `401` — в [API.md](API.md).

---

## 3. Тема и палитра

Telegram передаёт параметры темы (`themeParams`) и схему (light/dark). Наша палитра — **собственная тёмная** (см. дизайн-систему), мы не подменяем её на цвета Telegram. Из платформы берём только:

- **Цвет хедера и фон Mini App** — синхронизируем с фоном приложения, чтобы не было «шва»:

```ts
import { miniApp } from '@telegram-apps/sdk-react';
miniApp.setHeaderColor('#0A0F0D');     // color.bg.base
miniApp.setBackgroundColor('#0A0F0D');
```

- CSS-переменные `--tg-theme-*` доступны, но используются по минимуму (например, для согласования системных элементов). Бренд-палитра всегда из токенов `shared/theme`.

> Приложение всегда выглядит в тёмной фирменной теме независимо от системной схемы пользователя — это часть айдентики.

---

## 4. Viewport, высота и safe-area

В WebView нельзя полагаться на `100vh`. Используем переменные Telegram + `env(safe-area-inset-*)`.

```css
:root {
  --app-height: var(--tg-viewport-stable-height, 100dvh);
}

.app-root {
  min-height: var(--app-height);
  padding-top: max(env(safe-area-inset-top), var(--tg-safe-area-inset-top, 0px));
  padding-bottom: max(env(safe-area-inset-bottom), var(--tg-safe-area-inset-bottom, 0px));
}
```

- Закреплённый внизу CTA — с учётом нижнего safe-area.
- Контент скроллится внутри стабильной высоты, чтобы клавиатура/панели Telegram не «прыгали».
- На разворачивании/сворачивании окна (`viewport.expand`) лэйаут не должен ломаться.

---

## 5. Системные кнопки

### BackButton
Управляем нативной кнопкой «назад» из роутинга: показываем на вложенных экранах, скрываем на корневом.

```ts
import { backButton } from '@telegram-apps/sdk-react';
backButton.show();
const off = backButton.onClick(() => router.history.back());
// при размонтировании: off(); backButton.hide();
```

### MainButton / SecondaryButton
Для основного действия экрана можно использовать нативную `MainButton` (например, «Сохранить» в форме профиля). Решение принимается по экрану: либо нативная MainButton, либо наш закреплённый `Button` (`fullWidth`) — но **не оба** одновременно для одного действия. Тексты и состояние loading синхронизируем с состоянием формы/мутации.

---

## 6. Haptics (тактильный отклик)

Подключаем тактильную отдачу к ключевым взаимодействиям — это усиливает «нативность». Оборачиваем в хелпер `shared/lib/haptics.ts`, чтобы безопасно работать вне Telegram (no-op).

```ts
import { hapticFeedback } from '@telegram-apps/sdk-react';

export const haptics = {
  tap:    () => hapticFeedback.impactOccurred('light'),
  press:  () => hapticFeedback.impactOccurred('medium'),
  success:() => hapticFeedback.notificationOccurred('success'),
  error:  () => hapticFeedback.notificationOccurred('error'),
  select: () => hapticFeedback.selectionChanged(),
};
```

Где применять: нажатие кнопок (`tap`), отправка формы (`success`/`error`), переключение табов/свитчей (`select`).

---

## 7. CloudStorage

Telegram даёт привязанное к пользователю облачное key-value хранилище. Используем для переживания перезапуска (например, кеш `refreshToken`, UI-настройки). Чувствительные access-токены — только в памяти.

```ts
import { cloudStorage } from '@telegram-apps/sdk-react';
await cloudStorage.setItem('refreshToken', token);
const token = await cloudStorage.getItem('refreshToken');
```

---

## 8. Адаптивность под все клиенты

Mini App открывается в разных клиентах: мобильный iOS/Android, Telegram Desktop, веб. Требование — корректная работа на **всех** разрешениях.

- Базовая вёрстка мобильная; на широких экранах контент центрируется и ограничивается `max-width` (см. [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md), §10) — на десктопе выглядит как аккуратное мобильное окно.
- Проверять на ширинах **320 / 360 / 390 / 414 / 768 / 1024**.
- Учитывать наличие/отсутствие safe-area (iOS с «чёлкой» vs Desktop).
- Не привязываться к конкретной платформе для логики UI; определять возможности через SDK (`isVersionAtLeast`, поддержка фичей) и деградировать мягко.
- Жесты (свайп-вниз для закрытия Sheet) дублировать кнопкой/областью закрытия для десктопа.

---

## 9. Локальная разработка вне Telegram

Вне Telegram `initData` недоступен. Для разработки:
- Использовать тестовое окружение Telegram / отладку Mini App через бота, либо мок launch-параметров средствами SDK (`mockTelegramEnv`) только в dev-сборке.
- Хелперы (`haptics`, `cloudStorage`) должны безопасно вырождаться в no-op/локальный фолбэк, чтобы приложение поднималось в обычном браузере для вёрстки.

> Не коммитить тестовые токены и мок-`initData` в репозиторий.
