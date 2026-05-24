# Saikuru

A habit tracker app built with Expo + React Native, using local SQLite for data persistence.

## Tech Stack

- **Framework**: Expo 55, React Native 0.83, React 19
- **Routing**: expo-router (file-based)
- **Styling**: NativeWind / Tailwind CSS
- **Animation**: react-native-reanimated
- **Icons**: lucide-react-native
- **Storage**: expo-sqlite

## Project Structure

```
src/
  app/              # Routes (expo-router)
  components/       # Shared UI components
  features/         # Feature-scoped modules
  hooks/            # Custom hooks
  constants/        # Constants & config
server/
  db/               # SQLite connection
  models/           # Data models
  store/            # CRUD operations
```

## Conventions

### Git
- Do **not** read `pnpm-lock.yaml` or other lock files when analyzing diffs.
- Use conventional commits: `feat:`, `fix:`, `refactor:`, `chore:`.
- For non-trivial commits, use a concise conventional commit title followed by bullet points describing the concrete changes.

### Features
- Co-locate components, hooks, and types within a feature directory (e.g. `features/dark-mode/`).
- Keep shared components in `components/`.
- Prefer barrel exports (`index.tsx`) for feature entry points.

### Server
- SQLite via `expo-sqlite`.
- `models/` defines data shapes. `store/` implements CRUD.
- Initialize DB in `server/db/connection.ts`.

### Routing
- File-based with expo-router.
- Stack screen names are bare names: `name="dark-mode"`.
- Tab groups use `(tabs)` directory.
