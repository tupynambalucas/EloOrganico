# Guia de Estilo e Padrões - Elo Orgânico

Este documento serve como a "Instrução Mestre" para a geração e revisão de código neste monorepo. O Gemini deve consultar e seguir estas diretrizes obrigatoriamente.

## 1. Arquitetura e Estrutura do Monorepo

- **Estrutura:** Monorepo gerenciado com NPM Workspaces.
- **Divisão de Pacotes:**
  - `packages/shared`: Contém schemas Zod, constantes, tipos DTO e traduções i18n.
  - `packages/backend`: API Node.js utilizando Fastify e Mongoose.
  - `packages/frontend`: Aplicação SPA utilizando React, Vite e Zustand.

## 2. Formatação de Código (Prettier)

O código deve seguir as regras definidas no `.prettierrc`:

- **Tabulação:** 2 espaços.
- **Semicolons:** Sempre utilizar (true).
- **Aspas:** Utilizar aspas simples (true), exceto em JSX.
- **Trailing Comma:** Sempre utilizar em todas as posições possíveis (all).
- **Largura da Linha:** Máximo de 100 caracteres.

## 3. Regras de TypeScript (Baseadas no eslint.config.ts)

- **Definições de Objeto:** Utilize obrigatoriamente `interface` em vez de `type` para definições consistentes.
- **Arrays:** Utilize a sintaxe simplificada `T[]` em vez de `Array<T>`.
- **Imports de Tipo:** Sempre utilize `import type` para tipos. Os tipos devem ser importados separadamente dos valores (estilo `separate-type-imports`).
- **Variáveis não utilizadas:** Devem ser prefixadas com sublinhado (ex: `_id`, `_args`) para serem ignoradas pelo linter.
- **Tipagem Estrita:** O uso de `any` é proibido. Regras de `unsafe-assignment` e `unsafe-call` são tratadas como erro no linter.
- **Comparações:** Utilize sempre igualdade estrita (`===`), exceto para checagem de null/undefined quando permitido.

## 4. Gerenciamento de Assincronismo (Crítico)

- **Floating Promises:** É proibido deixar promessas "flutuando". Toda operação assíncrona deve ser aguardada com `await` ou tratada com `.catch()`.
- **Fastify Handlers:** No backend, as promessas em handlers podem retornar void para compatibilidade com o framework.

## 5. Padrões por Pacote

### 5.1. Shared (@elo-organico/shared)

- **Rigor Máximo:** Expressões booleanas devem ser estritas.
- **APIs Públicas:** Devem ter tipos de retorno explicitamente definidos (`explicit-module-boundary-types`).
- **Validação:** Centralizar todos os schemas de domínio utilizando Zod.

### 5.2. Backend (Fastify + Mongoose)

- **Camadas de Domínio:** Seguir o padrão Controller -> Service -> Repository.
- **Handlers:** Devem utilizar o tipo `FastifyZodHandler` importado dos tipos locais.
- **Erros:** Lançar exceções utilizando a classe personalizada `AppError` com códigos de erro específicos.
- **Models:** Utilizar interfaces Mongoose (ex: `IUserDocument`) para tipagem de modelos.

### 5.3. Frontend (React + Zustand)

- **Componentes:** Funcionais com exportação padrão ou nomeada. Utilize `lazy` e `Suspense` para carregamento de layouts.
- **Hooks:** Regras de hooks são obrigatórias, incluindo dependências exaustivas no `useEffect`.
- **Estado Global:** Utilizar Zustand. As stores devem gerenciar estados de `status` ('LOADING', 'AUTHENTICATED', etc.), `error` e `errorCode`.
- **Estilização:** Utilizar **CSS Modules** (`.module.css`) para escopo local.
- **Logs:** `console.log` gera aviso; em produção, utilize apenas `console.error` ou `console.warn`.

## 6. Convenções de Nomenclatura

- **Schemas:** Terminar sempre com `Schema` (ex: `LoginRouteSchema`).
- **Arquivos:** Seguir o padrão `nome.tipo.ts` (ex: `auth.controller.ts`, `auth.api.ts`).
