# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Backend API proxy and dotenv

This app is set up to talk to a backend REST API via a stable `/api` path in the browser. In development, the Vite dev server proxies `/api` to the backend URL you configure with dotenv.

- Configure your backend endpoint by creating a `.env` file (or `.env.development`) from the provided `.env.example`:

```
VITE_API_URL=http://localhost:8080
```

- Start the dev server. Requests to `/api/*` from the browser will be proxied to `VITE_API_URL` with the `/api` prefix removed. For example, a request to `/api/users` will hit `http://localhost:8080/users`.

- In production, the Vite proxy is not used. Choose one of:
  - Same-origin: serve the frontend and backend under the same host and route `/api` on your reverse proxy (Nginx, Caddy, etc.). The client can keep calling `/api`.
  - Cross-origin: enable CORS on the backend and set `VITE_API_URL` at build time so the client calls the backend origin directly.

See `docs/proxy-examples.md` for ready-to-use Nginx, Caddy, Netlify, Vercel, and Cloudflare examples.

### Using the API helper

There is a small helper in `src/lib/api.ts`:

- It uses `import.meta.env.VITE_API_URL` if set, otherwise falls back to `/api`.
- Exposes `api.get/post/put/patch/delete` and a lower-level `apiFetch` utility.

Example:

```ts
import { api } from './src/lib/api'

type User = { id: string; name: string }

async function loadUsers() {
  const users = await api.get<User[]>('/users')
  return users
}
```

Note: In dev, we do not rewrite the path; `/api/foo` is forwarded as `/api/foo`. Make your backend serve under `/api` or adjust the proxy accordingly.

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
