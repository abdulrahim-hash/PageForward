# PageForward

PageForward is a student-led nonprofit peer-guidance platform for prospective NUST students. It helps a student discover an exact degree, institution, and campus offering; find a verified current student; request a 20–30 minute Google Meet conversation; and share feedback afterward.

The Phase 1 product is deliberately focused on one path:

`NUST → exact program offering → verified current student → conversation`

PageForward is independent from NUST and is not affiliated with, sponsored by, or endorsed by the university.

## Architecture

- Next.js 16, TypeScript, App Router, React Server Components
- Tailwind CSS 4 plus a small reusable editorial design system
- Supabase PostgreSQL, Auth, Row Level Security, and Storage
- Zod validation on every public submission endpoint
- Resend-compatible email adapter isolated in `lib/email`
- Google Meet links managed through the admin workflow; no custom video layer
- Vercel-compatible production build through `npm run build:vercel`

The domain model keeps `degree`, `program_offering`, and `mentor` separate. The initial catalog contains 41 undergraduate degrees and 55 institution/campus-specific offerings based on the official [NUST undergraduate program list](https://nust.edu.pk/admissions/undergraduates/list-of-ug-programmes-and-institutions/), last checked 28 September 2026.

## Local setup

Requirements: Node.js 22.13 or newer and a Supabase project.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in the Supabase values.

3. Run the SQL migration in the Supabase SQL editor or with the Supabase CLI:

   ```bash
   supabase db push
   ```

4. Seed the catalog:

   ```bash
   npm run seed
   ```

5. Start development:

   ```bash
   npm run dev
   ```

The public catalog has a read-only structured fallback when Supabase is not configured. Form submissions intentionally return a friendly setup error rather than pretending data was saved.

## Environment variables

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public | Canonical production origin |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | RLS-limited browser/server key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Privileged form and admin operations |
| `RESEND_API_KEY` | Server only | Transactional email |
| `ADMIN_NOTIFICATION_EMAIL` | Server only | New request/application notifications |

Never expose `SUPABASE_SERVICE_ROLE_KEY` or `RESEND_API_KEY` to browser code.

## Supabase and security

The migration at `supabase/migrations/202609280001_initial.sql` creates:

- universities, campuses, institutions, degrees, and program offerings
- mentors, normalized mentor topics, and applications
- guidance requests, sessions, feedback, and admin membership
- safe public views that omit private contact fields
- operational admin views including unmet demand
- RLS policies that allow public reads only for approved public data
- a public mentor-image bucket writable only by approved admins

Public forms submit to server routes. The browser never receives the service role key. Private requests, applications, meeting URLs, internal notes, feedback, email addresses, and verification details are not publicly queryable.

## Seed process

`npm run seed` is idempotent. It upserts by stable slugs and `public_id`, so rerunning it updates the catalog without creating duplicate universities, campuses, institutions, degrees, or offerings. It never creates mentors or testimonials.

Catalog changes should be made in `lib/catalog.ts`, verified against an official NUST source, and then reseeded. Programs remain discoverable independently of mentor availability.

## Create the first admin

1. Create a user in Supabase Auth (email/password is sufficient for Phase 1).
2. Copy that user’s UUID.
3. Insert the UUID into `admin_users`:

   ```sql
   insert into public.admin_users (user_id)
   values ('AUTH-USER-UUID');
   ```

4. Sign in at `/admin/login`.

Authentication alone is not enough: the account must also exist in `admin_users`.

## Development commands

```bash
npm run dev            # local Sites/Vite-compatible development server
npm run lint           # ESLint
npx tsc --noEmit       # strict TypeScript verification
npm run build          # validated Sites/Cloudflare-compatible output
npm run build:vercel   # native Next.js production build for Vercel
npm run seed           # idempotent Supabase catalog seed
```

## Vercel deployment

1. Import this repository into Vercel.
2. Set the framework preset to Next.js. `vercel.json` uses the native Next.js build command.
3. Add every environment variable from `.env.example` to the appropriate Vercel environment.
4. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin.
5. Run the Supabase migration and seed before accepting production requests.
6. Add the first admin user and verify `/admin/login`.
7. Submit a real test request, schedule a session, mark it complete, and test both feedback links.

## Operational workflow

1. A public request enters the admin request queue.
2. An admin reviews context, assigns a verified mentor, and records internal notes.
3. The admin agrees on a time, creates a Google Meet, and stores the UTC session time and meeting URL.
4. The session is marked completed.
5. PageForward emails secure student and mentor feedback links.
6. The unmet-demand view prioritizes offerings with open requests and low active mentor capacity.

## Current limitations

- Calendar and Google Meet creation remain semi-manual; the schema is ready for a future calendar event ID.
- Rate limiting is intentionally basic and process-local. Use a durable edge-rate-limit service before high-volume acquisition.
- Mentor image upload infrastructure is prepared in Supabase Storage; the initial admin form accepts an approved stored image URL.
- Transactional email is skipped when Resend is not configured.
- Policies and safeguarding language are strong MVP defaults but should receive independent legal and child-safety review before large-scale launch.
- No student or mentor accounts, payments, chat, AI matching, custom video, rankings, or public reviews are included.
