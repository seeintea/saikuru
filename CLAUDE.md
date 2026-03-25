---
name: Saikuru Development Guide
description: Saikuru project development guidelines and best practices
type: project
---

# Saikuru Development Guide

## Setup & Development

- **Start dev server**: `pnpm start`
- **Launch Android emulator**: `pnpm run android`
- **Launch iOS simulator**: `pnpm run ios`
- **Launch web version**: `pnpm run web`
- **Install dependencies**: `pnpm install`

## Code Quality

### Per Task Check

- **TypeScript check**: `pnpm run typecheck`

## Code Style

- **TypeScript**: Strict mode with proper interface type definitions
- **React components**: Function components + React 19 hooks
- **Naming conventions**: PascalCase for components and interfaces, camelCase for variables and functions
- **Icons**: Use Lucide React Native icon library
- **Animations**: Use React Native Reanimated

## UI & Design

- **Color scheme**: Primary color #A3FF00 (green), dark background #151718, light background #f4f4f5
- **Layout**: Responsive design, consider different screen sizes

## State Management

- Use React 19's useState and useContext
- Avoid overcomplicating with complex state management libraries
- Keep state logic simple and predictable

## Project Structure & Routing

- **app/ directory**: Only contains routing logic (minimal wrapper components), does not handle page content
- **features/ directory**: Contains complete feature modules with their own `components/`, `utils/`, and `types/`
- **Naming convention**: Use kebab-case for filenames (e.g., `current-week-card.tsx`)

## Pull Request Template

- Follow Conventional Commits: `<type>(<scope>): <description>`
- Types: feat, fix, docs, style, refactor, perf, test, chore
- **Must be in English**
