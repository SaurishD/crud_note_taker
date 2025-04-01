# Note Taking Application

A full-stack note-taking application built with modern web technologies. This application allows users to create, read, update, and delete notes with a clean and intuitive interface.

## Tech Stack

### Frontend
- Next.js for the web application
- TypeScript for type safety
- Modern React patterns with hooks and context
- Clean and responsive UI components

### Backend
- NestJS backend server
- Prisma for database management
- Authentication system
- RESTful API endpoints for note management

## Project Structure

The project is organized as a monorepo using Turborepo with the following structure:

### Apps
- `frontend`: Next.js web application for the user interface
- `backend`: NestJS server handling API requests and database operations

### Features
- User authentication and authorization
- Create, read, update, and delete notes
- Responsive design for mobile and desktop
- Real-time updates
- Secure API endpoints

## Development

This project uses Turborepo for monorepo management and pnpm as the package manager.

### Setup and Installation

1. Install dependencies:
```sh
pnpm install
```

2. Set up environment variables:

Create `.env` files in both frontend and backend directories. Example values for production setup:

#### Backend (.env)
```
# Database
DATABASE_URL="postgresql://user:password@your-database-host:5432/your_database_name"

# JWT
JWT_SECRET="your_jwt_secret"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GOOGLE_CALLBACK_URL="https://api.your-domain.com/api/auth/google/callback"

# Frontend URL
NEXT_PUBLIC_FRONTEND_URL="https://your-domain.com"
FRONTEND_URL="https://your-domain.com/"
```

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL="https://api.your-domain.com"
NEXT_PUBLIC_FRONTEND_URL="https://your-domain.com"
```

Note: Example environment files are provided as `.env.example` in the backend directory and `.env.local.example` in the frontend directory. Copy these files and rename them to `.env` and `.env.local` respectively, then update the values according to your setup.

For local development, use these URLs instead:
- Backend API: `http://localhost:3000`
- Frontend: `http://localhost:3002`
- Google OAuth Callback: `http://localhost:3000/api/auth/google/callback`

### Google OAuth Setup

To enable Google authentication:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client ID"
5. Configure the OAuth consent screen:
   - Add your application name
   - Add authorized domains
   - Save the configuration
6. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Name: Your app name
   - Authorized JavaScript origins: `http://localhost:3002` (for development)
   - Authorized redirect URIs: `http://localhost:3000/api/auth/google/callback`
7. Copy the generated Client ID and Client Secret to your backend `.env` file

Note: For production, update the URLs in both the Google Cloud Console and environment variables to your production domains.

### Development Commands

To develop all apps and packages:
```sh
pnpm dev
```

To build all apps and packages:
```sh
pnpm build
```

### Tools and Utilities

This project comes with several preconfigured tools:

- TypeScript for static type checking
- ESLint for code linting
- Prettier for code formatting

## Project Structure
```
apps/
  ├── frontend/     # Next.js web application
  └── backend/      # NestJS server
```
