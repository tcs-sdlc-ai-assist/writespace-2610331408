# WriteSpace implementation plan

## What we are building
WriteSpace is a browser-local single-page blogging application: guests can discover the product and recent writing, authenticated authors can create and manage their own posts, and administrators can oversee posts and local accounts. It is a Vite + React JavaScript SPA with React Router, Tailwind CSS, and `localStorage` only; no backend, API, or database will be introduced.

## Upstream and inferred architecture
- **Read:** `/discovery/PRD - WriteSpace.md`.
- **Missing:** HLD and LLD were not present. The folder-level implementation architecture below is **inferred** from the PRD’s mandatory component boundaries, routes, technologies, and four delivery stories.
- **App shape:** static SPA in `frontend/`; root-level Vercel rewrite.

## UI decision
- **Mode:** new
- **Product shape:** focused blogging workflow with a public landing surface and administrator workspace.
- **House style:** `design-modern`, constrained by the PRD’s explicit indigo, violet, pink, teal, slate, and white Tailwind system. The public hero and auth surfaces use the explicitly required gradient; ordinary application pages retain calm white/slate surfaces and a single clear focal surface per view.
- **Primitives:** public/authenticated navigation, role avatar, post card, stat card, user row, accessible labelled forms, empty/error states, responsive grids, and confirmation dialogs using native `window.confirm` as required.

## Ordered feature slices

### US-04 Foundation, local storage, and static release
**Purpose:** Establish the Vite/Tailwind project, the prescribed browser-local record model, reusable role/avatar helpers, and deployment configuration used by all later features.

#### Files
- `.gitignore` — excludes dependencies, build output, environment files, and pipeline working files.
- `README.md` — setup, local-data and demo-security notice, testing, and Vercel deployment instructions.
- `vercel.json` — required SPA rewrite only.
- `frontend/package.json` — pinned runtime, build, test, and E2E dependencies/scripts.
- `frontend/index.html` — Vite entry metadata and root node.
- `frontend/vite.config.js` — React Vite plugin configuration.
- `frontend/tailwind.config.js` — required content globs.
- `frontend/postcss.config.js` — Tailwind and Autoprefixer configuration.
- `frontend/src/index.css` — exactly the three required Tailwind directives.
- `frontend/src/utils/storage.js` — safe localStorage read/write and session helpers.
- `frontend/src/utils/auth.js` — default-admin, credential, uniqueness, and authorization helpers.
- `frontend/src/components/Avatar.jsx` — required role-specific static JSX avatars.
- `frontend/src/utils/storage.test.js` — persistence/corruption fallback and session behavior tests.
- `frontend/src/utils/auth.test.js` — default admin, registration validation, and ownership authorization tests.
- `frontend/e2e/foundation.spec.js` — live SPA shell and public landing smoke coverage.

### US-01 Public discovery and local onboarding
**Purpose:** Deliver the public landing experience, login, registration, and role-directed session entry.

#### Files
- `frontend/src/components/PublicNavbar.jsx` — sticky guest/session-aware public navigation.
- `frontend/src/components/Footer.jsx` — public footer links and current copyright year.
- `frontend/src/pages/LandingPage.jsx` — hero, CSS-only floating card, feature cards, and latest-post preview.
- `frontend/src/pages/LoginPage.jsx` — credential form, inline failure state, and redirect behavior.
- `frontend/src/pages/RegisterPage.jsx` — accessible registration validation and session creation.
- `frontend/src/App.jsx` — public route definitions and route-level auth redirects.
- `frontend/src/pages/LandingPage.test.jsx` — public CTA, empty state, and latest preview behavior tests.
- `frontend/src/pages/AuthPages.test.jsx` — login and registration happy/negative flows.
- `frontend/e2e/onboarding.spec.js` — guest registration and post-login role routing journey.

### US-02 Authenticated reading and author-owned content
**Purpose:** Deliver protected blog browsing, reading, write/edit forms, ownership limits, and deletion behavior.

#### Files
- `frontend/src/components/ProtectedRoute.jsx` — guest and administrator route gate.
- `frontend/src/components/Navbar.jsx` — responsive authenticated role navigation and logout menu.
- `frontend/src/components/BlogCard.jsx` — responsive post preview with role-limited edit affordance.
- `frontend/src/pages/Home.jsx` — newest-first authenticated blog grid and empty state.
- `frontend/src/pages/ReadBlog.jsx` — full post reader, not-found state, action visibility, deletion.
- `frontend/src/pages/WriteBlog.jsx` — create/edit form, validation, character counter, and ownership redirect.
- `frontend/src/components/BlogCard.test.jsx` — excerpt, ordering metadata, and edit authorization tests.
- `frontend/src/pages/WriteBlog.test.jsx` — create, validation, unauthorized edit, and update tests.
- `frontend/e2e/blogs.spec.js` — authenticated author creates, reads, edits, and deletes a post through the live app.

### US-03 Administrator content oversight
**Purpose:** Deliver administrator-only dashboard metrics, recent post controls, and privileged post authority.

#### Files
- `frontend/src/components/StatCard.jsx` — accessible dashboard metric card.
- `frontend/src/pages/AdminDashboard.jsx` — protected administrator dashboard, stats, quick actions, and recent posts.
- `frontend/src/pages/AdminDashboard.test.jsx` — metrics, newest-five selection, and administrator action coverage.
- `frontend/e2e/admin-dashboard.spec.js` — default-admin login and privileged content-management journey.

### US-04 Administrator account management completion
**Purpose:** Deliver account creation/deletion UI and enforce default-admin and self-deletion protections.

#### Files
- `frontend/src/components/UserRow.jsx` — responsive table/card account representation and controls.
- `frontend/src/pages/UserManagement.jsx` — administrator account form, uniqueness validation, and role-aware deletion controls.
- `frontend/src/pages/UserManagement.test.jsx` — create-user and protected-deletion branch coverage.
- `frontend/e2e/users.spec.js` — live administrator account-management journey.

## Verification
- **Slice/unit:** `cd frontend && node node_modules/vitest/vitest.mjs run <slice test paths>` → all discovered tests pass, including negative branches.
- **E2E:** `cd frontend && node node_modules/@playwright/test/cli.js test --config playwright.config.js` → all user-journey specs pass against the Vite server with no console/page errors.
- **Build:** `cd frontend && node node_modules/vite/bin/vite.js build` → exits 0 with a static `dist/` output.
- **Source preflight:** inspect source plus Playwright accessibility tree, computed font/style, rendered HTML, and screenshots for landing, write, and admin states before final E2E.

## Delivery notes
The PRD mandates `vercel.json` containing only the rewrite object, so no Docker/nginx configuration is planned. `index.css` will contain only the three mandatory Tailwind directives; all visual classes remain inline in JSX. The exact default demo credential is `admin` / `admin`; it is clearly identified as browser-local demo-only behavior in the README.