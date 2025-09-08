# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

**QueueTie** is a distributed queue management system built as a TypeScript monorepo. The architecture consists of:

### Services

- **Gateway** (3000): API gateway with WebSocket support for real-time communication
- **Dispatcher** (4000): Job dispatching and orchestration service
- **Worker** (5000): Job processing service with BullMQ integration
- **Dashboard** (5173): React frontend for monitoring and management
- **Monitor** (8000): Bull Board interface for queue inspection

### Monorepo Structure

```
apps/
├── gateway/         # NestJS API gateway
├── dispatcher/      # NestJS job dispatcher
├── worker/          # NestJS job worker
└── dashboard/       # React + Vite frontend

libs/                # Shared libraries with @queuetie/* namespace
├── bullmq/         # Queue abstractions
├── config/         # Environment configuration
├── event/          # Event handling
├── pino/           # Structured logging
├── redis/          # Redis connections
└── types/          # Shared TypeScript types
```

## Technology Stack

**Backend**: NestJS 11.x, BullMQ, Redis, Socket.IO, Pino logging
**Frontend**: React 19.x, Material-UI v7, TanStack Query, Vite, Vitest
**Development**: TypeScript, ESLint, Prettier, Storybook, Docker Compose

## Essential Commands

### Backend Development

```bash
# Service development with debugging
npm run remote:gateway              # Gateway (debug port 9229)
npm run remote:dispatcher           # Dispatcher
npm run remote:worker              # Worker

# Testing and quality
npm test                           # Jest backend tests
npm run lint                       # ESLint all TypeScript
npm run format                     # Prettier formatting
```

### Frontend Development

```bash
npm run start:dashboard            # Vite dev server (port 5173)
npm run test:dashboard             # Vitest tests
npm run test:dashboard:ui          # Vitest with UI
npm run build:dashboard            # Production build
npm run storybook                  # Component development
```

### Production

```bash
npm run build                      # Build all services
docker-compose up                  # Full stack with Redis
```

## Development Conventions

### Library System

- Shared libraries use `@queuetie/*` namespace with path mapping
- Generate new libs: `nest g lib <name>` (automatically prefixed)
- Each library has dedicated tsconfig and index.ts entry point

### Code Quality

- **Testing**: Focus on new functionality, not framework code
- **Commits**: Conventional commits with commitlint validation
- **Pre-commit**: Automated testing and formatting via husky
- **ESLint**: Separate configurations for React/Node contexts

### Frontend Patterns

- **State Management**: React Context + TanStack Query
- **UI Components**: Material-UI with custom theme support
- **Component Development**: Storybook for documentation/testing
- **Drag & Drop**: @dnd-kit for sortable interfaces

### Backend Patterns

- **Modular Architecture**: Feature-based NestJS modules
- **Event-Driven**: Cross-service communication via event emitters
- **Configuration**: Environment-based config with class-validator
- **Logging**: Structured logging with Pino across all services

## Special Configurations

### TypeScript Path Mapping

All `@queuetie/*` libraries are mapped in tsconfig for clean imports:

```typescript
import { RedisService } from '@queuetie/redis';
import { QueueEvents } from '@queuetie/event';
```

### Testing Setup

- **Jest**: Backend with coverage and path mapping
- **Vitest**: Frontend with jsdom and React Testing Library
- **Dashboard**: `npm run test:dashboard` for React component tests
- **Storybook**: Component tests disabled due to browser issues

### Docker Development

Services are containerized with volume mounting for live development. Use `docker-compose up` for full stack or target specific services.

## Important Notes

- Don't write tests for framework or vendor functionalities per say. Focus on new functionality brought by the component or service
- Dashboard tests ignore framework vendor code per project guidelines
- All services support hot reload in development mode
- Redis is required for BullMQ queue functionality
