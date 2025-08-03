# 🎤 Open Talk Conference

A web application for managing open talk conferences in real-time. Built with React Router v7, TypeScript, Tailwind CSS, and Firebase Authentication.

## 📋 Description

Open Talk Conference allows organizers to create and manage events where participants can spontaneously propose talks for available time slots. Participants can view the real-time agenda without mandatory registration.

### ✨ Features

**For Participants:**

- 📱 Real-time agenda consultation
- 🎯 Talk proposal in just a few clicks
- 🔍 Filtering by status (ongoing, upcoming, all)
- 🔗 Access via shared private link

**For Organizers:**

- 🛠️ Complete management dashboard
- ✅ Approve/reject talk proposals
- 📊 Real-time statistics
- 🏢 Configure rooms and time slots
- 🔐 Secure admin interface with Firebase Authentication

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication and configure Email/Password sign-in method
3. Copy `.firebaserc.example` to `.firebaserc` and replace `your-project-id` with your actual project ID:
   ```bash
   cp .firebaserc.example .firebaserc
   ```
4. Copy `.env.example` to `.env.local` and fill in your Firebase configuration values:
   ```bash
   cp .env.example .env.local
   ```
5. Get your Firebase config from Project Settings > General > Your apps
6. Add your domain to Firebase's authorized domains in Authentication > Settings

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

### Firebase Emulators

To test with Firebase emulators:

```bash
# Auth emulator only
npm run dev:emulator:auth

# Hosting emulator only (builds app and serves it)
npm run dev:emulator:hosting
```

Hosting emulator serves the app at `http://127.0.0.1:5000`.

## Tech Stack

- **Frontend**: React Router v7 (SPA mode)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: Firebase Auth (Email/Password)
- **Build Tool**: Vite

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

This application runs in SPA (Single Page Application) mode and generates static assets for deployment.

### Static Hosting Deployment

The app can be deployed to any static hosting platform:

```bash
npm run build
```

Deploy the `build/client/` directory to:
- **Netlify**
- **Vercel** 
- **GitHub Pages**
- **Firebase Hosting**
- **AWS S3 + CloudFront**
- **Any CDN or static web server**


### Environment Variables

For deployment, make sure to set the Firebase environment variables in your hosting platform:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`  
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
