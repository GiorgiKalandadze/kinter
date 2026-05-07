# CLAUDE.md — Qinter Project Guide

## What This Project Is

**Qinter** is a flashcard-style interview prep web app. Users browse topic categories, then flip through Q&A cards. The backend is Express (Node.js); the frontend is a single-file vanilla-JS SPA served from `server/public/index.html`.

---

## Repository Layout

```
kinter/
├── Dockerfile               # Production image (node:20-alpine, port 3000)
├── docs/
│   └── data/                # JSON question files (the actual content)
│       ├── 101 - Algorithms.json
│       ├── 101 - Cloud and Devops.json
│       ├── 101 - JS.json
│       ├── 101 - Mongo.json
│       ├── 101 - Node.json
│       ├── 101 - OS.json
│       ├── 101 - PostgreSQL.json
│       └── 101 - System Design.json
├── k8s/                     # Empty — Kubernetes manifests not yet written
└── server/
    ├── package.json         # name: "qinter", entry: server.js
    ├── server.js            # App entry point
    └── src/
        ├── models/
        │   └── Question.js  # Mongoose schema
        ├── modules/
        │   └── questions/
        │       ├── routes.js      # GET /api/questions, GET /api/questions/categories
        │       └── controller.js  # Delegates to active data source
        └── sources/
            ├── json.js      # Default: reads docs/data/*.json, in-memory cache
            └── mongo.js     # Optional: MongoDB via Mongoose aggregation
```

**Important path detail:** The Dockerfile copies `docs/` into `/app`, then `server/` into `/app`. So at runtime inside the container, `docs/data/` lands at `/app/data/` — which is exactly what `json.js` resolves (`../../data` from `server/src/sources/`).

---

## Data Source Abstraction

The app switches data sources via the `DATA_SOURCE` env var:

| `DATA_SOURCE` | Module used | When to use |
|---|---|---|
| (unset / anything else) | `sources/json.js` | Local dev, Docker default |
| `mongo` | `sources/mongo.js` | Production with MongoDB |

Both sources expose the same two functions:
- `getCategories()` → `[{ name: string, count: number }]`
- `getQuestions(category?)` → `[{ topic, shortDescription, longDescription, tags }]`

Controller (`modules/questions/controller.js`) picks the right source at require-time.

---

## Environment Variables

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `PORT` | No | `3000` | HTTP listen port |
| `DATA_SOURCE` | No | json mode | Set to `mongo` to use MongoDB |
| `MONGO_URI` | If `DATA_SOURCE=mongo` | — | MongoDB connection string |

---

## API Endpoints

```
GET /api/questions/categories        → [{ name, count }]
GET /api/questions?category=<name>   → [{ topic, shortDescription, longDescription, tags }]
GET *                                → server/public/index.html  (SPA fallback)
```

---

## Frontend

`server/public/index.html` is a self-contained SPA (~600 lines, no build step, no framework).

**State globals:** `allCards`, `filtered`, `index`, `activeTopics` (Set), `showDetail`, `cachedCategories`

**Screens:** Category grid → Card viewer

**Keyboard shortcuts:** `←`/`→` navigate, `Space` reveal answer, `D` toggle detail, `S` shuffle

**Styling:** Custom CSS variables (`--bg`, `--surface`, `--text`, `--accent`), fonts: Libre Baskerville + DM Mono

---

## Question Data Format

Each JSON file in `docs/data/` is an array of objects:

```json
{
  "topic": "What is Node.js",
  "shortDescription": "Brief answer...",
  "longDescription": "Detailed answer...",
  "mainCategory": "Node.js",
  "tags": ["V8", "libuv", "runtime"],
  "references": ["https://..."]
}
```

`mainCategory` is the key used for filtering. It must exactly match across all cards in the same category.

---

## Running Locally

```bash
cd server
npm install
node server.js          # JSON mode, port 3000

# MongoDB mode:
DATA_SOURCE=mongo MONGO_URI=mongodb://localhost:27017/qinter node server.js
```

Dev with auto-reload:
```bash
npm run dev   # uses nodemon
```

---

## Docker

```bash
# Build (run from repo root — Dockerfile expects docs/ and server/ as siblings)
docker build -t qinter .

# Run (JSON mode)
docker run -p 3000:3000 qinter

# Run (MongoDB mode)
docker run -p 3000:3000 -e DATA_SOURCE=mongo -e MONGO_URI=<uri> qinter
```

**Note:** `docker build` must be run from the repo root (where `Dockerfile` lives), not from inside `server/`. The COPY paths in the Dockerfile are relative to the build context.

---

## What Doesn't Exist Yet

- `docker-compose.yml` — would be useful for local MongoDB + app orchestration
- `k8s/` manifests — directory exists but is empty
- `.env.example` — no example env file for onboarding
- Tests — no test suite
- Auth / persistence — no user accounts, progress is not saved
