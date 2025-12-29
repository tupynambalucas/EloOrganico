# Elo Orgânico - Project Context

## Project Overview
**Elo Orgânico** is an organic product trading platform designed to connect producers and consumers. The core business logic revolves around **scheduled sales cycles** ("ciclos de venda programados").

This project is a **monorepo** managed with **NPM Workspaces** and **Turbo**, containing a Fastify backend, a React frontend, and a shared library for contracts/types.

## Architecture & Tech Stack

### Workspace Structure
- **Root:** Orchestration, Docker configs, ESLint/Prettier configs.
- **`packages/shared`:**  Single Source of Truth (SSOT) for data contracts. Contains Zod schemas and TypeScript types shared between backend and frontend.
- **`packages/backend`:** API Server.
- **`packages/frontend`:** Web Client.

### Technology Stack
| Layer | Technologies |
| :--- | :--- |
| **Backend** | Fastify, Mongoose (MongoDB), Zod (Validation), BullMQ (Queues/Redis), Sentry (Monitoring), `sdk-node-apis-efi`. |
| **Frontend** | React 19, Vite, Zustand (State), TailwindCSS v4, GSAP (Animations), Axios, i18next (Internationalization). |
| **Database** | MongoDB (Replica Set enabled), Redis. |
| **Infra** | Docker Compose, Nginx. |

## Operational Guidelines

### 1. Environment Setup (Infrastructure)
The project requires a MongoDB Replica Set and Redis. Specialized scripts handle the complex setup (including keyfile generation for Mongo).

*   **Start Infrastructure:** `npm run infra:up`
    *   *Note:* This generates a `mongo-keyfile` if missing and starts `db` and `redis` containers.
*   **Stop Infrastructure:** `npm run infra:stop`
*   **Reset Data:** `npm run infra:reset` (Wipes volumes and restarts)

### 2. Development Workflow
To start the development environment:

1.  **Ensure Infra is running:** `npm run infra:up`
2.  **Start Full Stack:** `npm run dev:stack` (Runs backend and frontend concurrently)
    *   *Alternative (Backend only):* `npm run dev:backend`
    *   *Alternative (Frontend only):* `npm run dev:frontend`

### 3. Database Seeding
To populate the database with initial data (e.g., Admin user):
*   `npm run backend:seed`

### 4. Building & Quality
*   **Build All:** `npm run build:all`
*   **Lint:** `npm run lint` or `npm run lint:fix`
*   **Typecheck:** `npm run typecheck:all`

## Development Conventions

*   **Shared First:** When modifying data structures, **ALWAYS** start by updating `packages/shared`. Changes here propagate to both backend and frontend.
*   **Style Guide:** Adhere strictly to the guidelines in `.gemini/styleguide.md`.
*   **Language:** The codebase uses English for code (variables, functions) but Portuguese for domain terms (e.g., specific business logic strings) and i18n content (`pt-br`).
*   **State Management:** Use **Zustand** for global client state.
*   **Styling:** Use **TailwindCSS** (v4) and **CSS Modules** where appropriate.

## Key Directories
*   `packages/shared/src/schemas`: Zod schemas defining the data shape.
*   `packages/backend/src/domains`: Feature-based modular structure (Auth, Cycle, Product).
*   `packages/frontend/src/features`: Feature-based UI components and logic.
*   `packages/frontend/src/domains`: API integration layers corresponding to backend domains.

## Common Issues / Troubleshooting
*   **MongoDB Connection:** Ensure the Replica Set (`rs0`) is correctly initiated. The `infra:up` script's healthcheck attempts to auto-initiate it.
*   **Type Errors:** If `shared` is updated, you may need to restart the TypeScript server or run `npm run build:shared` to reflect changes in dependent packages.