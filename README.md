# Simple Open Talk App

A Progressive Web App (PWA) for organizing and participating in open talk sessions. Built with TypeScript, React, and Firebase, following hexagonal architecture principles.

## Features

- **Public Access**: View upcoming talks without authentication
- **User Registration**: Email/password and Google OAuth authentication
- **Talk Submissions**: Participants can propose talks with details
- **Event Management**: Admins can create events and manage locations
- **Real-time Updates**: Live synchronization across all users
- **Progressive Web App**: Installable, offline-capable mobile experience

## Architecture

This application follows hexagonal architecture (Ports & Adapters) with clean separation of concerns:

- **Domain Layer**: Core business logic, entities, and repository interfaces
- **Application Layer**: Use cases and application services
- **Infrastructure Layer**: Firebase adapters, React components, and external integrations

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Backend**: Firebase (Firestore, Authentication)
- **Development**: Docker Compose with Firebase emulators
- **Deployment**: GitHub Pages
- **Architecture**: Hexagonal Architecture (Ports & Adapters)

## Development Setup

### Prerequisites

- Node.js 22+
- Docker and Docker Compose
- Firebase CLI

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd open-talk-session-app
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase configuration
   ```

3. **Start Development Environment**
   ```bash
   # Using Docker Compose (recommended)
   docker compose up

   # Or manually
   yarn install
   yarn dev
   ```

4. **Access the Application**
   - App: http://localhost:3000

### Available Scripts

- `yarn dev` - Start Vite development server
- `yarn build` - Build for production with TypeScript compilation
- `yarn preview` - Preview production build locally
- `yarn test` - Run tests with Vitest
- `yarn test:ui` - Run tests with Vitest UI
- `yarn lint` - Run ESLint
- `yarn type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── domain/                 # Domain layer (business logic)
│   ├── entities/          # Domain entities
│   ├── repositories/      # Repository interfaces (ports)
│   └── value-objects/     # Value objects
├── application/           # Application layer
│   ├── use-cases/        # Application use cases
│   └── ports/            # Application ports (interfaces)
├── infrastructure/        # Infrastructure layer
│   ├── firebase/         # Firebase configuration
│   ├── auth/             # Authentication adapters
│   └── repositories/     # Repository implementations
└── presentation/          # Presentation layer (React)
    ├── components/       # React components
    ├── pages/            # Page components
    ├── hooks/            # Custom hooks
    └── context/          # React context providers
```

## User Roles & Access

### Public Users
- View event schedules and talk details
- No authentication required

### Participants (Authenticated Users)
- All public user features
- Submit talk proposals
- Edit own talk submissions

### Event Admins
- All participant features
- Create and manage events
- Add/manage event locations
- Approve/reject talk proposals
- Share admin access with other users

## Firebase Security

The app uses Firestore security rules to enforce role-based access control:

- **Events**: Public read, authenticated create, admin write
- **Locations**: Public read, admin write  
- **Talks**: Public read, authenticated create/update own, admin manage all
- **Users**: Authenticated users can read/write their own profile

## Deployment

### GitHub Pages Deployment

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages**
   ```bash
   # Configure Firebase for production
   firebase deploy --only hosting
   ```

### Firebase Configuration

1. Create a Firebase project
2. Enable Authentication (Email/Password and Google)
3. Create Firestore database
4. Configure security rules from `firestore.rules`
5. Set up hosting (optional, for Firebase hosting instead of GitHub Pages)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the hexagonal architecture
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details