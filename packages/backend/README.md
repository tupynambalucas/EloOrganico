# Backend Module - Elo Orgânico

This directory contains the API for the Elo Orgânico system, developed with a focus on high performance, security, and long-term maintainability. The application follows **Domain-Driven Design (DDD)** principles to ensure decoupling of business rules and system scalability.

## 🛠 Technology Stack

The server architecture utilizes cutting-edge technologies from the Node.js ecosystem:

- **Runtime**: Node.js v20+
- **Web Framework**: [Fastify v5](https://www.fastify.io/)
- **Language**: TypeScript (Strict Mode enabled for type safety)
- **Database**: MongoDB v7 (Modeling via Mongoose)
- **Cache & Session**: Redis (Management via IORedis)
- **Data Validation**: Zod (Integrated into Fastify Type Provider)
- **Asynchronous Processing**: BullMQ (Task queue management)
- **Payments**: Official EFI Bank SDK (Pix Integration)
- **Observability**: Sentry (Real-time error monitoring)

---

## 📂 Project Architecture

The folder structure reflects the separation by business domains, facilitating navigation and maintenance:

```text
src/
├── config/           # Global configurations (Env, Queues, Fastify)
├── domains/          # Application Core (Business Rules)
│   ├── auth/         # Authentication and Session Management
│   ├── cycle/        # Sharing Cycle Management
│   └── product/      # Product Catalog and Inventory
├── models/           # Persistence Schemas (Mongoose)
├── plugins/          # Fastify Ecosystem Plugins (Security, DB)
├── scripts/          # Automation and Maintenance Scripts (Seeds)
└── utils/            # Utility Libraries and Helpers
```

### Adopted Patterns

- **Repository Pattern**: Abstraction of the data access layer.
- **Service Layer**: Encapsulation of complex business logic.
- **Dependency Injection**: Dependency management through modular structure.

---

## ⚙️ Environment Variables

The application requires the configuration of the following variables for correct operation. In a production environment, the use of _Secrets Management_ is recommended.

```properties
# Server
NODE_ENV=production
SERVER_PORT=3000

# Connectivity
MONGO_URI=mongodb://user:pass@host:27017/db
REDIS_HOST=redis
REDIS_PORT=6379

# Encryption and Session
JWT_SECRET=...
SESSION_SECRET=...
USER_SESSION_KEY=user_session
ADMIN_SESSION_KEY=admin_session

# External Integrations
EFI_CLIENT_ID=...
EFI_CLIENT_SECRET=...
SENTRY_DSN=...
```

---

## 🚀 Operation Scripts

Commands available via NPM for the application lifecycle:

- **`npm run dev`**: Starts the server in development mode with _watch_ and _respawn_.
- **`npm run build`**: Transpiles TypeScript code to JavaScript (directory `dist/`).
- **`npm run start`**: Executes the compiled application (Recommended for Production).
- **`npm run seed`**: Executes _seeding_ scripts to populate the database with initial data.
- **`npm run typecheck`**: Verifies type integrity without emitting files.
- **`npm run lint`**: Executes code style verification (ESLint).
