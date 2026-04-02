# Demo app

This repo pairs a React UI in `plaid-frontend` with the Plaid **quickstart** Node backend in `quickstart/node`. Run **both** processes locally: the backend exposes the Plaid API on port **8000**, and the dev server on port **3000** proxies `/api` (and related routes) to that backend.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended) and npm
- Plaid API keys from the [Plaid Dashboard](https://dashboard.plaid.com/developers/keys) (`PLAID_CLIENT_ID`, `PLAID_SECRET`)

## 1. Configure the backend environment

Copy the example env file and add the keys.

1. Copy `quickstart/.env.example` to **`quickstart/node/.env`** (this path matters: `npm start` runs with the working directory `quickstart/node`, and the server loads `.env` from there).
2. Set at least `PLAID_CLIENT_ID` and `PLAID_SECRET`. Use `quickstart/.env.example` for other variables if needed.

## 2. Start the backend (terminal 1)

```bash
cd quickstart/node
npm install
npm start
```

The API listens on **http://localhost:8000** by default (override with `APP_PORT` in `.env` if you change it).

## 3. Start the frontend (terminal 2)

```bash
cd plaid-frontend
npm install
npm start
```

The app opens at **http://localhost:3000**. If the backend is not on `http://127.0.0.1:8000`, set `REACT_APP_API_HOST` in `plaid-frontend` (for example in a `.env.local` file) to match your backend URL.

## Quick check

With the backend running, you should not see the warning about failing to reach `localhost:8000` on the connect screen. If you do, confirm terminal 1 is still running and that `quickstart/node/.env` has valid Plaid credentials.

## More detail

The Plaid quickstart (other languages, Docker, OAuth notes) is documented in [quickstart/README.md](quickstart/README.md).

