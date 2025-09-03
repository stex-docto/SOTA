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

- **Frontend**: React 19 with TypeScript
- **UI Library**: Chakra UI v3 + react-icons
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
   # Using Make with Docker Compose (recommended)
   make dev
   ```

4. **Access the Application**
   - App: http://localhost:3000

### Available Commands

- `make dev` - Start Docker development environment
- `make lint` - Run linting and type checking in Docker container
- `make stop` - Stop all Docker services
- `make firebase.deploy` - Deploy to Firebase
- `make pwa.build` - Build PWA for production
- `make pwa.serve` - Build and serve PWA locally for testing

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

## UI Development

This project uses **Chakra UI v3** as the primary UI framework for building consistent, accessible, and responsive user interfaces.

### Key UI Features
- **Modern Component Library**: Chakra UI v3 with comprehensive component set
- **Icon System**: react-icons library with multiple icon families
- **Responsive Design**: Built-in responsive props and mobile-first approach
- **Accessibility**: ARIA compliance and keyboard navigation built-in
- **Theme Integration**: Consistent design tokens and color system

### Component Examples
- **QRCodeModal**: Modal dialog with QR code generation and URL sharing
- **Responsive Layouts**: VStack, HStack, and Grid components
- **Interactive Elements**: Buttons, inputs, and form controls
- **Navigation**: Dialogs, tooltips, and overlay components

### Development Approach
- **New Components**: Built with Chakra UI components and styling
- **Legacy Components**: Existing SCSS-based components maintained until refactored
- **Migration Strategy**: Gradual transition to Chakra UI for consistency

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
   make pwa.build
   ```

2. **Deploy Firebase configuration (rules, etc.)**
   ```bash
   make firebase.deploy
   ```

3. **Deploy to GitHub Pages**
   ```bash
   yarn deploy
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