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

## Testing & Code Quality

### Per Task Check

- **TypeScript check**: `pnpm run typecheck`

### Pre-Commit Check

- **Format code**: `pnpm run format`
- **Check code format**: `pnpm run format:check`
- **Lint code**: `pnpm run lint`

## Code Style

- **Prettier config**: Uses OXC plugin and Tailwind CSS plugin
- **TypeScript**: Strict mode with proper interface type definitions
- **React components**: Function components + React 19 hooks
- **Naming conventions**: PascalCase for components and interfaces, camelCase for variables and functions
- **Icons**: Use Lucide React Native icon library
- **Animations**: Use React Native Reanimated

## UI & Design

- **Color scheme**: Primary color #A3FF00 (green), dark background #151718, light background #f4f4f5
- **Component library**: Gluestack UI component library
- **Styling system**: NativeWind (Tailwind CSS)
- **Layout**: Responsive design, consider different screen sizes

## State Management

- Use React 19's useState and useContext
- Avoid overcomplicating with complex state management libraries
- Keep state logic simple and predictable

## Routing

- Use Expo Router for navigation
- File-system based routing structure
- Custom bottom tab navigation support

## Debugging

- Use Chrome DevTools to debug JavaScript
- Use React DevTools to debug components
- Use console.log for basic debugging

## Pull Request Template

### PR Title Format

- Follow Conventional Commits: `<type>(<scope>): <description>`
- Types: feat, fix, docs, style, refactor, perf, test, chore
- **Must be in English**

### PR Content

- Overview of changes
- List of changes
- Related issue links
- Testing steps
- Screenshots (if UI changes)

### Commit Requirements

- **All commits must be in English**
- Follow Conventional Commits format
- Clear and concise commit messages that explain the change

---

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
