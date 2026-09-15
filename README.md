# WriteSpace

WriteSpace is a browser-local blogging SPA. Guests can discover recent writing; registered authors can publish and manage their own plain-text posts; and the built-in administrator can oversee posts and local accounts.

## Stack

- Vite + React (JavaScript / JSX)
- React Router DOM
- Tailwind CSS
- Browser `localStorage` only

There is no backend, API, remote database, or external identity provider.

## Run locally

```bash
cd frontend
npm install
node node_modules/vite/bin/vite.js
```

Open the address printed by Vite. The demo administrator is `admin` / `admin`.

## Data and security note

All accounts, sessions, and posts are stored in plaintext in this browser only. This intentional MVP design is not suitable for real passwords or sensitive content.

## Test and build

```bash
cd frontend
node node_modules/vitest/vitest.mjs run
node node_modules/vite/bin/vite.js build
```

## Deployment

`vercel.json` supplies the SPA rewrite needed for direct client-route access. Deploy from a Vercel project configured to build the `frontend` directory.

## License

Private and proprietary. All rights reserved.
