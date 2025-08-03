# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Open Talk Conference management application built with React Router v7, TypeScript, and Tailwind CSS. The app allows organizers to manage real-time conferences where participants can propose talks for available time slots.

## Tech Stack & Architecture

- **Framework**: React Router v7 with CSR (Client-Side Rendering) in SPA mode
- **Build Tool**: Vite with TypeScript support
- **Styling**: Tailwind CSS v4
- **Authentication**: Firebase Auth (Email/Password only)
- **Runtime**: Client-side JavaScript (SPA mode)
- **Type Safety**: TypeScript with strict mode enabled

## Common Development Commands

```bash
# Start development server with HMR
npm run dev

# Start Firebase Auth emulator
npm run dev:emulator:auth

# Start Firebase Hosting emulator
npm run dev:emulator:hosting

# Build for production
npm run build

# Start production server
npm run start

# Type checking and code generation
npm run typecheck

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check

# Lint code with ESLint
npm run lint

# Fix linting issues automatically
npm run lint:fix
```

## Project Structure

- `app/` - Main application code following React Router v7 conventions
  - `root.tsx` - Root layout with error boundaries and global setup
  - `routes.ts` - Route configuration using file-based routing
  - `routes/` - Route components
  - `welcome/` - Welcome page assets and components
  - `lib/` - Utility libraries and services
    - `firebase.ts` - Firebase configuration and initialization
  - `hooks/` - Custom React hooks
    - `useAuth.ts` - Authentication hook with email/password methods
- `build/` - Production build output (generated)
  - `client/` - Static assets for browser

## Key Configuration Files

- `react-router.config.ts` - React Router configuration (SPA mode enabled, SSR disabled)
- `vite.config.ts` - Vite build configuration with React Router, Tailwind, and path resolution
- `tsconfig.json` - TypeScript configuration with path mapping (`~/*` → `./app/*`)

## Development Notes

- Uses file-based routing through `app/routes.ts`
- TypeScript paths are configured with aliases: `~/*` → `app/*`, `@lib/*` → `app/lib/*`, `@hooks/*` → `app/hooks/*`
- SPA mode is enabled (SSR disabled) in `react-router.config.ts` for client-side rendering
- Tailwind CSS is configured via Vite plugin
- Error boundaries are set up in `root.tsx` with development stack traces

## Deployment

The application can be deployed using:

- Static hosting platforms (Netlify, Vercel, GitHub Pages, etc.)
- CDN-based hosting
- Firebase Hosting
- Any web server that can serve static files

Build output includes client assets optimized for SPA deployment.

## Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Authentication and configure Email/Password sign-in method
3. Copy `.env.example` to `.env` and fill in your Firebase configuration values
4. Get your Firebase config from Project Settings > General > Your apps
5. Add your domain to Firebase's authorized domains

### Local Development with Emulators
1. Create Firebase project and get your project ID
2. Copy `.firebaserc.example` to `.firebaserc` and replace `your-project-id` with your actual project ID
3. Copy `.env.example` to `.env.local` and fill in your Firebase configuration
4. Initialize Firebase emulators: `npx firebase init emulators` (select Auth + Hosting)
5. Set `VITE_USE_FIREBASE_EMULATOR=true` in `.env.local`
6. Start Auth emulator: `npm run dev:emulator:auth` (for authentication testing)
7. Start Hosting emulator: `npm run dev:emulator:hosting` (builds app + serves at `http://127.0.0.1:5000`)
8. For development with HMR: `npm run dev` (in another terminal)

## Code Style Guidelines

### Comments Policy
Only add comments for:
- **Infrastructure configuration** (build tools, deployment, environment setup)
- **Business rules** (domain-specific logic, requirements, constraints)
- **Complex one-liners** (non-obvious algorithms, regex, complex expressions)

Avoid comments for self-explanatory code, simple variable assignments, or basic function calls.

### Pre-commit Hooks
The project uses Husky and lint-staged to ensure code quality:
- **Prettier** formats code automatically
- **ESLint** fixes auto-fixable issues and checks for remaining problems
- **Commit fails** if there are unfixable linting errors
- Only staged files are processed for efficiency

## Dos and Don'ts

- Every time you create, modify or delete feature update the @CLAUDE.md and @README.md if necessary.
