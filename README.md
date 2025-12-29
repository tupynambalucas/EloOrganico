# Elo Orgânico - Integrated Management Platform

## Project Overview

**Elo Orgânico** is a digital solution tailored to optimize and manage the sharing cycle of organic products. The system is designed to replace manual processes with a centralized, secure, and scalable infrastructure, ensuring data integrity and operational efficiency from catalog ingestion to financial reconciliation via Pix.

This repository operates under a **Monorepo** architecture, consolidating all application modules (Backend, Frontend, and Shared Library) into a single versioning environment, facilitating maintenance and code consistency.

## 📖 Master Plan

- [Master Plan (English)](./docs/MASTER_PLAN.en.md)
- [Documento Mestre (Português)](./docs/MASTER_PLAN.pt-BR.md)

## 🏗 Solution Architecture

The system is composed of three main modules, orchestrated via **Docker** to ensure parity between development and production environments:

| Module                       | Technology                       | Responsibility                                                   |
| :--------------------------- | :------------------------------- | :--------------------------------------------------------------- |
| **`@elo-organico/backend`**  | Fastify v5, Node.js, MongoDB     | RESTful API, Business Rules, Transaction Management, and Queues. |
| **`@elo-organico/frontend`** | React 19, Vite,Zustand, Tailwind | User Interface (SPA), Administrative Panel                       |
| **`@elo-organico/shared`**   | TypeScript, Zod                  | _Single Source of Truth_ for typing and data validation.         |

## 🚀 Infrastructure Requirements

For local execution or deployment of the application, the environment must meet the following prerequisites:

- **Node.js**: Version 20 (LTS) or higher.
- **Package Manager**: NPM v10+.
- **Virtualization**: Docker Engine & Docker Compose.

## 🛠 Installation and Execution Guide

Follow the procedures below to initialize the development environment.

### 1. Installation of Dependencies

In the project root, execute the command to install dependencies for all workspaces and compile the shared library:

```bash
npm install
```

### 2. Environment Variables Configuration

It is necessary to configure sensitive environment variables. Create a `.env` file in the project root (or in the specific backend directory) following the model below:

```env
# Environment Settings
NODE_ENV=development
SERVER_PORT=3000

# Database (MongoDB Replica Set)
MONGO_URI=mongodb://admin:secret@localhost:27017/elo-organico?authSource=admin&replicaSet=rs0
MONGO_USER=admin
MONGO_PASSWORD=secret
MONGO_DB_NAME=elo-organico

# Cache & Session (Redis)
REDIS_HOST=localhost
REDIS_PORT=6379

# Security & Encryption
JWT_SECRET=<256_bit_hash_for_jwt>
SESSION_SECRET=<32_character_hash_for_session>

# Initial Credentials (Seed)
ADMIN_USER_SEED=admin
ADMIN_EMAIL_SEED=admin@elo.com
ADMIN_PASS_SEED=initial_secure_password
```

### 3. Database Security Configuration

The MongoDB cluster operates in _Replica Set_ mode to ensure ACID transactions. Generating an internal authentication key (Keyfile) is mandatory:

```bash
npm run infra:gen-key
```

### 4. Development Infrastructure Initialization

To run the application locally, it is necessary to provision support services (Database and Cache) before starting the application server. Execute the command below to start MongoDB and Redis containers in the background:

```bash
npm run infra:up
```

### 5. Initial Seeding

For the first access, populate the database with the default administrative user configured in `.env`:

```bash
npm run backend:seed
```

## 💻 Development Environment

You can choose to run the full stack or individual services with _Hot Reload_ support.

### Full Stack Execution

Start both Backend and Frontend simultaneously:

```bash
npm run dev:stack
```

### Individual Service Execution

- **Backend Only**:

  ```bash
  npm run dev:backend
  ```

- **Frontend Only**:
  ```bash
  npm run dev:frontend
  ```

### Access Points

- **Frontend (Web Application)**: http://localhost:5173

- **Backend (REST API)**: http://localhost:3000

## 🐳 Production Simulation (Docker)

To validate image building and application execution in a containerized environment identical to the production server (VPS):

```bash
npm run prod:up
```

This command will:

1. Compile Backend and Frontend (Production Build).
2. Provision the Nginx server as a Reverse Proxy.
3. Start the API and Database in the secure internal network.

To terminate the environment:

```bash
npm run prod:down
```

## 📜 Automation Scripts

| Command               | Technical Description                                    |
| :-------------------- | :------------------------------------------------------- |
| `npm run infra:up`    | Provisions infrastructure services (DB, Cache).          |
| `npm run infra:down`  | Stops and removes active containers.                     |
| `npm run infra:reset` | Resets the entire infrastructure (Removes volumes/data). |
| `npm run build:all`   | Executes the build process across all monorepo packages. |
| `npm run lint:all`    | Executes static code analysis (Linter).                  |

## © License and Rights

This software is protected under the **CC-BY-NC-4.0** license.
Developed by **Tupynambá Lucas Varela Rodrigues**.
