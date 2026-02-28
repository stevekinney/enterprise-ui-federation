# Dry-Run Journal — Federation Auth Exercise

**Branch:** `main` (starting state)
**Date:** 2026-02-28
**Approach:** Following the README exactly as a first-time student, recording all friction.

---

## Setup

### What the README said

```bash
git clone <repo-url>
cd enterprise-ui-federation
pnpm install
pnpm dev
```

Then open `http://localhost:3000` (host) and `http://localhost:3001` (remote standalone).

### What I did

Checked out `main`, ran `pnpm install`. Install completed cleanly — lockfile was current, no resolution step needed. The postinstall script ran `msw init` for both `host/public` and `remote-analytics/public`.

Ran `pnpm dev`. On the first attempt, ports 3000 and 3001 were already occupied by a prior session. Rsbuild fell back to port 3002 for both servers, then Module Federation crashed immediately on the host:

```
[ Module Federation Dev Server ] Error listen EADDRINUSE: address already in use 0.0.0.0:3002
[ Module Federation Dev Server ] Error Process uncaughtException, mf server will exit...
```

The fix was to kill the prior processes (`lsof -ti:3000,3001,3002 | xargs kill -9`) and re-run `pnpm dev`. After that both servers started cleanly:

- Remote: `http://localhost:3001` ✓
- Host: `http://localhost:3000` ✓

### Baseline typecheck

```
pnpm typecheck → all 4 packages: Done (no errors)
```

### Checkpoint result

- `http://localhost:3000`: Sidebar shows "Grace Hopper" / "admin", "Not authenticated" amber badge, stat cards and chart all render ✓
- `http://localhost:3001`: Standalone "Analytics (Standalone)" heading, "Not authenticated" badge, stat cards and chart all render ✓

**Pace:** Quick, once the port-conflict issue was resolved. The port conflict itself was a surprise — nothing in the README warns about it. A student who has been experimenting and has a stale server process running will hit this cold.

---

## Step 1: Explore the Federation Setup

### What the README said

Open four files and find specific configs:
1. `host/rsbuild.config.ts` → find `remotes` config
2. `remote-analytics/rsbuild.config.ts` → find `exposes` config
3. `host/src/app.tsx` → find the `React.lazy` dynamic import
4. `host/src/index.tsx` → note that it's just `import("./bootstrap")`

Then open `http://localhost:3000`, check DevTools → Network tab for `mf-manifest.json` from port 3001, and verify chunk files loaded from the remote.

### What I did

Read all four files. All code snippets in the README matched the actual files exactly.

Loaded `http://localhost:3000`, captured network requests. Confirmed:
- `GET http://localhost:3001/mf-manifest.json` → 200 ✓
- API requests all returned 200 ✓

### Checkpoint result

Passed. Dashboard loaded with sidebar, analytics content, "Not authenticated" badge. `mf-manifest.json` visible in network traffic from port 3001.

**One small discrepancy:** The checkpoint says *"The sidebar shows 'Grace Hopper / admin'"* but the actual UI renders "Grace Hopper" on one line and "admin" below it in smaller text — not separated by a slash. Minor wording mismatch.

**Pace:** Quick. Files match README snippets exactly. No ambiguity.

---

## Step 2: Shared Dependency Negotiation

### What the README said

Read the `shared` config in both rsbuild files, understand `singleton: true` and `eager: true`. Then perform two experiments:

**Experiment 1:** Remove `singleton: true` from remote's React config only. Reload `localhost:3000`. Observe no visible change (host's singleton declaration takes precedence). Restore before continuing.

**Experiment 2:** Add `requiredVersion: "^19.0.0"` and `strictVersion: true` to remote's React config. Reload `localhost:3001`. Observe an error. Restore before continuing.

### What I did

Read both config files — they matched the README snippets exactly.

**Experiment 1:** Removed `singleton: true` from the remote's `react` entry. Waited for hot reload. Reloaded `localhost:3000`. Result: no visible change — exactly as the README predicts. Restored `singleton: true`.

**Experiment 2:** Added `requiredVersion: "^19.0.0"` and `strictVersion: true` to remote's `react` entry. Reloaded `localhost:3001`. Result: completely blank white page. No UI rendered at all. Console shows three errors:

```
loadShareSync failed! The function should be ...
The original error message is as follows:
Error: [ Federation Runtime ]: Version 18.3.1 from remoteAnalytics doesn't meet the requirements of...
```

The experiment works — Module Federation correctly rejects version 18.3.1 against the `^19.0.0` requirement. But the user-visible result is a blank page with no error message rendered in the browser UI.

Restored both config fields. Ran `pnpm typecheck` → all clean.

### Checkpoint result

"Console should be clean — no shared module errors." After restore: ✓

**Notable friction:** The README says "try reloading `http://localhost:3001`" for Experiment 2 but says nothing about *what you'll see*. The result — a blank white page — looks like a crash with no feedback, not an intentional outcome. A student might think they misapplied the config and undo it before the experiment registers. The error is only in the DevTools console. The README should tell students to look in the console and describe the blank page as expected.

**Pace:** Quick for reading. Moderate for Experiment 2 — the blank page result requires knowing to open DevTools to see the payoff.

---

## Step 3: The Auth Context Problem

### What the README said

Observe the contrast: sidebar shows "Grace Hopper" while analytics header shows "Not authenticated". Open `host/src/shell/auth-provider.tsx` to see how auth is provided via React Context. Open `remote-analytics/src/analytics-dashboard.tsx` to see the hardcoded `isAuthenticated = false` and `userName = null`.

Understand why: React Context doesn't cross Module Federation boundaries because the remote's React module resolution uses a different context object instance.

### What I did

Read both files. The hardcoded values match exactly what the README shows:

```typescript
// THE BUG: This component has no access to the host's auth context.
// It cannot read the current user or auth token.
// On the main branch, this is intentionally broken.
const isAuthenticated = false;
const userName: string | null = null;
```

The `auth-provider.tsx` uses `createContext` and a `useEffect` to fetch `/api/users/me`. The `<AuthProvider>` wraps `<AnalyticsDashboard>` in `app.tsx` — so the dashboard is *inside* the provider's subtree, but the remote's separate module instance means it still can't access that context.

### Checkpoint result

Understanding confirmed. No code changes. Checkpoint is conceptual — the README states it as "You understand why..." which is appropriate.

**Pace:** Quick. The explanation is clear and the code confirms it.

---

## Step 4: Cross-Boundary Communication

### Step 4a: Create the Auth Store

**What the README said:** Create `shared/src/auth-store.ts` with an `atom<AuthContext>` initialized with default values. Add `export * from "./auth-store"` to `shared/src/index.ts`.

**What I did:** Created the file. The type name in `types.ts` is `AuthContext`, which matches `import type { AuthContext } from "./types"`. Updated `index.ts`.

**Typecheck after:** ✓ clean.

**Friction noted:** There's already a `shared/src/auth.ts` in the repo (exporting `AUTH_CHANNEL` and `AuthEvent`). The new file is `auth-store.ts`. The naming is close enough to cause a momentary double-take when looking at `index.ts`'s existing `export * from "./auth"` line. If a student edits `auth.ts` instead of creating `auth-store.ts`, they'll add the atom to the wrong file. The README should add a brief note distinguishing the two files.

### Step 4b: Write to the Store from the Host

**What the README said:** In `host/src/shell/auth-provider.tsx`, add a second import for `authStore` from `@pulse/shared` (separate from the existing `import type` line). Inside the `useEffect`, after the two existing `set` calls, call `authStore.set({...})`.

**What I did:** Added the runtime import and the `authStore.set(...)` call with the values shown. The placement instructions ("after setting the user and token state") are accurate — the right location is after `setToken(...)`.

**Typecheck after:** ✓ clean.

**Friction noted:** The README snippet shows:
```typescript
setUser(data);
setToken("mock-jwt-token-" + data.id);
authStore.set({ ... });
```
But a student who hasn't read the file yet doesn't know that `setUser` and `setToken` are the last two statements inside the `try` block. Showing a slightly larger code context (e.g., including the `try {` and `} catch` lines) would eliminate any guessing about insertion point.

### Step 4c: Install and Read from Store in Remote

**What the README said:** Run `pnpm --filter @pulse/remote-analytics add @nanostores/react` from the repo root. Then in `remote-analytics/src/analytics-dashboard.tsx`, add two imports and replace the hardcoded auth variables with `useStore(authStore)`.

**What I did:**

1. Ran the install command. Completed successfully. Output included a `WARN node_modules is present` message (harmless pnpm behavior).
2. Added imports for `useStore` and `authStore`.
3. Replaced the `// THE BUG` comment block and the two `const` lines with:
   ```typescript
   const auth = useStore(authStore);
   const isAuthenticated = auth.isAuthenticated;
   const userName = auth.user?.name ?? null;
   ```

**Typecheck after:** ✓ clean.

**Friction noted:** The README's "Remove all of this" block shows the code prefixed with `//` for visual illustration:
```
// // THE BUG: This component has no access to the host's auth context.
// const isAuthenticated = false;
```
This is mildly confusing — the `//` at the start is the README's way of showing "these lines are being removed," not actual code. A student could misread this as "these lines are double-commented." The note says "Remove all of this" clearly enough, but a formatting note or a diff view would be cleaner.

### Step 4 checkpoint verification

Reloaded both URLs after hot rebuild:

- `http://localhost:3000`: Green **"Viewing as: Grace Hopper"** badge ✓
- `http://localhost:3001`: Amber **"Not authenticated"** badge (expected — no host writing to the store) ✓

**Pace:** Moderate. Three sub-steps with a package install. No blockers. Hot reload picked up all changes without needing a manual server restart.

---

## Summary

The exercise works end-to-end. Every checkpoint passes. No blockers encountered (the port conflict at setup is an environment issue, not a README issue — though a note would help). TypeScript stays clean throughout.

The nanostores solution clicks satisfyingly — the green badge appearing after Step 4 is a genuine payoff moment. The localhost:3001 standalone mode correctly showing "Not authenticated" reinforces the conceptual explanation: the store only holds auth data because the host wrote it; the remote just reads whatever's there.

### What worked well

- Code snippets in the README match the actual files exactly (Steps 1 and 4c especially)
- The "why this works" explanation after Step 4c is excellent — the two bullet points about shared module singletons make the mechanism concrete
- The `localhost:3001` standalone mode works throughout the exercise, providing a reliable second URL to check
- The comment `// THE BUG` in the source file is a good landmark — students won't miss it

### What caused friction

1. **Experiment 2 (strictVersion) shows a blank page** — students need to be told to check the console
2. **4b insertion point** — the surrounding context in the code snippet is minimal; one more line of context would eliminate ambiguity
3. **Sidebar checkpoint wording** — "Grace Hopper / admin" vs the actual two-line render
4. **`auth.ts` vs `auth-store.ts` naming** — a brief parenthetical would prevent confusion
