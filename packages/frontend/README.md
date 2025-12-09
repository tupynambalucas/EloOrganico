# @elo-organico/frontend

The client-side application for Elo Orgânico. A modern SPA (Single Page Application) built for speed, interactivity, and responsiveness.

## 🎨 Tech Stack

* **Framework:** React 19
* **Bundler:** Vite
* **State Management:** Zustand
* **Styling:** CSS Modules
* **Language:** TypeScript

## 🧩 Features

* **Admin Panel:** Cycle management, product list parsing, and reporting.
* **Shop Interface:** Dynamic catalog based on the active cycle.
* **Smart Parsing:** Client-side regex parsing for bulk product ingestion.
* **Auth System:** Secure integration with backend HTTP-only sessions.

## 🚀 Development

This package is configured to proxy API requests to `http://localhost:3000` during development to avoid CORS issues.

```bash
# Start dev server (Port 5173)
npm run dev
````

## 🏗️ Build & Deployment

The build process enforces type safety before bundling.

```bash
# 1. Type Check -> 2. Build with Vite
npm run build
```

The output (`dist/`) is designed to be served by **Nginx** (see `nginx.conf` in root), handling client-side routing via `try_files`.

## 📦 Dependency Optimization

To ensure seamless integration with the monorepo, `vite.config.ts` is configured to exclude `@elo-organico/shared` from pre-bundling, ensuring hot updates from the shared library are reflected instantly.

-----

**Author:** Tupynambá Lucas Varela Rodrigues ([tupynambalucas.dev](https://www.google.com/search?q=https://tupynambalucas.dev))
