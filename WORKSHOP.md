# Enterprise UI Architecture — Complete Workshop Overview

**Course:** Frontend Masters — Enterprise UI Architecture
**Instructor:** Steve Kinney
**Duration:** 2 days (9:45 AM – 4:00 PM each day, 1-hour lunch)
**Audience:** Senior frontend engineers at companies scaling beyond a single-team SPA

---

## Narrative Arc

**Day 1** answers: *"What are the architectural patterns for large-scale frontend applications?"*
Students move from monolith pain → microfrontend composition strategies → server rendering patterns → monorepo organization → API layer design. They build things, feel the trade-offs, and form opinions.

**Day 2** answers: *"How do you keep this thing alive, healthy, and evolving?"*
Students layer operational infrastructure onto the architecture from Day 1: dependency management → TypeScript scaling → linting guardrails → design system governance → performance budgets → CI/CD → testing → observability → migration patterns. The monorepo from Day 1 becomes the substrate for everything on Day 2.

**The connective thread:** A fictional product called **Pulse** — an internal analytics/admin dashboard with Analytics, Users, and Settings sections. Same domain across both repos, zero context switching.

---

## Schedule

### Day 1: Architecture Patterns

| Time | Topic | Format | Slides | Exercise |
|------|-------|--------|--------|----------|
| 9:45 | Introduction | Conceptual | `00-intro-monoliths.pptx` | — |
| 10:00 | Monoliths, Microfrontends, and Monorepos | Conceptual framing | `00-intro-monoliths.pptx` | — |
| 10:15 | Microfrontends: Runtime Composition | **Hands-on** | `01-microfrontends.pptx` | **Ex 1** → `pulse-federation` |
| 10:30 | Runtime Composition (cont.) | | | |
| 10:45 | Runtime Composition (cont.) | | | |
| 11:00 | Runtime + Cross-Boundary Communication | Nanostores, BroadcastChannel | `01-microfrontends.pptx` | |
| 11:15 | Microfrontends: Build-Time Composition | **Hands-on** (lighter) | `01-microfrontends.pptx` | **Ex 2** → `pulse-workshop` `01-build-time-start` |
| 11:30 | Build-Time Composition (cont.) | | | |
| 11:45 | App Shell + Islands Architecture | Conceptual | `02-appshell-islands-servercomponents.pptx` | — |
| 12:00 | Lunch | | | |
| 1:00 | Server Components / Streaming | **Hands-on** | `02-appshell-islands-servercomponents.pptx` | **Ex 3** → `pulse-workshop` `02-streaming-start` |
| 1:15 | Streaming (cont.) | | | |
| 1:30 | Streaming (cont.) | | | |
| 1:45 | Monorepos: pnpm Workspaces | **Hands-on** | `03-monorepos-bffs-migration.pptx` | **Ex 4** → `pulse-workshop` `03-monorepo-start` |
| 2:00 | Monorepos: Turborepo | **Hands-on** | | |
| 2:15 | Turborepo (cont.) | | | |
| 2:30 | Turborepo (cont.) | | | |
| 2:45 | Nx / Bazel Honorable Mentions | Conceptual (brief) | `03-monorepos-bffs-migration.pptx` | — |
| 3:00 | Backends for Frontends | Conceptual + design activity | `03-monorepos-bffs-migration.pptx` | — |
| 3:15 | BFFs (cont.) | | | |
| 3:30 | Strangler Fig + Migration Patterns Intro | Conceptual — bridges to Day 2 | `03-monorepos-bffs-migration.pptx` | — |
| 3:45 | Day 1 Wrap-up | Recap & preview Day 2 | `03-monorepos-bffs-migration.pptx` | — |

### Day 2: Operating & Evolving Frontend Architecture

| Time | Topic | Format | Slides | Exercise |
|------|-------|--------|--------|----------|
| 9:45 | Day 2 Introduction | Recap & framing | `04-day2-morning.pptx` | — |
| 10:00 | Dependency Management & Synchronization | Conceptual | `04-day2-morning.pptx` | — |
| 10:15 | Versioning & Release Management | Conceptual | `04-day2-morning.pptx` | — |
| 10:30 | Scaling TypeScript | **Hands-on** | `04-day2-morning.pptx` | **Ex 5** → `pulse-workshop` `04-typescript-start` |
| 10:45 | Scaling TypeScript (cont.) | | | |
| 11:00 | ESLint as Architectural Guardrails | **Hands-on** | `04-day2-morning.pptx` | **Ex 6** → `pulse-workshop` `05-linting-start` |
| 11:15 | ESLint (cont.) | | | |
| 11:30 | Design System Governance | Conceptual | `04-day2-morning.pptx` | — |
| 11:45 | Performance Budgets as Constraints | Conceptual | `04-day2-morning.pptx` | — |
| 12:00 | Lunch | | | |
| 1:00 | CI/CD with GitHub Actions | **Hands-on** | `05-day2-afternoon.pptx` | **Ex 7** → `pulse-workshop` `06-cicd-start` |
| 1:15 | CI/CD (cont.) | | | |
| 1:30 | CI/CD (cont.) | | | |
| 1:45 | Testing Complex Architectures | **Hands-on** — Playwright + MSW + HARs | `05-day2-afternoon.pptx` | **Ex 8** → `pulse-workshop` `07-testing-start` |
| 2:00 | Testing (cont.) | | | |
| 2:15 | Testing (cont.) | | | |
| 2:30 | API Contract Testing | Conceptual | `05-day2-afternoon.pptx` | — |
| 2:45 | Observability (Sentry) | Conceptual | `05-day2-afternoon.pptx` | — |
| 3:00 | Migration Patterns (deep dive) | **Hands-on** — strangler fig + codemods | `05-day2-afternoon.pptx` | **Ex 9** → `pulse-workshop` `08-migration-start` |
| 3:15 | Migration / Codemods (cont.) | | | |
| 3:30 | Migration (cont.) | | | |
| 3:45 | Course Wrap-up | ADRs & final synthesis | `05-day2-afternoon.pptx` | — |

---

## Exercises

### Exercise Map

| # | Title | Time | Repo | Branch | Duration |
|---|-------|------|------|--------|----------|
| 1 | Runtime Composition | Day 1, 10:15 | `pulse-federation` | `main` → `solution` | ~45 min |
| 2 | Build-Time Composition | Day 1, 11:15 | `pulse-workshop` | `01-build-time-start` | ~30 min |
| 3 | Server Components & Streaming | Day 1, 1:00 | `pulse-workshop` | `02-streaming-start` | ~45 min |
| 4 | Monorepo Setup (Turborepo) | Day 1, 1:45 | `pulse-workshop` | `03-monorepo-start` | ~45 min |
| 5 | Scaling TypeScript | Day 2, 10:30 | `pulse-workshop` | `04-typescript-start` | ~30 min |
| 6 | Architectural Linting | Day 2, 11:00 | `pulse-workshop` | `05-linting-start` | ~30 min |
| 7 | CI/CD Pipeline | Day 2, 1:00 | `pulse-workshop` | `06-cicd-start` | ~45 min |
| 8 | Testing Strategies | Day 2, 1:45 | `pulse-workshop` | `07-testing-start` | ~45 min |
| 9 | Strangler Fig + Codemods | Day 2, 3:00 | `pulse-workshop` | `08-migration-start` | ~45 min |

### Exercise Summaries

**Exercise 1 — Runtime Composition:** Wire up a Module Federation host shell and remote analytics module. Configure shared deps (React singleton). Discover the auth context problem (remote can't access host's React context). Solve it with nanostores. *Feel the operational complexity.*

**Exercise 2 — Build-Time Composition:** Same analytics module, now consumed as a regular `@pulse/analytics` workspace package. One dev server, instant hot reload across boundaries, TypeScript types resolve at compile time. *Feel the contrast with Exercise 1.*

**Exercise 3 — Server Components & Streaming:** The analytics dashboard hits three APIs at different speeds (200ms / 800ms / 2000ms). Implement `renderToPipeableStream`, add Suspense boundaries around each component, watch them stream in progressively. *Suspense boundaries are architectural decisions.*

**Exercise 4 — Monorepo Setup:** The workspace has multiple packages but no orchestration. Create `turbo.json`, configure the task pipeline, see `FULL TURBO` cache hits on second run. Change one package, observe only downstream packages rebuild. *Caching changes everything.*

**Exercise 5 — Scaling TypeScript:** Add `composite: true` and `references` to each package's `tsconfig.json`. Run `tsc --build`, see `.tsbuildinfo` files, observe incremental checking. Change a type in `@pulse/shared`, only downstream packages recheck. *Make `tsc` fast again.*

**Exercise 6 — Architectural Linting:** Configure `eslint-plugin-boundaries` to enforce the package dependency graph: apps → packages, packages → packages (not apps), no importing private internals. Try importing `StatsBar` directly from `@pulse/analytics/src/stats-bar` — lint error. *Encode architectural intent in tooling.*

**Exercise 7 — CI/CD Pipeline:** Build a GitHub Actions workflow using Turborepo for caching and affected detection. Add matrix parallelization per package. Add Lighthouse CI with performance budgets (LCP < 2.5s, total JS < 200KB). *Connect architecture to CI.*

**Exercise 8 — Testing Strategies:** Write Playwright E2E tests for cross-route navigation. Mock APIs with MSW. Record HAR fixtures and replay them for deterministic tests. Discuss where contract testing catches bugs these tests miss. *Architecture shapes testing strategy.*

**Exercise 9 — Strangler Fig + Codemods:** A legacy app appears. Set up routing-level coexistence (modern at `/`, legacy at `/legacy/*`). Migrate one route. Write a jscodeshift codemod that transforms legacy imports to modern `@pulse/analytics` packages. *Incremental migration, not Big Rewrites.*

---

## Repositories

### `pulse-federation`
**Purpose:** Exercise 1 only (runtime composition). Designed to be thrown away.

| Concern | Detail |
|---------|--------|
| Structure | `host/` + `remote-analytics/` + `shared/` + `mocks/` |
| Bundler | Rsbuild (Rspack) with Module Federation plugin |
| Ports | Host on 3000, Remote on 3001 |
| Key files | `rsbuild.config.ts` in host and remote |
| Branches | `main` (starting state, auth bug present) → `solution` (nanostores fix) |
| Spec | `spec-pulse-federation.md` |

### `pulse-workshop`
**Purpose:** Exercises 2–9. Evolves through git branch checkpoints.

| Concern | Detail |
|---------|--------|
| Structure | `apps/dashboard` + `apps/legacy` + `packages/{analytics,users,ui,shared}` + `mocks/` + `tests/` + `codemods/` + `docs/` |
| Bundler | Vite |
| Orchestration | Turborepo (introduced in Ex 4) |
| Key files | `turbo.json`, `eslint.config.js`, `.github/workflows/ci.yml`, `entry-server.tsx` |
| Branches | `main` (overview) → `01-build-time-start` through `08-migration-start` → `solution` |
| Spec | `spec-pulse-workshop.md` |

### Branch Checkpoint Strategy

Each branch is the **starting state** for its exercise. The next branch ≈ the completed state of the previous exercise. Students who fall behind check out the next branch and catch up instantly.

```
pulse-federation:  main ──────────────────────────────── solution
                   Ex 1                                  Ex 1 done

pulse-workshop:    main → 01-build-time-start → 02-streaming-start → 03-monorepo-start → ...
                          Ex 2                  Ex 3                 Ex 4
                   ... → 04-typescript-start → 05-linting-start → 06-cicd-start → ...
                          Ex 5                 Ex 6                Ex 7
                   ... → 07-testing-start → 08-migration-start → solution
                          Ex 8                Ex 9                 All done
```

---

## Product Domain: Pulse

Three feature areas, deliberately boring so students focus on architecture:

| Area | Data Profile | Why It Exists |
|------|-------------|---------------|
| **Analytics** | Summary stats (fast), chart (medium), data table (slow) | Drives the streaming exercise — three different API speeds make Suspense visceral |
| **Users** | User list, user detail, invite flow | CRUD operations, cross-boundary state, E2E testing targets |
| **Settings** | Org config, notifications | Shows that not everything needs to be a separate package |

### Mock API (MSW)

MSW is the only backend. No Express, no database. The mock handlers *are* the API.

| Endpoint | Delay | Purpose |
|----------|-------|---------|
| `GET /api/analytics/summary` | 200ms | Fast — stats bar streams in first |
| `GET /api/analytics/chart` | 800ms | Medium — chart streams in second |
| `GET /api/analytics/table` | 2000ms | Slow — table streams in last |
| `GET /api/users` | 400ms | User list |
| `GET /api/users/:id` | 300ms | User detail |
| `GET /api/users/me` | 100ms | Current user / auth context |
| `POST /api/users/invite` | 500ms | Invite flow |
| `GET /api/settings` | 200ms | Org settings |

Delays are deterministic (no randomization). All fixture data is static and generates identical results every run.

---

## Slide Decks (Completed)

All decks use a consistent dark navy theme (`#0B1120` background) with teal/purple/amber/cyan accent palette.

| File | Content |
|------|---------|
| `00-intro-monoliths.pptx` | Title, course overview, the monolith starting point, why architecture matters at scale |
| `01-microfrontends.pptx` | Runtime composition (Module Federation), cross-boundary communication, build-time composition, decision framework |
| `02-appshell-islands-servercomponents.pptx` | App Shell pattern, Islands Architecture, Server Components & streaming with React primitives |
| `03-monorepos-bffs-migration.pptx` | Monorepos (pnpm → Turborepo → Nx/Bazel), BFFs (standalone + integration patterns), Strangler Fig intro, Day 1 wrap-up |
| `04-day2-morning.pptx` | Day 2 intro, dependency management, versioning (Changesets), TypeScript scaling, ESLint guardrails, design system governance, performance budgets |
| `05-day2-afternoon.pptx` | CI/CD (GitHub Actions + Turborepo), testing strategies (Playwright + MSW + HARs), contract testing, observability (Sentry), migration patterns (strangler fig + codemods), course wrap-up with ADRs |

---

## Technical Stack (Across Both Repos)

| Concern | Choice |
|---------|--------|
| Package Manager | pnpm 9+ with workspaces |
| Node | 20+ |
| Framework | React 18 |
| Language | TypeScript (strict mode, no `any`) |
| Routing | React Router 6 |
| Bundler | Rsbuild (federation repo), Vite (workshop repo) |
| Build Orchestration | Turborepo |
| Mock API | MSW 2.x |
| Styling | CSS Modules |
| Linting | ESLint 9 (flat config) + eslint-plugin-boundaries |
| Testing (E2E) | Playwright |
| Testing (Unit) | Vitest |
| CI | GitHub Actions |
| Codemods | jscodeshift |

---

## Conventions

- **File names:** All kebab-case (`analytics-dashboard.tsx`, not `AnalyticsDashboard.tsx`)
- **Component exports:** PascalCase per React convention
- **Package names:** `@pulse/analytics`, `@pulse/ui`, `@pulse/shared`, `@pulse/users`
- **Package resolution:** Internal packages use `"main": "./src/index.ts"` (source imports, no build step during dev)
- **Public API:** Only `index.ts` exports are public. Importing `@pulse/analytics/src/stats-bar` is a lint violation.

---

## Lecture-Only Topics (No Dedicated Exercise)

These topics reference `pulse-workshop` as a concrete example but don't have their own exercise branches:

| Topic | Where It Lands | How Pulse Is Referenced |
|-------|---------------|----------------------|
| App Shell | Day 1, 11:45 | "The dashboard layout is an app shell — here's how it works" |
| Islands Architecture | Day 1, 11:45 | Conceptual comparison to Pulse's SPA approach |
| Nx / Bazel | Day 1, 2:45 | Brief mention as alternatives to Turborepo |
| BFFs | Day 1, 3:00 | Design activity: "Where would you put a BFF in front of Pulse?" |
| Dependency Management | Day 2, 10:00 | "How do you prevent 43 versions of React across Pulse's packages?" |
| Versioning / Changesets | Day 2, 10:15 | "How would you release `@pulse/ui` with a breaking change?" |
| Design System Governance | Day 2, 11:30 | `@pulse/ui` as the concrete example |
| Performance Budgets | Day 2, 11:45 | Lighthouse CI config from Ex 7 as the enforcement mechanism |
| API Contract Testing | Day 2, 2:30 | Discussion: where would Pact catch bugs MSW missed? |
| Observability | Day 2, 2:45 | Where would you instrument Pulse with Sentry? Error boundaries as arch decisions |
| ADRs | Day 2, 3:45 | "Document the architectural decisions you made over these two days" |

---

## What's Built vs. What's Left

### ✅ Completed
- Full two-day schedule with time allocations
- 6 slide decks covering all topics
- Exercise inventory (9 exercises mapped to repos and branches)
- Repository structure design (2 repos, file trees, branch strategy)
- Package architecture and dependency graph
- Mock API design with tuned delays
- Documentation structure (per-branch README, `docs/` folder)
- Comprehensive implementation spec for `pulse-federation` (`spec-pulse-federation.md`)
- Comprehensive implementation spec for `pulse-workshop` (`spec-pulse-workshop.md`)

### 🔲 Remaining
- **Build `pulse-federation` repo** — implement the spec, both branches
- **Build `pulse-workshop` repo** — implement the spec, all 9 branches
- **Write exercise walkthrough docs** (`docs/01-build-time.md` through `docs/08-migration.md`)
- **Write README content** (root README per branch, `pulse-federation` README)
- **QA pass** — verify every branch is a self-contained starting point, all acceptance criteria met
- **Test the exercises** — follow each walkthrough from scratch, confirm checkpoints work