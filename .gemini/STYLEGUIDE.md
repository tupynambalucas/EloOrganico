# Style Guide and Standards - Elo Organico

This document serves as the "Master Instruction" for code generation and review within this monorepo. Gemini must consult and strictly follow these guidelines.

## 1. Architecture and Guiding Principles

The project adheres to modern software architecture principles to ensure scalability, maintainability, and code quality.

### 1.1. Monorepo Structure

- **Framework:** Monorepo managed with NPM Workspaces.
- **Package Division:**
  - `packages/shared`: Contains Zod schemas, constants, DTO types, and i18n translations. It is the **Single Source of Truth** for data contracts.
  - `packages/backend`: Node.js API using Fastify and Mongoose.
  - `packages/frontend`: SPA application using React, Vite, and Zustand.

### 1.2. Architectural Principles

- **Domain-Driven Design (DDD):** The business logic is organized into domains to facilitate maintenance and scalability. This is evident in both the backend (`packages/backend/src/domains`) and frontend (`packages/frontend/src/features`) directories. Each domain (e.g., Auth, Cycle, Product) encapsulates a specific part of the business logic.
- **SOLID Principles:**
  - **Single Responsibility:** Each class, function, or module has one specific purpose. (e.g., a Controller handles HTTP requests, a Service contains business logic, a Repository handles database interaction).
  - **Open/Closed:** Modules are open for extension but closed for modification. We achieve this by using plugins (like in Fastify) and component-based architecture (React).
  - **Liskov Substitution:** Subtypes must be substitutable for their base types. TypeScript's strict type system helps enforce this.
  - **Interface Segregation:** Clients should not be forced to depend on interfaces they do not use. We define precise `interface` definitions for each use case.
  - **Dependency Inversion:** High-level modules do not depend on low-level modules; both depend on abstractions. We use dependency injection (e.g., passing services to controllers) and rely on interfaces from `@elo-organico/shared`.

## 2. Code Formatting (Prettier)

Code must follow the rules defined in `.prettierrc`:

- **Indentation:** 2 spaces.
- **Semicolons:** Always use (true).
- **Quotes:** Use single quotes (true), except in JSX.
- **Trailing Comma:** Always use where possible (all).
- **Line Width:** Maximum of 100 characters.

## 3. TypeScript Rules (Based on eslint.config.ts)

The configuration is set for maximum type safety.

- **Object Definitions:** You **must** use `interface` instead of `type` for object definitions to ensure consistency.
- **Arrays:** Use the simplified `T[]` syntax instead of `Array<T>`.
- **Type Imports:** Always use `import type` for types. Types must be imported separately from values (style: `separate-type-imports`).
- **Unused Variables:** Must be prefixed with an underscore (e.g., `_id`, `_args`) to be ignored by the linter.
- **Strict Typing:** The use of `any` is forbidden. Rules like `unsafe-assignment` and `unsafe-call` are treated as errors by the linter.
- **Comparisons:** Always use strict equality (`===`), except for null/undefined checks where allowed.

## 4. Asynchronous Code Management (Critical)

- **No Floating Promises:** It is forbidden to leave promises "floating". Every async operation must be handled with `await` or a `.catch()` block.
- **Fastify Handlers:** In the backend, promises in handlers can return `void` for framework compatibility, but they are still managed by the async-aware framework.

## 5. Package-Specific Standards

### 5.1. Shared (@elo-organico/shared)

- **Maximum Rigor:** Boolean expressions must be strict.
- **Public APIs:** Must have explicitly defined return types (`explicit-module-boundary-types`).
- **Validation:** Centralize all domain schemas using Zod.

### 5.2. Backend (Fastify + Mongoose)

- **Domain Layers:** Follow the pattern: Controller -> Service -> Repository.
- **Handlers:** Should use the `FastifyZodHandler` type imported from local types.
- **Errors:** Throw exceptions using the custom `AppError` class with specific error codes.
- **Models:** Use Mongoose interfaces (e.g., `IUserDocument`) for model typing.

### 5.3. Frontend (React + Zustand)

- **Components:** Functional components with default or named exports. Use `lazy` and `Suspense` for loading layouts.
- **Hooks:** Rules of hooks are mandatory, including exhaustive dependencies in `useEffect`.
- **Global State:** Use Zustand. Stores should manage `status` ('LOADING', 'AUTHENTICATED', etc.), `error`, and `errorCode` states.
- **Styling:** Use **CSS Modules** (`.module.css`) for local scope.
- **Logs:** `console.log` generates a warning; in production, use only `console.error` or `console.warn`.

## 6. Naming Conventions

- **Schemas:** Always end with `Schema` (e.g., `LoginRouteSchema`).
- **Files:** Follow the `name.type.ts` pattern (e.g., `auth.controller.ts`, `auth.api.ts`).
