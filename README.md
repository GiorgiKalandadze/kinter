# Qinter

A flashcard web app for reviewing technical interview questions. Browse categories, flip through Q&A cards, filter by tags, and shuffle your deck.

## Features

- **8 question categories:** Algorithms, Cloud & DevOps, JavaScript, MongoDB, Node.js, OS, PostgreSQL, System Design
- **Tag filtering** — narrow cards to specific subtopics within a category
- **Shuffle** — randomize card order for spaced repetition
- **Dual data source** — run with local JSON files or a MongoDB database
- **Keyboard navigation** — `←`/`→`, `Space`, `D`, `S`
- **Docker-ready** — single image, no external dependencies in JSON mode

## Quick Start

**Requirements:** Node.js 18+

```bash
cd server
npm install
node server.js
```

Open [http://localhost:3000](http://localhost:3000).

### Development (auto-reload)

```bash
cd server
npm run dev
```

## Configuration

Copy the variables below into a `.env` file inside `server/`:

```env
PORT=3000
DATA_SOURCE=json        # or "mongo"
MONGO_URI=              # required only when DATA_SOURCE=mongo
```

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | HTTP listen port |
| `DATA_SOURCE` | json mode | Set to `mongo` to use MongoDB |
| `MONGO_URI` | — | MongoDB connection string |

## Docker

```bash
# Build from repo root
docker build -t qinter .

# Run (JSON mode — no external dependencies)
docker run -p 3000:3000 qinter

# Run with MongoDB
docker run -p 3000:3000 \
  -e DATA_SOURCE=mongo \
  -e MONGO_URI=mongodb://host:27017/qinter \
  qinter
```

## API

```
GET /api/questions/categories          → [{ name, count }]
GET /api/questions?category=<name>     → [{ topic, shortDescription, longDescription, tags }]
```

## Project Structure

```
kinter/
├── Dockerfile
├── docs/
│   └── data/               # JSON question files
└── server/
    ├── server.js            # Entry point
    └── src/
        ├── models/          # Mongoose schema
        ├── modules/questions/  # Routes + controller
        └── sources/         # json.js and mongo.js data providers
```

## Adding Questions

Add objects to any file in `docs/data/` (or create a new `.json` file):

```json
[
  {
    "topic": "Your question title",
    "shortDescription": "One-line answer",
    "longDescription": "Extended explanation",
    "mainCategory": "Node.js",
    "tags": ["tag1", "tag2"],
    "references": ["https://docs.example.com"]
  }
]
```

`mainCategory` must exactly match an existing category name, or it will create a new one automatically.

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `←` / `→` | Previous / Next card |
| `Space` | Reveal answer |
| `D` | Toggle detail view |
| `S` | Shuffle deck |
