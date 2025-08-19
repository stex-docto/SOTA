# Open Talk Session App - Use Cases & Architecture

## Overview
An open-source PWA (Progressive Web App) deployed via GitHub Pages with Firebase backend for managing open talk sessions. Features multi-tier access control and public participation capabilities.

## Technical Architecture
- **Frontend**: PWA built with TypeScript and React, deployed on GitHub Pages
- **Backend**: Firebase (Authentication, Firestore Database, Hosting)
- **Architecture Pattern**: Hexagonal Architecture (Ports & Adapters)
- **Development Environment**: Docker Compose for local development
- **Authentication**: Email/Password and Google OAuth
- **Access Model**: Public viewing, authenticated participation, admin management

### Hexagonal Architecture Structure
- **Domain Layer**: Core business logic (Event, Talk, User entities and use cases)
- **Application Layer**: Use case orchestration and application services
- **Infrastructure Layer**: Firebase adapters, React components, routing
- **Ports**: Interfaces defining contracts between layers
- **Adapters**: Concrete implementations of ports (Firebase, React UI)

### Development Environment
- **Docker Compose**: Containerized development setup
- **Services**: 
  - Frontend development server (React + TypeScript)
  - Firebase emulators (Auth, Firestore, Hosting)
  - Build tools and linting
- **Hot Reload**: Live development with automatic rebuilds
- **Testing**: Unit and integration test environments

## User Roles & Access Levels

### 1. Public Users (No Authentication)
**Access**: Event public URL
**Capabilities**:
- View upcoming talks list
- See talk details (name, pitch, start time, location)
- Browse event schedule
- No registration or interaction capabilities

### 2. Participants (Authenticated Users)
**Access**: Event public URL + authentication
**Registration**: Email/password or Google OAuth
**Capabilities**:
- All public user features
- Submit talk proposals with:
  - Talk name
  - Short pitch/description
  - Proposed start date/time
  - Location selection from available venues
- Edit/delete their own talk submissions
- View participant-only features (if any)

### 3. Event Admins (Authenticated + Admin Rights)
**Access**: Private admin URL or elevated permissions
**Capabilities**:
- All participant features
- Event management:
  - Set event dates and schedule
  - Create and manage locations (name + description)
  - Approve/reject talk proposals
  - Modify talk schedules and assignments
- Share private admin URL to grant admin access to other authenticated users
- View analytics and participant management

## Core Use Cases by Role

### Event Creation & Setup (Admin Only)
- **Create Event**: Authenticated user creates new event with just an event name
- **Generate URLs**: System creates unique public URL and private admin URL
- **Location Management**: Add multiple locations with name and description fields
- **Schedule Setup**: Define event dates and time slots
- **Admin Sharing**: Share private URL with other authenticated users for admin access

### Public Event Discovery
- **Browse Events**: Access event via public URL without authentication
- **View Schedule**: See all upcoming talks with start times and locations
- **Talk Details**: Read talk names, pitches, and logistics information
- **No Interaction**: Cannot submit talks or participate without registration

### Participant Engagement (Authenticated)
- **User Registration**: Sign up via email/password or Google OAuth
- **Talk Submission**: Create talk proposals with required fields
- **Location Selection**: Choose from admin-defined location list
- **Proposal Management**: Edit or withdraw submitted talks
- **Schedule Awareness**: View personal talk schedule and conflicts

### Event Administration
- **Multi-Admin Support**: Multiple users can have admin privileges via shared private URL
- **Real-time Updates**: Changes reflect immediately for all users
- **Location Curation**: Manage venue information and availability

## Data Models

### Event
- Event ID (unique)
- Event name
- Public URL (generated)
- Private admin URL (generated)
- Created date
- Admin user IDs list
- Event dates/schedule
- Status (active/inactive)

### Location
- Location ID
- Event ID (foreign key)
- Location name
- Description
- Created by admin ID

### Talk Proposal
- Proposal ID
- Event ID (foreign key)
- Participant user ID
- Talk name
- Short pitch
- Proposed start date/time
- Selected location ID
- Status (pending/approved/rejected)
- Submission timestamp

### User
- User ID
- Email
- Authentication method (email/google)
- Display name
- Registration date
- Admin events list (events where user has admin access)

## Technical Features

### PWA Capabilities
- Offline viewing of cached event data
- Mobile-responsive design
- App-like experience with install prompts
- Push notifications for talk updates (optional)

### Firebase Integration
- **Authentication**: Handle email/password and Google OAuth flows
- **Firestore**: Real-time database for events, talks, and user data
- **Security Rules**: Enforce role-based access control
- **Cloud Functions**: Handle automated workflows (if needed)

### URL Structure
- Public: `/{eventId}`
- Admin: `/{eventId}/admin/{adminToken}`
- Direct talk view: `/{eventId}/talk/{talkId}`

This architecture provides a scalable, cost-effective solution for managing open talk sessions with clear separation of concerns and appropriate access control for different user types.