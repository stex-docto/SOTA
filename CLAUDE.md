# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Simple Open Talk Application (SOTA) conference management. A Progressive Web App (PWA) for organizing and participating in open talk sessions. Built with TypeScript, React, and Firebase, following hexagonal architecture principles.

## Development Commands

### Primary Commands (Make)

- `make dev` - Start Docker development environment (recommended setup, port 3000)
- `make lint` - Run linting and type checking in Docker container
- `make stop` - Stop all Docker services
- `make firebase.deploy` - Deploy to Firebase

### Code Quality Commands

- `yarn format` - Format code with Prettier (spaces indentation, no trailing commas)
- `yarn format:check` - Check code formatting without making changes
- `yarn lint` - Run ESLint
- `yarn lint:fix` - Run ESLint with auto-fix
- `yarn type-check` - Run TypeScript type checking
- `yarn lint:all` - Run all linting (format + lint:fix + type-check)

### PWA Testing

- `make pwa.build` - Build PWA for production
- `make pwa.serve` - Build and serve PWA locally for testing (port 4173)
- `make pwa.test` - Test PWA functionality
- `make pwa.stop` - Stop PWA server

## Architecture

This application follows **hexagonal architecture** (Ports & Adapters pattern) with strict layer separation:

### Core Layers

- **Domain** (`src/domain/`) - Business logic, entities, value objects, and repository interfaces

  - `entities/` - Domain entities (Event, User, Talk, etc.)
  - `repositories/` - Repository interfaces (ports)
  - `value-objects/` - Value objects (EventId, UserId, Authentication, etc.)
  - `errors/` - Domain-specific exceptions

- **Application** (`src/application/`) - Use cases and orchestration logic

  - `use-cases/` - Application use cases (CreateEventUseCase, SignInUseCase, etc.)

- **Infrastructure** (`src/infrastructure/`) - External adapters

  - `datastores/` - Firebase adapters for repositories
  - `firebase.ts` - Firebase configuration

- **Presentation** (`src/presentation/`) - React UI layer
  - `components/` - React components
  - `pages/` - Page components
  - `hooks/` - Custom React hooks
  - `context/` - React context providers for dependency injection

### Key Architectural Patterns

- **Dependency Injection**: Use `DependencyContext` and `DependencyProvider` for injecting use cases into React components
- **Repository Pattern**: Domain defines interfaces, infrastructure provides Firebase implementations
- **Use Case Pattern**: All business operations are encapsulated in use cases
- **Value Objects**: Strong typing with domain value objects (EventId, UserId, etc.)

### Path Aliases

- `@/` - Points to `src/`
- `@domain` - Points to `src/domain`
- `@application` - Points to `src/application`
- `@infrastructure/*` - Points to `src/infrastructure/*`
- `@presentation/*` - Points to `src/presentation/*`

## Technology Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Firebase (Firestore + Authentication)
- **Styling**: SCSS with modular approach
- **Testing**: Vitest
- **PWA**: Vite PWA plugin with Workbox
- **Deployment**: GitHub Pages with base path `/SOTA/`

## Firebase Configuration

The app requires Firebase environment variables:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## Code Formatting Standards

This project uses **Prettier** for consistent code formatting with the following configuration:

- **Indentation**: 4 spaces (no tabs)
- **Trailing commas**: None
- **Semicolons**: Required
- **Quotes**: Single quotes
- **Line width**: 100 characters
- **Bracket spacing**: Enabled
- **Arrow function parentheses**: Avoid when possible

**Always run `yarn lint:all` before committing** to ensure proper formatting and code quality.

## Development Guidelines

When working with this codebase:

1. **Follow hexagonal architecture** - Keep domain logic independent of external frameworks
2. **Use dependency injection** - Access use cases through `DependencyContext`
3. **Respect layer boundaries** - Domain should not import from infrastructure or presentation
4. **Use path aliases** - Import from `@domain`, `@application`, etc. instead of relative paths
5. **Type safety** - Leverage TypeScript strictly, use domain value objects
6. **Code formatting** - Use 4 spaces for indentation, no trailing commas, run `yarn lint:all`
7. **Testing** - Run `make lint` before committing to ensure code quality
8. **Respect ADRs** - All architectural decision records in `docs/` must be followed
9. **Update documentations** - Every time you create, modify or delete feature update the @CLAUDE.md and @README.md if necessary.
