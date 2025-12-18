# Shared Library - Elo Orgânico (@elo-organico/shared)

This package plays the fundamental role of **Single Source of Truth** within the Elo Orgânico Monorepo architecture.

Its goal is to ensure data integrity and consistency by sharing interface contracts, validation rules, and constants between the **Server (Backend)** and the **Client (Frontend)**.

## 📦 Exported Components

The library provides the following resources to other modules:

1.  **Validation Schemas (Zod)**:
    * Rigorous definitions for entities such as `User`, `Product`, `Cycle`, and `Auth`.
    * Used in the Backend for Payload validation and in the Frontend for Form validation.

2.  **TypeScript Typing**:
    * Static types inferred automatically from Zod Schemas (`z.infer<>`).
    * Ensures that changes in the data model are reflected at compile time throughout the project.

3.  **Global Constants**:
    * Configurations and fixed values shared between environments.

---

## 🔄 Development and Maintenance Flow

To maintain system consistency, any change in data modeling must follow this flow:

1.  **Modification**: Modify the desired schema or constant in `src/schemas` or `src/constants.ts`.
2.  **Compilation**: Execute the package build to generate distribution files and type definitions (`.d.ts`):
    ```bash
    npm run build
    ```
3.  **Propagation**: TypeScript will automatically detect changes in the `@elo-organico/backend` and `@elo-organico/frontend` modules, pointing out any inconsistencies that need refactoring.

## 🛠 Available Commands

* **`npm run build`**: Cleans the `dist` directory, compiles TypeScript, and generates type declarations.
* **`npm run dev`**: Runs compilation in *Watch* mode, ideal for simultaneous development of business rules and interfaces.
* **`npm run typecheck`**: Verifies type integrity without generating output files.
* **`npm run lint`**: Ensures source code standardization.