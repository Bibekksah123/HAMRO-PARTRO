# MeroDin

MeroDin is a lightweight Nepal-focused everyday utility for Nepali dates, festivals, calculators, and personal tools.

## Requirements

- Bun 1.3 or newer
- Node.js 20.9 or newer (required by Next.js)

## Getting started

```sh
bun install
bun dev
```

The web app runs at <http://localhost:3000>.

## Workspace commands

```sh
bun build
bun lint
bun typecheck
bun test
bun format
```

The root test command runs Bun's test runner across the workspace. The workspace packages are intentionally independent and can add tests as their business logic is introduced.

Install Playwright's browser once with `bunx playwright install chromium`, then run browser-level checks with `bun run test:e2e`. These verify BS date conversion and PWA files without a backend. To run the login and personal-tool scenarios, set `E2E_EMAIL` and `E2E_PASSWORD` to a dedicated test account in a configured Supabase project; those scenarios create and then delete their test records.

## Supabase and PostgreSQL

1. Create a Supabase project and copy the project URL and publishable (or legacy anon) key into `apps/web/.env.local` using `.env.example`. Root Bun commands also load an optional repository-root `.env` file, which is convenient for the whole workspace.
2. Set `DATABASE_URL` to the Supabase PostgreSQL connection string. The application uses Drizzle with the `postgres` driver; use a pooler URL for the web runtime when the host needs pooled connections.
3. Apply the initial database schema from the repository root:

   ```sh
   cd packages/db
   bun run db:migrate
   ```

   The migration creates the app tables and owner-only row-level security policies. It references Supabase's existing `auth.users` table and does not create or modify Supabase-managed auth tables.

4. In Supabase Auth settings, allow the local callback `http://localhost:3000/auth/callback` and your deployed callback URL. Configure Google OAuth in the Supabase dashboard before enabling Google sign-in.

The migration command loads `DATABASE_URL` from the repository-root `.env` when present; otherwise, make it available in the shell. Public calendar, date, festival, holiday, and calculator routes do not require Supabase configuration.

Set `NEXT_PUBLIC_SITE_URL` to the deployed site's HTTPS origin (for example, `https://your-domain.example`) in the build environment. This value is used for absolute canonical URLs, Open Graph URLs, and the sitemap. If it is missing, the sitemap stays empty instead of publishing links to a placeholder host.

## PWA and offline use

The web app includes a web manifest, 192px and 512px install icons, and a small service worker. Serve production builds over HTTPS (localhost is also supported for development) to enable installation and service workers. The worker keeps its offline page, app icons, static Next.js assets, and previously opened public pages. It does not cache search results, authentication routes, or any `/my` personal pages. Public tools still need one successful online visit before their page and interactive assets can be available offline.

The app uses system fonts and server-rendered pages by default to keep the initial download small. Client-side code is limited to interactive tools and forms. Keyboard users can use the shared “Skip to content” link, and animations respect the operating system's reduced-motion setting.

## Deployment

The app uses Server Components, Server Actions, proxy-based session refresh, and PostgreSQL access. Deploy it as a Node.js app rather than a static export. Next.js documents the Node.js server as supporting all features; platform adapters can have different compatibility. A managed Next.js host such as Vercel is the lowest-setup option, and any host that runs the standard Next.js Node server can also serve it.

### Vercel with the Turborepo workspace

1. Import the repository into Vercel. Use `apps/web` as the project root and enable **Include source files outside of the Root Directory** so workspace packages resolve. Vercel detects the Bun lockfile and Turborepo workspace; leave the framework output directory at its Next.js default. See [Vercel's Turborepo deployment guide](https://vercel.com/docs/monorepos/turborepo).
2. If the dashboard does not infer the monorepo build command, set it to `cd ../.. && turbo run build --filter=@merodin/web`.
3. Add the variables from `.env.example` to the Production environment:
   - `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or `NEXT_PUBLIC_SUPABASE_ANON_KEY`): Supabase publishable/anon key.
   - `DATABASE_URL`: Supabase PostgreSQL connection string. Use the pooler URL where the host needs pooled connections.
   - `NEXT_PUBLIC_SITE_URL`: the deployed HTTPS origin, with no path (for example `https://merodin.example`). This is a build-time value used by canonicals, Open Graph URLs, and `sitemap.xml`; add it to the build environment before deploying.
4. Before the first production deploy, run the migration from the repository root with a shell that has `DATABASE_URL` set:

   ```sh
   cd packages/db
   bun run db:migrate
   ```

5. In [Supabase Auth URL Configuration](https://supabase.com/docs/guides/auth/redirect-urls), set the Site URL to the production origin and add `https://your-domain.example/auth/callback` to the allowed redirect URLs. Add the local callback for development separately. Configure Google OAuth credentials in Supabase only if Google sign-in is enabled.
6. Deploy, then check `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`, and `/sw.js`. Install and open the app on a phone, visit a public page online, then confirm that page can open offline. Preview deployments should use a matching preview `NEXT_PUBLIC_SITE_URL` and a safe Supabase redirect allowlist.

The same repository can run on another Node.js 20.9+ host with `bun install --frozen-lockfile`, `bun run build`, and `bun run --cwd apps/web start`; configure the host to start the server on its assigned `PORT`. Keep `DATABASE_URL` server-only and never use the Supabase service-role key in the browser. The `NEXT_PUBLIC_*` auth key is designed to be public; row-level security and server-side ownership checks protect personal records.

Cloudflare Workers is another possible target through the OpenNext adapter and Hyperdrive. It needs the worker adapter configuration and a Hyperdrive binding for the PostgreSQL connection, so validate that deployment with the adapter's preview workflow before promoting it. See the [Next.js platform deployment guide](https://nextjs.org/docs/app/guides/deploying-to-platforms), [Cloudflare's Next.js guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/), and [Hyperdrive's Postgres.js guide](https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-drivers-and-libraries/postgres-js/).
