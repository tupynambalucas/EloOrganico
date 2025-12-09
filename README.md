# Elo Orgânico - Monorepo

![License](https://img.shields.io/badge/license-CC--BY--NC--4.0-blue)
![Architecture](https://img.shields.io/badge/architecture-monorepo-orange)
![Maintainer](https://img.shields.io/badge/maintainer-tupynambalucas.dev-green)

**Elo Orgânico** is an enterprise-grade platform designed to manage organic product sharing cycles within eco-villages and communities. It streamlines the process of product cataloging, ordering, and logistics through a robust digital solution.

This repository is structured as a **Monorepo** using NPM Workspaces, ensuring a unified development lifecycle and strict type safety across the stack.

## 🏗 Architecture

The project follows a modular architecture:

* **`packages/backend`**: RESTful API built with **Fastify**, **MongoDB**, and **Zod**.
* **`packages/frontend`**: SPA built with **React 19**, **Vite**, and **Zustand**.
* **`packages/shared`**: Internal library containing the **Single Source of Truth** (Types, Zod Schemas, Constants) shared between backend and frontend.

## 🚀 Prerequisites

Ensure you have the following installed:

* **Node.js** (v20 LTS recommended)
* **NPM** (v10+)
* **Docker & Docker Compose** (for production builds)

## 🛠 Installation

Clone the repository and install dependencies from the root directory. The `postinstall` script will automatically build the shared package.

```bash
# Clone Repository
git clone https://github.com/tupynambalucas/EloOrganico.git

# Navigate to new created repository
cd EloOrganico  

# Install dependencies
npm install

#Open in VsCode
code .
````

## 💻 Development Workflow

We use **concurrently** to run the full stack in development mode.

### Run Full Stack (Backend + Frontend)

```bash
npm run dev:stack
```

  * **Frontend:** http://localhost:5173
  * **Backend:** http://localhost:3000

### Individual Commands

| Command | Description |
| :--- | :--- |
| `npm run dev:backend` | Starts the API in watch mode (`ts-node-dev`). |
| `npm run dev:frontend` | Starts the Vite dev server. |
| `npm run build:all` | Builds all workspaces (Shared -\> Backend -\> Frontend). |
| `npm run clean` | Removes `dist` folders and build artifacts across workspaces. |
| `npm run typecheck` | Runs TypeScript validation across the entire project. |

## 🐳 Production (Docker)

To simulate the production environment using **Nginx** (Frontend) and optimized Node.js runtime (Backend):

```bash
# Build and start services
npm run prod:up

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

## 📄 License

This project is licensed under the **CC BY-NC 4.0**.
See the [LICENSE](https://www.google.com/search?q=./LICENSE.md) file for details.

-----

**Copyright (c) 2025 Tupynambá Lucas Varela Rodrigues** [tupynambalucas.dev](https://www.google.com/search?q=https://tupynambalucas.dev)
