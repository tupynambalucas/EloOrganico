# @elo-organico/shared

This is the **core library** of the Elo Orgânico Monorepo. It acts as the **Single Source of Truth** for the entire application.

It exports TypeScript interfaces, Zod Schemas, and constants used by both the Backend (API validation) and Frontend (Form validation).

## 📦 Contents

### 1. Zod Schemas (`src/schemas/`)
We use **Zod v3.24.1** to define the shape of our data.
* `UserSchema`: Validation logic for users (email regex, password length).
* `ProductSchema`: Structure for organic products and measures.
* `CycleSchema`: Logic for sales cycles.
* `AuthDTOs`: Data Transfer Objects for Login/Register payloads.

### 2. TypeScript Types
Types are **inferred** directly from Zod schemas. We do not write interfaces manually.
* `IUser`, `IProduct`, `ICycle`...

### 3. Constants (`src/constants.ts`)
Global business rules (e.g., minimum password length, max username characters).

## 🔨 Usage

**In Backend:**
```typescript
import { RegisterDTOSchema } from '@elo-organico/shared';
// Used in Fastify routes for automatic validation
````

**In Frontend:**

```typescript
import { AUTH_RULES } from '@elo-organico/shared';
// Used to validate forms before submission
```

## ⚙️ Build Process

This package must be built **before** the Backend or Frontend.

```bash
# Clean and Build
npm run build
```

The build process generates:

  * `dist/index.js`: CommonJS compiled code.
  * `dist/index.d.ts`: Type definitions.
  * `dist/*.map`: Source maps for debugging in consuming packages.

-----

**Author:** Tupynambá Lucas Varela Rodrigues ([tupynambalucas.dev](https://www.google.com/search?q=https://tupynambalucas.dev))
