# Pulse Federation — Exercise 1: Runtime Composition

## What You're Doing

You're wiring up a host shell and a remote analytics module using Module Federation. The host application (port 3000) loads the analytics dashboard from a separately built and served remote (port 3001) at runtime. Along the way you'll configure shared dependency negotiation, discover that React Context can't cross federation boundaries, and solve the cross-boundary communication problem using nanostores.

## Why It Matters

Runtime microfrontends give teams independent builds and deploys — but they come with real operational costs. Two dev servers, remote entry manifests, shared dependency negotiation, cross-boundary state management. You need to experience those costs firsthand so you can make an informed architectural decision about whether you actually need runtime composition or whether build-time composition (Exercise 2) is the better fit.

## Prerequisites

- Node.js 20+
- pnpm 9+

## Setup

```bash
git clone <repo-url>
cd pulse-federation
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) (host) and [http://localhost:3001](http://localhost:3001) (remote standalone).

---

## Step 1: Explore the Federation Setup

Start by understanding how Module Federation connects the host and remote.

### What to Look At

1. Open `host/rsbuild.config.ts` and find the `remotes` configuration:

```typescript
remotes: {
  remoteAnalytics:
    "remoteAnalytics@http://localhost:3001/mf-manifest.json",
},
```

This tells the host where to find the remote's module manifest at runtime.

2. Open `remote-analytics/rsbuild.config.ts` and find the `exposes` configuration:

```typescript
exposes: {
  "./analytics-dashboard": "./src/analytics-dashboard",
},
```

This declares which modules the remote makes available to consumers.

3. Open `host/src/app.tsx` to see the dynamic import:

```typescript
const AnalyticsDashboard = React.lazy(
  () => import("remoteAnalytics/analytics-dashboard"),
);
```

The host loads the remote's component lazily at runtime — it's not bundled into the host's build.

4. Open `host/src/index.tsx` — notice it's just `import("./bootstrap")`. This async boundary is required for Module Federation's shared module negotiation to work. Without it, eager shared modules fail to resolve.

### Explore in the Browser

1. Open [http://localhost:3000](http://localhost:3000)
2. Open DevTools → **Network** tab
3. Look for `mf-manifest.json` loading from port 3001
4. You'll also see chunk files loaded from the remote — these are the analytics dashboard's code, served from the remote's dev server

### Checkpoint

You should see the analytics dashboard loading inside the host shell. The sidebar shows "Alex Rivera / admin" and the main area shows the analytics view with stat cards and a chart. In the Network tab, you can see `mf-manifest.json` and chunk files coming from `localhost:3001`.

---

## Step 2: Shared Dependency Negotiation

Both the host and remote use React. Without shared dependency configuration, each would bundle its own copy — which breaks hooks, context, and everything else that depends on a single React instance.

### What to Look At

1. In both `rsbuild.config.ts` files, find the `shared` configuration:

```typescript
shared: {
  react: { singleton: true, eager: true },
  "react-dom": { singleton: true, eager: true },
  // ...
},
```

- **`singleton: true`** — Only one copy of React loads, even if the host and remote declare different versions
- **`eager: true`** (host only) — The host loads React immediately rather than waiting for the remote. The remote does *not* set `eager: true` because it relies on the host having already provided React

2. **Experiment:** Try temporarily removing `singleton: true` from the remote's React shared config, then reload. You may see React errors about multiple copies or hooks violations. Add it back.

3. **Experiment:** Add `requiredVersion` and `strictVersion` to see what happens when versions conflict:

```typescript
react: {
  singleton: true,
  requiredVersion: "^18.0.0",
  strictVersion: true,
},
```

With `strictVersion: true`, Module Federation throws an error if the provided version doesn't satisfy `requiredVersion`. This is how you catch version drift between independently deployed remotes.

### Checkpoint

Console should be clean — no shared module warnings. Only one copy of React is loaded. If you have React DevTools installed, you'll see a single React tree spanning both host and remote components.

---

## Step 3: The Auth Context Problem

Now look at the analytics dashboard more carefully. Something is wrong.

### Spot the Bug

1. Look at the **sidebar navigation** — it shows "Alex Rivera" with role "admin". The host has auth data.
2. Look at the **analytics dashboard** header — it shows an amber **"Not authenticated"** badge. The remote does *not* have auth data.

### Why This Happens

Open `host/src/shell/auth-provider.tsx`. The host fetches the current user from `/api/users/me` and provides it via React Context:

```typescript
const AuthContext = createContext<AuthContextType>({ ... });

export function AuthProvider({ children }) {
  // Fetches user, provides via context
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

Now open `remote-analytics/src/analytics-dashboard.tsx`. Look at lines 14–16:

```typescript
// THE BUG: This component has no access to the host's auth context.
const isAuthenticated = false;
const userName: string | null = null;
```

The remote has no way to access the host's React Context. Even though `<AnalyticsDashboard />` renders *inside* the host's `<AuthProvider>`, the component code was *built separately*. React Context doesn't cross Module Federation boundaries — the remote's React module resolution sees a different context object than the host's.

### Try the Naive Fix (It Won't Work)

You might think: "Export the context from `@pulse/shared` and import it in both places." Try it mentally — even if both sides import the same context definition, React Context identity is based on the *module instance*, not the type. With Module Federation, the host and remote resolve modules independently, so they get different context instances.

### Checkpoint

You understand why the analytics dashboard shows "Not authenticated" — React Context trees don't span federation boundaries. The host has auth data but the remote can't access it through React's built-in mechanisms.

---

## Step 4: Cross-Boundary Communication

The solution is to use a framework-agnostic state management library that both the host and remote can share. `nanostores` is already installed in `@pulse/shared` — you just need to create the store and wire it up.

### 4a: Create the Auth Store

Create a new file `shared/src/auth-store.ts`:

```typescript
import { atom } from "nanostores";
import type { AuthContext } from "./types";

export const authStore = atom<AuthContext>({
  user: null,
  isAuthenticated: false,
  token: null,
});
```

Then add the export to `shared/src/index.ts`:

```typescript
export * from "./types";
export * from "./auth";
export * from "./auth-store";
```

### 4b: Write to the Store from the Host

Open `host/src/shell/auth-provider.tsx`. Import the store and update it when auth state changes.

Add this import at the top:

```typescript
import { authStore } from "@pulse/shared";
```

Inside the `useEffect`, after setting the user and token state, write to the nanostore:

```typescript
setUser(data);
setToken("mock-jwt-token-" + data.id);
authStore.set({
  user: data,
  isAuthenticated: true,
  token: "mock-jwt-token-" + data.id,
});
```

### 4c: Read from the Store in the Remote

Open `remote-analytics/src/analytics-dashboard.tsx`. Replace the hardcoded auth values with the nanostore.

Add these imports:

```typescript
import { useStore } from "@nanostores/react";
import { authStore } from "@pulse/shared";
```

Inside the component, replace the hardcoded lines:

```typescript
// Remove these:
// const isAuthenticated = false;
// const userName: string | null = null;

// Replace with:
const auth = useStore(authStore);
const isAuthenticated = auth.isAuthenticated;
const userName = auth.user?.name ?? null;
```

### Why This Works

`nanostores` is configured as a **singleton shared dependency** in both rsbuild configs. This means the host and remote share the exact same nanostore instance at runtime. When the host writes to `authStore`, the remote's `useStore(authStore)` hook sees the update immediately — because they're literally the same object in memory.

This is the key insight: **framework-agnostic state (nanostores, BroadcastChannel, custom events) crosses boundaries that framework-specific state (React Context) cannot.**

### Checkpoint

The analytics dashboard now shows a green **"Viewing as: Alex Rivera"** badge instead of the amber "Not authenticated" badge. The auth context flows from the host to the remote through the shared nanostore.

---

## Stretch Goals

- **BroadcastChannel alternative:** Implement the same cross-boundary communication using the browser's `BroadcastChannel` API instead of nanostores. This works across browser tabs too, not just federation boundaries.
- **Error boundary testing:** Stop the remote dev server (`Ctrl+C` in its terminal) and reload the host. You should see the error boundary fallback: "Failed to load Analytics. Make sure the remote is running on port 3001."
- **Standalone remote:** Visit [http://localhost:3001](http://localhost:3001) directly. The analytics dashboard works independently with its own MSW mock data — it doesn't need the host at all.

---

## Solution

The completed implementation is on the `solution` branch:

```bash
git checkout solution
```

---

## What's Next

You've felt the operational overhead of runtime composition: two dev servers, remote entry manifests, shared dependency negotiation, cross-boundary state management. In the next exercise, you'll take this same analytics module and consume it as a regular package in a monorepo — no federation, no remote entry, no shared dependency negotiation. Same product, radically simpler architecture.
