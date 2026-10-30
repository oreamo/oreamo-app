# Oreamo

Admin web client for Oreamo, built with React, TypeScript and Vite.

## Tech Stack

| Category     | Library                                  |
| ------------ | ---------------------------------------- |
| Framework    | React 19 (React Compiler), Vite 8        |
| Language     | TypeScript 5.9                           |
| Routing      | React Router 7                           |
| Server State | TanStack Query 5, Axios                  |
| Client State | Zustand 5                                |
| UI           | MUI 7, Emotion, MUI X Date Pickers       |
| Grid         | AG Grid 35                               |
| Form         | React Hook Form 7                        |
| Utility      | Day.js, crypto-js, react-dropzone        |
| Code Quality | ESLint 9, Prettier 3, Husky, lint-staged |

## Requirements

- Node.js `>= 25` (see `.nvmrc`)
- pnpm

## Getting Started

```bash
pnpm install
pnpm dev
```

The dev server runs on `http://localhost:3000`.

## Environment

| Mode          | Env File           | Description                     |
| ------------- | ------------------ | ------------------------------- |
| `local-mode`  | `.env.local-mode`  | Local development               |
| `development` | `.env.development` | Development server              |
| `production`  | `.env.production`  | Production (storage encryption) |

| Variable                  | Description                                        |
| ------------------------- | -------------------------------------------------- |
| `VITE_API_URL`            | API server base URL                                |
| `VITE_ENCRYPT_SECRET_KEY` | Secret key for local storage encryption (prd only) |

## Scripts

| Script              | Description                          |
| ------------------- | ------------------------------------ |
| `pnpm dev`          | Run dev server in `local-mode`       |
| `pnpm dev:dev`      | Run dev server in `development` mode |
| `pnpm dev:prd`      | Run dev server in `production` mode  |
| `pnpm build`        | Type check and build for production  |
| `pnpm build:dev`    | Type check and build for development |
| `pnpm lint`         | Run ESLint                           |
| `pnpm lint:fix`     | Run ESLint with auto fix             |
| `pnpm format`       | Format with Prettier                 |
| `pnpm format:check` | Check formatting with Prettier       |
| `pnpm preview`      | Preview the build output             |
