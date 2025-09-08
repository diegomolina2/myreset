# NaijaReset - Wellness Challenge and Tracking Platform

## Overview

NaijaReset is a modern full-stack health and wellness challenge tracking platform built with React, Express.js, and TypeScript. The application features gamification elements, multi-language support, comprehensive health tracking capabilities, and West African cultural content. It serves as a progressive web app that can work offline using localStorage for data persistence with CSV export functionality.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: TailwindCSS with custom CSS variables for theming
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: React Context API with useReducer pattern
- **Routing**: Wouter for lightweight client-side routing
- **Data Fetching**: TanStack Query for server state management
- **Styling System**: Mobile-first responsive design with dark mode support

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Development**: Hot reload with tsx for development server
- **Build System**: ESBuild for production bundling
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **Development Tools**: Replit integration for cloud development

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon Database
- **ORM**: Drizzle ORM with TypeScript schema definitions
- **Local Storage**: Browser localStorage for offline functionality
- **Session Storage**: PostgreSQL-backed sessions
- **Migration System**: Drizzle Kit for database schema migrations

## Key Components

### User Interface Components
- **Responsive Design**: Mobile-first approach with bottom navigation
- **Component Library**: Comprehensive UI components (cards, buttons, forms, dialogs)
- **Theming**: Light/dark mode with CSS custom properties
- **Charts**: Recharts for data visualization
- **Internationalization**: Multi-language support (English-Nigeria, French-Ivory Coast)

### Health Tracking Features
- **Challenge System**: 4 pre-defined challenges with daily tasks
- **Progress Tracking**: Weight, mood, water intake, calories logging
- **Exercise Library**: Categorized workouts with difficulty levels
- **Meal Planning**: Nigerian and Ivorian cuisine with nutritional information
- **Gamification**: Badge system for achievements and milestones

### Data Management
- **Local-First**: Data persists in localStorage for offline functionality
- **Export Capability**: JSON export of user data
- **Backup System**: Database integration for cloud backup
- **Real-time Updates**: State synchronization across components

## Data Flow

1. **User Authentication**: Currently using in-memory storage with plans for database integration
2. **Data Persistence**: Primary storage in localStorage, with database as backup/sync layer
3. **State Management**: Centralized state via React Context with reducer pattern
4. **Component Communication**: Props and context for data sharing
5. **API Communication**: RESTful endpoints for server interactions

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form
- **UI Library**: Radix UI components, Lucide React icons
- **Styling**: TailwindCSS, class-variance-authority for component variants
- **Charts**: Recharts for data visualization
- **Date Handling**: date-fns for date manipulation
- **Routing**: Wouter for client-side navigation

### Backend Dependencies
- **Server Framework**: Express.js with TypeScript support
- **Database**: Drizzle ORM, pg for PostgreSQL, Neon Database serverless
- **Development**: tsx for TypeScript execution, nodemon equivalent
- **Session Management**: express-session with connect-pg-simple
- **Validation**: Zod for runtime type checking

### Development Tools
- **Build Tools**: Vite, ESBuild, TypeScript compiler
- **Code Quality**: ESLint, Prettier (implicit)
- **Database Tools**: Drizzle Kit for migrations and schema management
- **Cloud Integration**: Replit plugins for development environment

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with HMR
- **Database**: Local PostgreSQL or Neon Database development instance
- **Environment Variables**: DATABASE_URL for database connection
- **Hot Reload**: Both frontend and backend with file watching

### Production Deployment
- **Frontend**: Static build via Vite, served by Express
- **Backend**: Node.js server with ESBuild bundling
- **Database**: Neon Database PostgreSQL instance
- **Environment**: Production NODE_ENV with optimized builds
- **Serving**: Express serves both API and static frontend files

### Build Process
1. Frontend build: `vite build` outputs to `dist/public`
2. Backend build: `esbuild` bundles server code to `dist/index.js`
3. Database: `drizzle-kit push` for schema deployment
4. Production: Single Node.js process serving both frontend and API

## Changelog

```
Changelog:
- July 07, 2025: Initial setup
- July 07, 2025: Added comprehensive progression tracking with water intake calculator, BMI calculator, and body composition analysis
- July 07, 2025: Implemented exercise timer functionality with workout phases
- July 07, 2025: Enhanced challenge management with restart functionality and task unchecking
- July 07, 2025: Rebranded app to "NaijaReset" with logo integration throughout UI
- July 07, 2025: Added CSV export functionality for all app data in Progress tab and Dashboard
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```