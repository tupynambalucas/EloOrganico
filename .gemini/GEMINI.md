# Contexto do Projeto: Elo Orgânico

## Objetivo

Plataforma de comércio de produtos orgânicos que conecta produtores e consumidores, focada em ciclos de venda programados.

## Estrutura do Workspace

- **Raiz:** Contém as configurações de orquestração (Docker, Turbo, NPM Workspaces).
- **packages/shared:** Contrato de dados. Se precisar mudar uma regra de validação, comece por aqui.
- **packages/backend:** API Fastify. O banco de dados é MongoDB (Mongoose).
- **packages/frontend:** Interface React. O estado global é gerenciado pelo Zustand.

## Fluxo de Trabalho do Agente

1. Ao criar novas funcionalidades, verifique sempre se o schema Zod já existe no `shared`.
2. Siga rigorosamente o `.gemini/styleguide.md` para padrões de código.
3. Utilize os comandos de infraestrutura definidos no `package.json` da raiz (ex: `npm run infra:up`) se precisar validar o ambiente.

## Stack Técnica Chave

- Backend: Fastify, Mongoose, Zod, JWT.
- Frontend: React, Zustand, Axios, CSS Modules.
