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

### Package Management (Docker-based)

**IMPORTANT**: All package management must be done through Docker as per ADR-001.

- `docker-compose run --rm frontend yarn add <package>` - Add dependency
- `docker-compose run --rm frontend yarn add -D <package>` - Add dev dependency  
- `docker-compose run --rm frontend yarn remove <package>` - Remove dependency

### Code Quality Commands

- `docker-compose run --rm frontend yarn format` - Format code with Prettier (spaces indentation, no trailing commas, no semicolons)
- `docker-compose run --rm frontend yarn format:check` - Check code formatting without making changes
- `docker-compose run --rm frontend yarn lint` - Run ESLint
- `docker-compose run --rm frontend yarn lint:fix` - Run ESLint with auto-fix
- `docker-compose run --rm frontend yarn type-check` - Run TypeScript type checking
- `docker-compose run --rm frontend yarn lint:all` - Run all linting (format + lint:fix + type-check)

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
- **UI Library**: Chakra UI v3 + react-icons
- **Styling**: Chakra UI with colorPalette system for theming
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
- **Semicolons**: None (disabled)
- **Quotes**: Single quotes
- **Line width**: 100 characters
- **Bracket spacing**: Enabled
- **Arrow function parentheses**: Avoid when possible

**Always run `make lint` before committing** to ensure proper formatting and code quality.

## UI Development Guidelines

This project uses **Chakra UI v3** as the primary UI library for new components, while maintaining existing SCSS styles for legacy components.

### UI Framework Migration Strategy

- **New Components**: Always use Chakra UI v3 components and styling
- **Existing Components**: Keep SCSS styling until explicitly refactored
- **Component Updates**: When modifying existing components, consider migrating to Chakra UI

### Chakra UI Best Practices

#### Component Structure
```tsx
// Good: Use Chakra UI components with TypeScript
import { Button, VStack, Text, Box } from '@chakra-ui/react'
import { IoIcon } from 'react-icons/io5'

interface MyComponentProps {
    title: string
    onAction: () => void
}

function MyComponent({ title, onAction }: MyComponentProps) {
    return (
        <Box p={6} borderRadius="md" bg="white" shadow="sm">
            <VStack gap={4}>
                <Text fontSize="lg" fontWeight="semibold">{title}</Text>
                <Button onClick={onAction} colorScheme="blue">
                    <IoIcon /> Action
                </Button>
            </VStack>
        </Box>
    )
}
```

#### Component Guidelines

1. **Import Organization**:
   ```tsx
   // Chakra UI components first
   import { Button, VStack, HStack, Text, Box } from '@chakra-ui/react'
   import { DialogRoot, DialogTrigger, DialogContent } from '@chakra-ui/react'
   
   // React Icons second
   import { IoQrCodeOutline } from 'react-icons/io5'
   import { MdContentCopy } from 'react-icons/md'
   
   // Other imports last
   import { CustomType } from '@domain'
   ```

2. **Styling Approach**:
   - **Prefer Chakra Props**: Use `bg="gray.50"`, `p={4}`, `borderRadius="md"` instead of custom CSS
   - **Responsive Design**: Use Chakra's responsive syntax: `fontSize={{ base: "sm", md: "md" }}`
   - **Color System**: Use `colorPalette` prop for theming: `colorPalette="blue"`, `colorPalette="gray"`
   - **Spacing**: Use Chakra's spacing scale: `gap={4}`, `p={6}`, `m={2}`

#### Color Palette System

**IMPORTANT**: Always use `colorPalette` instead of direct `color` or `colorScheme` props for consistent theming.

**Correct Usage**:
```tsx
// Components with automatic light/dark theme support
<Button colorPalette="blue">Primary Action</Button>
<Text colorPalette="gray">Muted text</Text>
<Box colorPalette="red">
  <Badge colorPalette="red">Error</Badge>
</Box>

// For complex theming with responsive colors
<Box
  colorPalette="blue"
  bg={{ base: "colorPalette.50", _dark: "colorPalette.900" }}
  color={{ base: "colorPalette.800", _dark: "colorPalette.200" }}
  borderColor={{ base: "colorPalette.500", _dark: "colorPalette.400" }}
>
  Content with theme-aware colors
</Box>
```

**Available Color Palettes**:
- `colorPalette="gray"` - For text, borders, backgrounds
- `colorPalette="blue"` - Primary actions, links, info states
- `colorPalette="green"` - Success states, positive actions
- `colorPalette="red"` - Error states, destructive actions
- `colorPalette="orange"` - Warning states

**Migration Pattern**:
```tsx
// Old approach (avoid)
<Text color="fg.muted">Text</Text>
<Button colorScheme="blue">Button</Button>

// New approach (preferred)
<Text colorPalette="gray">Text</Text>
<Button colorPalette="blue">Button</Button>
```

3. **Layout Components**:
   - **VStack/HStack**: For vertical/horizontal layouts with consistent spacing
   - **Box**: General container component for custom layouts  
   - **Grid/SimpleGrid**: For grid-based layouts
   - **Flex**: For flexbox layouts with custom properties

4. **Common Patterns**:
   ```tsx
   // Modal/Dialog Pattern
   <DialogRoot>
       <DialogTrigger asChild>
           <Button>Open</Button>
       </DialogTrigger>
       <DialogContent>
           <DialogHeader>
               <DialogTitle>Title</DialogTitle>
           </DialogHeader>
           <DialogBody>Content</DialogBody>
       </DialogContent>
   </DialogRoot>
   
   // Form Layout Pattern
   <VStack gap={4} align="stretch">
       <Text>Label</Text>
       <Input placeholder="Enter value" />
       <Button type="submit">Submit</Button>
   </VStack>
   ```

#### Icon Usage

- **Source**: Use `react-icons` library (already installed)
- **Popular Icon Sets**:
  - `react-icons/io5` - Ionicons (modern, clean)
  - `react-icons/md` - Material Design
  - `react-icons/hi` - Heroicons
  - `react-icons/fa` - Font Awesome

#### Component Examples

- **QRCodeModal**: Reference implementation showing Dialog usage, icons, and layout
- **Button Patterns**: Use `variant="outline"`, `colorScheme="blue"`, `size="sm"`
- **Input Patterns**: Use `readOnly`, `bg="gray.50"` for display-only fields

#### Testing UI Components

- Components must be accessible (proper ARIA labels)
- Test with different screen sizes using Chakra's responsive props
- Ensure proper TypeScript typing for all props

### Design System Integration

- **Consistent Spacing**: Use Chakra's spacing tokens (4, 6, 8, etc.)
- **Color Palette**: Stick to Chakra's color system for consistency
- **Typography**: Use Chakra's text components with proper hierarchy
- **Interactive States**: Leverage Chakra's built-in hover, focus, and active states

## Development Guidelines

When working with this codebase:

1. **Follow hexagonal architecture** - Keep domain logic independent of external frameworks
2. **Use dependency injection** - Access use cases through `DependencyContext`
3. **Respect layer boundaries** - Domain should not import from infrastructure or presentation
4. **Use path aliases** - Import from `@domain`, `@application`, etc. instead of relative paths
5. **Type safety** - Leverage TypeScript strictly, use domain value objects
6. **Code formatting** - Use 4 spaces for indentation, no trailing commas, no semicolons, run `make lint`
7. **Testing** - Run `make lint` before committing to ensure code quality
8. **Respect ADRs** - All architectural decision records in `docs/` must be followed
9. **Update documentations** - Every time you create, modify or delete feature update the @CLAUDE.md and @README.md if necessary.
