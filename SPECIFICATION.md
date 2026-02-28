# Specification: `pulse-federation`

## Overview

`pulse-federation` is a purpose-built exercise repository for the "Enterprise UI Architecture" workshop at Frontend Masters, taught by Steve Kinney. It serves **Exercise 1: Runtime Composition** — the first hands-on activity in the two-day course.

Students use this repo to experience Module Federation firsthand: wiring up a host shell and a remote analytics module, configuring shared dependencies, and solving cross-boundary communication problems. The goal is not to build something production-ready — it's to make students *feel* the operational complexity of runtime microfrontends so they can make an informed decision about whether they actually need it.

After this exercise, students move to `pulse-workshop` (a monorepo) for the remaining eight exercises. This repo is intentionally a throwaway — it exists to provide contrast.

## Product Domain

The fictional product is **Pulse** — an internal analytics/admin dashboard. The same domain is used across both repos for continuity. In this repo, only the analytics feature is implemented. The shell provides navigation and auth context; the remote provides the analytics view.

## Technical Stack

| Concern | Choice | Rationale |
|---------|--------|-----------|
| Bundler | Rsbuild (Rspack) | Modern Module Federation support, faster than Webpack 5, simpler config |
| Framework | React 18 | Industry default for enterprise UI |
| Language | TypeScript (strict) | Course teaches TypeScript scaling patterns |
| Package Manager | pnpm | Consistent with `pulse-workshop` |
| Mock API | MSW 2.x | Same mock layer used throughout the course |
| Styling | Tailwind CSS v4 | Utility-first, CSS-based configuration, consistent with `pulse-workshop` |
| Cross-boundary Comms | nanostores | Tiny, framework-agnostic, teaches the pattern cleanly |

## File Naming Convention

**All file names use kebab-case.** No PascalCase or camelCase file names anywhere.

```
✅ analytics-dashboard.tsx
✅ stats-bar.tsx
✅ auth-context.tsx
❌ AnalyticsDashboard.tsx
❌ authContext.tsx
```

Component exports inside files remain PascalCase per React convention. Only file names are kebab-cased.

## Repository Structure

```
pulse-federation/
├── README.md
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── tsconfig.base.json
├── .gitignore
├── .nvmrc
├── host/
│   ├── package.json
│   ├── tsconfig.json
│   ├── rsbuild.config.ts
│   ├── src/
│   │   ├── bootstrap.tsx
│   │   ├── index.tsx
│   │   ├── index.css
│   │   ├── app.tsx
│   │   ├── shell/
│   │   │   ├── layout.tsx
│   │   │   ├── nav.tsx
│   │   │   └── auth-provider.tsx
│   │   └── index.html
│   └── public/
│       └── favicon.svg
├── remote-analytics/
│   ├── package.json
│   ├── tsconfig.json
│   ├── rsbuild.config.ts
│   ├── src/
│   │   ├── bootstrap.tsx
│   │   ├── index.tsx
│   │   ├── index.css
│   │   ├── analytics-dashboard.tsx
│   │   ├── stats-bar.tsx
│   │   ├── chart.tsx
│   │   └── index.html
│   └── public/
│       └── favicon.svg
├── shared/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts
│       ├── types.ts
│       └── auth.ts
└── mocks/
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── handlers.ts
        ├── browser.ts
        └── data/
            ├── summary.ts
            ├── chart.ts
            └── users.ts
```

## Detailed File Specifications

### Root Files

#### `package.json`
```json
{
  "name": "pulse-federation",
  "private": true,
  "scripts": {
    "dev": "pnpm --parallel -r dev",
    "build": "pnpm -r build",
    "lint": "pnpm -r lint",
    "typecheck": "pnpm -r typecheck"
  },
  "engines": {
    "node": ">=20",
    "pnpm": ">=9"
  }
}
```

#### `pnpm-workspace.yaml`
```yaml
packages:
  - "host"
  - "remote-analytics"
  - "shared"
  - "mocks"
```

#### `tsconfig.base.json`
Shared TypeScript configuration extended by all packages:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

#### `.nvmrc`
```
20
```

### `shared/` Package

This is the contract between host and remote. Deliberately minimal.

#### `shared/src/types.ts`
```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member" | "viewer";
  avatar?: string;
}

export interface AuthContext {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface SummaryStats {
  totalUsers: number;
  activeToday: number;
  revenue: number;
  conversionRate: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export type TimeRange = "7d" | "30d" | "90d";
```

#### `shared/src/auth.ts`
Exports a simple auth context shape and event types for cross-boundary communication:
```typescript
export const AUTH_CHANNEL = "pulse:auth";

export interface AuthEvent {
  type: "login" | "logout" | "update";
  payload: AuthContext;
}
```

#### `shared/src/index.ts`
Re-exports everything from `types.ts` and `auth.ts`.

### `mocks/` Package

MSW handlers used in both host and remote during development.

#### `mocks/src/handlers.ts`
Define REST handlers with artificial delays to make streaming/loading states visible:

- `GET /api/analytics/summary` — 200ms delay, returns `SummaryStats`
- `GET /api/analytics/chart` — 800ms delay, returns `ChartDataPoint[]`
- `GET /api/analytics/chart?range=:range` — same, filtered by time range
- `GET /api/users/me` — 100ms delay, returns current `User`

The delays are intentional and should not be randomized. Students need deterministic behavior to understand what's happening.

#### `mocks/src/data/summary.ts`
Static summary data:
```typescript
export const summaryData: SummaryStats = {
  totalUsers: 12_847,
  activeToday: 3_291,
  revenue: 284_100,
  conversionRate: 0.032,
};
```

#### `mocks/src/data/chart.ts`
30 days of chart data, generated deterministically (not random). Use a simple sine wave pattern with some noise so charts look realistic but are always the same.

#### `mocks/src/data/users.ts`
A single mock user for the auth context:
```typescript
export const currentUser: User = {
  id: "usr_01",
  name: "Grace Hopper",
  email: "alex@pulse.dev",
  role: "admin",
};
```

#### `mocks/src/browser.ts`
MSW browser setup:
```typescript
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);
```

### `host/` Package

The shell application that loads the analytics remote.

#### `host/rsbuild.config.ts`
Rsbuild configuration with Module Federation plugin:
- Declares itself as the host
- Configures remote entry point: `remoteAnalytics` pointing to `remote-analytics@http://localhost:3001/remoteEntry.js`
- Shared dependencies: `react`, `react-dom` (singleton, eager in host)
- Dev server on port 3000

#### `host/src/index.css`
Tailwind v4 CSS entry point:
```css
@import "tailwindcss";
```
Imported in `bootstrap.tsx`. Each app configures Tailwind independently — no shared theme file.

#### `host/src/index.tsx`
Thin entry point that calls `import("./bootstrap")` — this is the standard Module Federation async boundary pattern. Without it, shared module negotiation fails.

#### `host/src/bootstrap.tsx`
Actual app initialization:
- Starts MSW worker in development
- Renders `<App />` into the root

#### `host/src/app.tsx`
Top-level component:
- Wraps everything in `<AuthProvider>`
- Renders `<Layout>` with the remote analytics component loaded via `React.lazy(() => import("remoteAnalytics/analytics-dashboard"))`
- Includes `<Suspense>` with a loading fallback
- Includes an `<ErrorBoundary>` around the remote import (demonstrates failure isolation)

#### `host/src/shell/auth-provider.tsx`
Provides auth context using React Context:
- Fetches `/api/users/me` on mount
- Exposes `user`, `isAuthenticated`, `login()`, `logout()` via context
- **This is where the cross-boundary communication problem lives.** The remote needs this context but can't access the React context tree since it's a separate bundle.

#### `host/src/shell/layout.tsx`
Simple layout: sidebar nav + main content area. Nothing fancy.

#### `host/src/shell/nav.tsx`
Navigation component showing the current user's name and role from auth context. Demonstrates that the host *has* the auth data.

### `remote-analytics/` Package

The independently built analytics module.

#### `remote-analytics/rsbuild.config.ts`
- Declares itself as a remote
- Exposes `./analytics-dashboard` → `./src/analytics-dashboard.tsx`
- Shared dependencies: `react`, `react-dom` (singleton)
- Dev server on port 3001

#### `remote-analytics/src/index.css`
Tailwind v4 CSS entry point (same as host):
```css
@import "tailwindcss";
```
Imported in `bootstrap.tsx`.

#### `remote-analytics/src/analytics-dashboard.tsx`
Main component that composes `<StatsBar>` and `<Chart>`:
- Fetches data from `/api/analytics/summary` and `/api/analytics/chart`
- Accepts an optional `timeRange` prop
- **Problem for students to discover:** This component needs the current user's auth token to make API calls, but it has no access to the host's auth context.

#### `remote-analytics/src/stats-bar.tsx`
Renders four stat cards (total users, active today, revenue, conversion rate). Accepts `SummaryStats` as props.

#### `remote-analytics/src/chart.tsx`
Simple bar or line chart using plain SVG — no charting library. The chart itself doesn't matter — the loading behavior does.

## Exercise Flow

### Starting State

When students clone and run `pnpm install && pnpm dev`:
- Host runs on `http://localhost:3000`
- Remote runs on `http://localhost:3001`
- The host shell renders with nav showing the current user
- The analytics remote loads inside the host via Module Federation
- **But**: The analytics dashboard makes API calls without an auth token, and there's no way for it to know who the current user is

### What Students Do

The README walks them through four steps:

**Step 1: Explore the federation setup** (~10 min)
- Read the Rsbuild configs for host and remote
- Understand `exposes`, `remotes`, `shared`
- Open browser devtools network tab, find `remoteEntry.js`
- See the separate bundles loading

**Step 2: Configure shared dependency negotiation** (~10 min)
- Examine what happens when the host and remote declare different React versions in `shared`
- Set `singleton: true` and `requiredVersion` to resolve it
- See what happens when `strictVersion: true` fails (version mismatch error in console)

**Step 3: Discover the auth context problem** (~10 min)
- The analytics dashboard needs the current user but can't access the host's React context
- Try the naive approach (exporting context from shared) — understand why this doesn't work across bundle boundaries
- Understand that React context trees don't span federation boundaries

**Step 4: Implement cross-boundary communication** (~15 min)
- Install and configure `nanostores` (already in dependencies)
- Create a shared auth store in `shared/src/auth-store.ts`
- Have the host's `AuthProvider` write to the store
- Have the remote's `AnalyticsDashboard` read from the store
- **Stretch**: Implement the same thing with `BroadcastChannel` API as an alternative

### Completed State

After the exercise:
- The remote analytics dashboard has access to the auth context via nanostores
- Both host and remote share a single React instance
- Students understand the operational complexity: two dev servers, remote entry configuration, shared dependency negotiation, cross-boundary state management

## README.md Structure

The README should follow this structure:

```markdown
# Pulse Federation — Exercise 1: Runtime Composition

## What You're Doing

[One paragraph: You're wiring up a host shell and a remote analytics module
using Module Federation. The goal is to feel the moving parts of runtime
composition — shared dependency negotiation, remote entry loading, and the
cross-boundary communication problem.]

## Why It Matters

[One paragraph: Runtime microfrontends give teams independent deploys but
come with real operational costs. You need to experience those costs
firsthand to make an informed architectural decision.]

## Prerequisites

- Node.js 20+
- pnpm 9+

## Setup

\```bash
git clone <repo-url>
cd pulse-federation
pnpm install
pnpm dev
\```

Open http://localhost:3000 (host) and http://localhost:3001 (remote standalone).

## Step 1: Explore the Federation Setup

[Detailed walkthrough with specific files to open, what to look for in
devtools, code blocks showing the relevant config sections]

### Checkpoint
You should see the analytics dashboard loading inside the host shell.
Open Network tab — look for `remoteEntry.js` loading from port 3001.

## Step 2: Shared Dependency Negotiation

[Walk through modifying shared config, seeing version conflicts, resolving them]

### Checkpoint
Console should be clean — no shared module warnings. Only one copy of
React is loaded (verify in React DevTools).

## Step 3: The Auth Context Problem

[Guide them to discover the problem, try the naive approach, understand why
it fails]

### Checkpoint
You should see that the analytics dashboard renders but has no access to
the current user. The API calls go out without an auth token.

## Step 4: Cross-Boundary Communication

[Step-by-step implementation of nanostores-based solution]

### Checkpoint
The analytics dashboard now shows "Viewing as: Grace Hopper (admin)" and
API calls include the auth token.

## Stretch Goals

- Implement the same solution using BroadcastChannel API instead of nanostores
- Add an error boundary in the host that catches remote load failures
- Simulate the remote being down (stop the remote dev server) and see
  what happens in the host

## Solution

The completed implementation is on the `solution` branch:
\```bash
git checkout solution
\```

## What's Next

You've felt the operational overhead of runtime composition. In the next
exercise, you'll take this same analytics module and consume it as a
regular package in a monorepo — no federation, no remote entry, no shared
dependency negotiation. Same product, radically simpler architecture.
```

## Branches

| Branch | Purpose |
|--------|---------|
| `main` | Starting state — everything wired up except auth communication |
| `solution` | Completed exercise with nanostores implementation |

## Acceptance Criteria

### Setup & Running
- [ ] `pnpm install` completes without errors
- [ ] `pnpm dev` starts both host (port 3000) and remote (port 3001)
- [ ] Host shell renders with navigation and user info
- [ ] Remote analytics loads inside the host via Module Federation
- [ ] Standalone remote works independently at `http://localhost:3001`
- [ ] `pnpm build` produces valid production builds for both apps
- [ ] `pnpm typecheck` passes with no errors
- [ ] `pnpm lint` passes with no errors

### Module Federation
- [ ] `remoteEntry.js` is served from the remote at port 3001
- [ ] Host loads remote's `analytics-dashboard` component dynamically
- [ ] React is shared as a singleton — only one instance loads (verify via React DevTools or bundle analysis)
- [ ] If the remote is stopped, the host shows an error boundary fallback (not a blank screen or crash)

### Mock API
- [ ] MSW intercepts API calls in the browser
- [ ] `/api/analytics/summary` returns data after ~200ms
- [ ] `/api/analytics/chart` returns data after ~800ms
- [ ] `/api/users/me` returns the current user after ~100ms
- [ ] No real network requests leave the browser

### Exercise Flow
- [ ] On `main` branch: auth context is NOT available in the remote (the bug students need to fix)
- [ ] On `solution` branch: auth context IS available via nanostores
- [ ] The nanostores package is already in dependencies (students don't need to install it)
- [ ] `shared/src/auth-store.ts` does NOT exist on `main` (students create it)
- [ ] `shared/src/auth-store.ts` EXISTS on `solution` with working implementation

### Code Quality
- [ ] All file names are kebab-case (no PascalCase or camelCase file names)
- [ ] TypeScript strict mode enabled everywhere
- [ ] No `any` types
- [ ] All components have explicit return types or are inferrable
- [ ] Imports use the `@pulse/shared` and `@pulse/mocks` workspace aliases
- [ ] Tailwind CSS used for all styling (no inline styles, no separate CSS files)

### README
- [ ] README.md exists with complete exercise walkthrough
- [ ] All four steps have clear instructions and checkpoints
- [ ] Code blocks are accurate and match the actual file paths
- [ ] Setup instructions work from a fresh clone
- [ ] Stretch goals section exists
- [ ] Solution branch reference is documented

## Dependencies (Pinned Versions)

Use current stable versions at time of creation. Key dependencies:

**Root:**
- `typescript` ^5.5
- `@types/react` ^18
- `@types/react-dom` ^18

**Host and Remote:**
- `react` ^18.3
- `react-dom` ^18.3
- `@rsbuild/core` (latest stable)
- `@rsbuild/plugin-react` (latest stable)
- `@module-federation/rsbuild-plugin` (latest stable)
- `tailwindcss` ^4
- `@tailwindcss/postcss` ^4

**Mocks:**
- `msw` ^2.4

**Shared (cross-boundary comms — pre-installed but unused on main):**
- `nanostores` ^0.11
- `@nanostores/react` ^0.8

## Notes for Implementation

1. **Keep it minimal.** This repo should be cloneable and runnable in under 2 minutes. No complex build steps, no database, no real backend.

2. **The "bug" on main must be obvious.** When students open the analytics dashboard, there should be a visible indicator that auth context is missing — e.g., a "Not authenticated" badge, or API calls visibly failing with 401s that MSW returns when no token is present.

3. **Don't over-style.** Tailwind utility classes should be clean enough that the UI isn't embarrassing on a projector, but this isn't a design exercise. Basic card layouts, readable typography, a dark or light theme that's consistent. Spend minimal time on styling.

4. **The remote should work standalone.** Visiting `http://localhost:3001` directly should render the analytics dashboard in a basic wrapper (without the host shell). This helps students understand that remotes are independent applications.

5. **Rsbuild over Webpack.** Rsbuild's Module Federation support is cleaner and faster. Students shouldn't spend 10 minutes waiting for Webpack to compile. If Rsbuild's MF plugin has any sharp edges, document workarounds in the README.

6. **Error boundary is pre-built.** The host should already have an error boundary wrapping the remote import. Students shouldn't need to implement error handling — they should just see it work (and can test it by stopping the remote dev server as a stretch goal).
