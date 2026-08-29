# AgentLee UI

A React chat UI that connects to your AI backend, with support for rich responses including candlestick charts and backtest results.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- Your backend API running on port **8800**

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure the API URL**

   The app proxies API calls to `http://localhost:8800` by default. If your backend runs on a different port, update the proxy targets in `vite.config.ts`:

   ```ts
   proxy: {
     '/login':    'http://localhost:8800',
     '/whatnext': 'http://localhost:8800',
   }
   ```

## Running the app

```bash
npm run dev
```

Then open your browser at:

**http://localhost:5173**

## API endpoints expected

| Method | Endpoint    | Request body             | Response                 |
|--------|-------------|--------------------------|--------------------------|
| POST   | `/login`    | `{ username, password }` | `{ threadId }`           |
| POST   | `/whatnext` | `{ threadId, message }`  | See response types below |

### Response types

The `/whatnext` endpoint can return different response shapes, each rendered differently in the UI:

- **`Candlebar data`** — renders an interactive candlestick chart
- **`BackTestResults`** — renders a summary stats panel, candlestick chart with buy/sell arrows, and a trades table
- **Plain text** — rendered as a standard chat message

## Building for production

```bash
npm run build
```

Output is placed in the `dist/` folder. Serve it with any static file host.
