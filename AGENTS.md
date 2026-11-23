<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# BookNook Client

Next.js 16 App Router frontend for a small online library. The Express/MongoDB API is a separate service (`NEXT_PUBLIC_API_URL`); there are no book/borrow endpoints in this repo.

## Commands

- `npm install` — npm + `package-lock.json` only.
- `npm run dev` — Turbopack dev server on http://localhost:3000.
- `npm run build` / `npm start` — production build / serve.
- `npm run lint` — runs `eslint` directly (there is no `next lint`).
- `npx tsc --noEmit` — typecheck; there is no `typecheck` script.
- No test runner or formatter is configured.

`PageProps` / `LayoutProps` / `RouteContext` are generated types. After adding or renaming routes, run `npx next typegen` before `tsc --noEmit` (or rely on `next dev` / `next build`). Full check: `npm run lint && npx next typegen && npx tsc --noEmit`.

## Next.js 16 quirks

- `next.config.ts` enables `cacheComponents`, `partialPrefetching`, and `reactCompiler`. Uncached data must be inside `<Suspense>` with a skeleton fallback; fetches here use `cache: "no-store"`. Do not add legacy `dynamic`, `revalidate`, `fetchCache`, or `runtime` route configs.
- `src/proxy.ts` replaces `middleware.ts` and exports `proxy`, not `middleware`. It only checks the BetterAuth session cookie on `/add-book`, `/my-books`, `/my-borrows`, `/books/:id`, and `/profile` — so book detail is login-protected. This is an optimistic gate; the API/JWT is the real authorization check.
- Pages use generated props such as `PageProps<"/books">`. `params` and `searchParams` are Promises, awaited inside the async child component.
- `src/app/books/[id]/page.tsx` sets `export const instant = false` because the id is only known at request time. Preserve it or instant-navigation validation will flag the route.
- Tailwind is v4 CSS-first (`src/app/globals.css`, no `tailwind.config.*`). `cn` is re-exported from the `cn` package in `src/lib/utils.ts`; do not replace it with the default `clsx` + `tailwind-merge` helper.
- `src/components/ui/*` is shadcn/ui in `base-nova` style built on `@base-ui/react`, not Radix.

## Auth and API flow

- BetterAuth lives in `src/lib/auth.ts` (server, MongoDB adapter on database `booknook`, JWT plugin) and `src/lib/auth-client.ts` (React client). The catch-all handler is `src/app/api/auth/[...all]/route.ts`.
- Browser mutations call `getTokenFromClient()` (`authClient.token()`) and send `Authorization: Bearer <jwt>` to `NEXT_PUBLIC_API_URL`. `getTokenFromServer()` is the equivalent for server components/route handlers.
- Public reads happen directly in server components with `cache: "no-store"` (for example `GET ${NEXT_PUBLIC_API_URL}/books`).
- API errors return `{ msg }`; `401` handlers redirect to `/login?callbackUrl=...`. Borrow/delete conflicts (`403`/`409`) are surfaced as Sonner toasts.

## Environment

Required: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_BETTER_AUTH_URL`, `MONGO_DB_URL`, `NEXT_PUBLIC_API_URL`. Google OAuth also needs both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`; social login is disabled if either is missing. `auth-client.ts` reads `NEXT_PUBLIC_BETTER_AUTH_URL` (not `BETTER_AUTH_URL`), so set both to the same origin.

## Layout

- `src/app` — routes and the BetterAuth catch-all.
- `src/components/{books,auth,home}` — feature components; `src/components/ui` — generated shadcn primitives.
- `src/lib` — auth clients and JWT token helpers.

Book categories (`Fiction`, `Science`, `History`, `Kids`, `Others`) are duplicated in `src/app/page.tsx`, `src/components/books/AddBookForm.tsx`, `src/components/books/MyBooksManager.tsx`, and `src/components/books/BooksBrowser.tsx`; update all four when changing the set.
