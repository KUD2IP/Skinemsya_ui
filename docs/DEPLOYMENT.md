# Деплой фронтенда на staging (GitHub Actions)

Пошаговая инструкция для деплоя Mini App на VPS `skinemsya-vse.ru` через **GitHub Actions**.

Backend деплоится **отдельно** из репозитория [Skinemsya](https://github.com/) (см. `docs/deployment/staging-server.md` в backend-репозитории).

---

## Что получится

| URL | Назначение |
| --- | --- |
| `https://skinemsya-vse.ru` | Mini App (статика из `dist/`) |
| `https://skinemsya-vse.ru/api/v1/...` | Backend API (прокси Caddy) |

Фронт **не требует** `VITE_API_BASE_URL` на staging: запросы идут на `/api/v1` того же домена (см. `src/shared/config/env.ts`).

---

## Предварительные требования

Перед деплоем фронта должен быть готов сервер и задеплоен backend:

1. VPS с Docker (Ubuntu 24.04)
2. DNS `skinemsya-vse.ru` → IP сервера
3. Backend workflow выполнен хотя бы раз (подняты Caddy, Postgres, backend)
4. Каталог `/opt/skinemsya/deploy/frontend/` существует на сервере

Подготовка сервера описана в backend-репозитории: `docs/deployment/staging-server.md` (части 1–3).

---

## Часть 1. SSH-ключ (если ещё не настроен)

Если backend уже деплоился — **тот же ключ** подойдёт для фронта.

**На своей машине:**

```bash
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/skinemsya_deploy -N ""
```

Публичный ключ на сервере (`/home/deploy/.ssh/authorized_keys`):

```bash
cat ~/.ssh/skinemsya_deploy.pub
# вставь на сервер под пользователем deploy
```

Проверка:

```bash
ssh -i ~/.ssh/skinemsya_deploy deploy@skinemsya-vse.ru
```

---

## Часть 2. GitHub Secrets

Репозиторий **skinemsya_ui** → **Settings → Secrets and variables → Actions → New repository secret**.

| Secret | Обязательный | Назначение |
| --- | --- | --- |
| `SSH_PRIVATE_KEY` | ✅ | Приватный ключ `skinemsya_deploy` (весь файл) |
| `STAGING_HOST` | ✅ | `skinemsya-vse.ru` или IP VPS |
| `STAGING_USER` | ✅ | `deploy` |
| `STAGING_SSH_PORT` | ❌ | `22` (если нестандартный) |
| `SSH_KNOWN_HOSTS` | ❌ | `ssh-keyscan -p 22 skinemsya-vse.ru` (если не задан — workflow сгенерирует) |

`STAGING_ENV` и другие секреты backend **фронту не нужны**.

### Environment `staging` (опционально)

**Settings → Environments → staging** — включи **Required reviewers**, если нужно подтверждение перед деплоем.

---

## Часть 3. Telegram BotFather

1. **Bot Settings → Domain** → `skinemsya-vse.ru`
2. **Menu Button / Web App** → `https://skinemsya-vse.ru`

---

## Часть 4. CI/CD pipeline

Workflow: [`.github/workflows/frontend.yml`](../.github/workflows/frontend.yml)

| Job | Когда запускается | Что делает |
| --- | --- | --- |
| `Typecheck` | Каждый push | `npm ci` + `npm run typecheck` |
| `Build` | Push в `main`/`master` | `npm run build` → artifact `dist/` |
| `Deploy to staging` | Вручную (Run workflow) | `rsync dist/` → `/opt/skinemsya/deploy/frontend/` |

Caddy отдаёт файлы из `deploy/frontend/` — **перезапуск контейнеров не нужен**.

---

## Часть 5. Первый деплой

### Порядок

1. **Сначала backend** — поднимет Caddy, API, БД
2. **Потом frontend** — положит статику в `deploy/frontend/`

### Шаги (фронт)

1. Push в **main** (или **master**)
2. Дождись зелёного workflow **Frontend CI/CD** (Typecheck + Build)
3. **Actions → Frontend CI/CD → Run workflow**:
   - ветка: `main`
   - ✅ **Deploy to staging after build**
4. Дождись job `Deploy to staging`

### Проверка

```bash
# На сервере
ls -la /opt/skinemsya/deploy/frontend/
curl -fsS https://skinemsya-vse.ru/
```

Открой бота в Telegram → Mini App.

---

## Часть 6. Обновления

| Действие | Автоматически (push) | Вручную |
| --- | --- | --- |
| Typecheck + Build | ✅ | — |
| Deploy на staging | — | Run workflow → Deploy to staging |

Backend и frontend деплоятся **независимо** — можно обновить только UI.

---

## Локальная разработка

```bash
npm ci
npm run dev
```

API в dev проксируется через Vite (`/api` → `http://localhost:8080`). См. `vite.config.ts`.

Сборка production (без деплоя):

```bash
npm run build
npm run preview
```

---

## Ручной деплой (если CI недоступен)

На машине с исходниками:

```bash
npm ci
npm run build
rsync -avz --delete -e "ssh -i ~/.ssh/skinemsya_deploy" dist/ deploy@skinemsya-vse.ru:/opt/skinemsya/deploy/frontend/
```

---

## Диагностика

| Симптом | Что проверить |
| --- | --- |
| `npm ci` падает в CI (emnapi / lock file) | Пересобери lock: `npx npm@10 install`, закоммить `package-lock.json` |
| Белый экран / 404 | `ls /opt/skinemsya/deploy/frontend/index.html` |
| API не отвечает | Backend задеплоен? `curl https://skinemsya-vse.ru/api/v1/...` |
| Mini App не открывается | Домен в BotFather, HTTPS (Caddy) |
| Deploy падает на SSH | `SSH_PRIVATE_KEY`, `authorized_keys` на сервере |
| Typecheck падает в CI | `npm run typecheck` локально |

---

## Связанные документы

- Backend staging: репозиторий Skinemsya → `docs/deployment/staging-server.md`
- API контракт: [API.md](API.md)
- Telegram Mini App: [TELEGRAM_MINIAPP.md](TELEGRAM_MINIAPP.md)
