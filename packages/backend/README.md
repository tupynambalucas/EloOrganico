# @elo-organico/backend

High-performance REST API powered by **Fastify** and **MongoDB**. It serves as the core logic handler for the Elo Orgânico platform, managing authentication, product cycles, and orders.

## ⚙️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Fastify v5
* **Database:** MongoDB (via Mongoose)
* **Validation:** Zod (via `fastify-type-provider-zod`)
* **Authentication:** JWT + Secure HTTP-Only Cookies/Session
* **Language:** TypeScript (Strict Mode)

## 📂 Project Structure

```text
src/
├── config/       # Environment variables and server configuration
├── models/       # Mongoose Schemas (Database Layer)
├── modules/      # Feature-based modules (Controller, Routes, Schemas)
│   ├── admin/    # Administrative features (Cycle management)
│   └── auth/     # Authentication logic
├── plugins/      # Fastify plugins (Cors, DB connection, Session)
└── server.ts     # Entry point
````

## 🛡️ Validation & Type Safety

This backend leverages the **Single Source of Truth** pattern. We do not manually define interfaces or JSON schemas for DTOs. Instead, we import Zod schemas directly from `@elo-organico/shared`.

**Example:**

```typescript
import { CreateCycleDTOSchema } from '@elo-organico/shared';

// Fastify automatically validates the body against the Zod schema
app.post('/cycle', { schema: { body: CreateCycleDTOSchema } }, handler);
```

## 🔧 Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the server with hot-reload (`ts-node-dev`). |
| `npm run build` | Cleans `dist`, compiles TS using `tsconfig.build.json`. |
| `npm start` | Runs the compiled code from `dist/server.js`. |
| `npm run clean` | Removes build artifacts. |

## 📦 Build for Production

To prevent path resolution issues with the monorepo structure in production, this package uses a specific `tsconfig.build.json` that isolates the source code during compilation.

-----

**Author:** Tupynambá Lucas Varela Rodrigues ([tupynambalucas.dev](https://www.google.com/search?q=https://tupynambalucas.dev))
