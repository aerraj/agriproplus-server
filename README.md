# AgriPro+ Platform API

The Node/Express API for schemes, support requests, and the crop-intelligence
gateway. Version 2 is designed for serverless reuse: database connections are
cached, payload sizes are bounded, writes are protected, and external AI calls
have explicit timeouts.

## Run locally

```bash
cp .env.example .env
npm install
npm run dev
```

The API is available at `http://localhost:4000`; readiness is reported by
`GET /api/health`.

## Routes

- `POST /api/crops/recommend` — validated model gateway
- `GET /api/schemes` — searchable, paginated schemes
- `GET /api/schemes/:id` — one scheme
- `POST /api/schemes` — administrator-only scheme creation
- `POST /api/message/send` — validated support request

See `.env.example` for deployment configuration. Never commit the real MongoDB
URI or administrator key.
