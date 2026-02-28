# Changes Needed — Federation Auth Exercise

| # | Issue | Step | Severity |
|---|-------|------|----------|
| 1 | strictVersion experiment shows blank page with no UI feedback | Step 2, Experiment 2 | confusing |
| 2 | Step 4b code snippet lacks enough surrounding context for insertion point | Step 4b | confusing |
| 3 | Checkpoint says "Grace Hopper / admin" but UI renders two separate lines | Step 1 Checkpoint | minor polish |
| 4 | `auth-store.ts` naming could be confused with existing `auth.ts` | Step 4a | minor polish |
| 5 | Experiment 2 code snippet doesn't show `shared:` wrapper context | Step 2, Experiment 2 | minor polish |

---

## Issue 1: strictVersion experiment shows blank page with no UI feedback

**Step:** Step 2, Experiment 2

**Severity:** confusing

**What happened:** After adding `requiredVersion: "^19.0.0"` and `strictVersion: true` to the remote's React shared config and reloading `http://localhost:3001`, the page goes completely blank. No error is rendered in the UI. The version mismatch error only appears in the browser DevTools console:

```
loadShareSync failed! The function should be ...
Error: [ Federation Runtime ]: Version 18.3.1 from remoteAnalytics doesn't meet the requirements of ...
```

**What you expected:** The README says "With `strictVersion: true`, Module Federation throws an error if the provided version doesn't satisfy `requiredVersion`." A student expects to see *something* — an error message, a crash indicator, a red screen. Instead they see nothing.

**Root cause:** Module Federation's `strictVersion` check fires at module init time and throws synchronously, preventing any React rendering from starting. There's no error boundary at this level, so the result is a silent blank page from the browser's perspective. The error only surfaces in the console.

**Suggested fix:** Update the README to tell students what they'll see and where to look:

> With `strictVersion: true`, Module Federation throws an error if the provided version doesn't satisfy `requiredVersion`. Reload `http://localhost:3001` — the page will go **blank** (React never starts), and you'll see the version mismatch error in **DevTools → Console**:
>
> ```
> Error: [ Federation Runtime ]: Version 18.3.1 from remoteAnalytics doesn't satisfy ^19.0.0
> ```
>
> This is intentional — the remote rejected the available React version before any UI could render. This is how you catch version drift between independently deployed remotes.

---

## Issue 2: Step 4b code snippet lacks enough surrounding context for insertion point

**Step:** Step 4b

**Severity:** confusing

**What happened:** The README instructs: "Inside the `useEffect`, after setting the user and token state, write to the nanostore:" and shows:

```typescript
setUser(data);
setToken("mock-jwt-token-" + data.id);
authStore.set({
  user: data,
  isAuthenticated: true,
  token: "mock-jwt-token-" + data.id,
});
```

This snippet doesn't show whether `authStore.set(...)` goes inside the `try` block, after the `finally`, or after the entire `useEffect`. A student who hasn't read `auth-provider.tsx` yet has to open the file and find the right spot through context alone.

**What you expected:** The snippet shows enough surrounding code to make the insertion point unambiguous.

**Root cause:** The snippet was written to be minimal, but the `useEffect` in `auth-provider.tsx` has a `try/catch/finally` structure, and the insertion point is inside the `try` block immediately after `setToken(...)`.

**Suggested fix:** Expand the snippet to include the `try {` line and the `} catch` boundary:

```typescript
try {
  const response = await fetch("/api/users/me");
  const data: User = await response.json();
  setUser(data);
  setToken("mock-jwt-token-" + data.id);
  authStore.set({
    user: data,
    isAuthenticated: true,
    token: "mock-jwt-token-" + data.id,
  });
} catch (error) {
  console.error("Failed to fetch current user:", error);
}
```

---

## Issue 3: Checkpoint says "Grace Hopper / admin" but UI renders two separate lines

**Step:** Step 1, Checkpoint

**Severity:** minor polish

**What happened:** The Step 1 checkpoint reads:

> You should see the analytics dashboard loading inside the host shell. The sidebar shows "Grace Hopper / admin" ...

The actual sidebar renders "Grace Hopper" on one line with "admin" below it in smaller gray text — no slash separator.

**What you expected:** Either the copy or the UI matches the checkpoint description.

**Root cause:** The checkpoint description was written as a quick summary ("Grace Hopper / admin") using a slash to denote name and role, but that punctuation doesn't appear in the rendered UI.

**Suggested fix:** Change "Grace Hopper / admin" to "Grace Hopper" with "admin" shown below it:

> The sidebar shows **"Grace Hopper"** with **"admin"** below it in gray text...

---

## Issue 4: `auth-store.ts` naming could be confused with existing `auth.ts`

**Step:** Step 4a

**Severity:** minor polish

**What happened:** The `shared/src/` directory already contains `auth.ts`, which exports `AUTH_CHANNEL` and `AuthEvent` (utilities for a BroadcastChannel implementation). The new file is `auth-store.ts`. When a student reads `shared/src/index.ts` and sees `export * from "./auth"`, they might try to add the nanostore atom to `auth.ts` instead of creating a new `auth-store.ts`.

**What you expected:** The README makes clear that a new file should be created.

**Root cause:** The README does say "Create a new file `shared/src/auth-store.ts`" which is explicit. The issue is that `auth.ts`'s existence isn't mentioned anywhere in the exercise, so a student scanning the `shared/src/` directory might be confused by the two similarly-named files.

**Suggested fix:** Add one sentence to Step 4a acknowledging the existing file:

> Create a new file `shared/src/auth-store.ts` (note: `auth.ts` already exists in that directory — it's separate utilities for BroadcastChannel, not what you need here):

---

## Issue 5: Experiment 2 code snippet doesn't show `shared:` wrapper context

**Step:** Step 2, Experiment 2

**Severity:** minor polish

**What happened:** The README shows the config snippet for Experiment 2 as:

```typescript
react: {
  singleton: true,
  eager: true,
  requiredVersion: "^19.0.0",
  strictVersion: true,
},
```

This is a property inside the `shared:` object, but the surrounding context isn't shown. A student has to infer that `react: { ... }` is a key inside `shared: { ... }` in the `pluginModuleFederation({...})` call.

**What you expected:** Either the snippet includes `shared: {` as the parent, or a prose note like "update the `react` entry inside `shared:` to include:" makes the nesting explicit.

**Root cause:** The snippet was kept minimal to focus on the two new fields being added.

**Suggested fix:** Wrap the snippet in its immediate parent context:

```typescript
shared: {
  react: {
    singleton: true,
    eager: true,
    requiredVersion: "^19.0.0",
    strictVersion: true,
  },
  // ... other shared entries unchanged
},
```
