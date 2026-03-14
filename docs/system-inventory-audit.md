# Iraq Compass System Inventory Audit

_Last updated from local repository inspection._

## What this repository is

This codebase (`beautiful-iraqwcxompASS-DESIGN`) is a **frontend web app** built with:

- Vite
- React 19
- TypeScript
- Custom REST calls to Supabase (`/rest/v1`)

Evidence:

- `package.json` scripts and deps (`vite`, `react`, `typescript`).
- `vite.config.ts` with `@vitejs/plugin-react`.
- `lib/supabase.ts` reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` and calls Supabase REST endpoints.

## Confirmed project identifiers found in code

| Item | Value found | Source |
|---|---|---|
| Local package name | `copy-of-iraq-compassamazingfinal2` | `package.json` |
| AI Studio source this repo was copied from | `https://github.com/absulysuly/Frontend-Iraqcompast-aistudio` | `metadata.json` |
| AI Studio app link in README | `https://ai.studio/apps/da4e9d22-af92-4997-8a1a-ae36acf711a0` | `README.md` |

## Links you shared and likely role

| Link | Type | Status from current evidence |
|---|---|---|
| `github.com/mahdialmuntadhar1-rgb/versionof-CLAUDEprompt` | GitHub repo | Not referenced by this frontend code. Likely separate experiment. |
| `github.com/mahdialmuntadhar1-rgb/18-AGENTS` | GitHub repo | Not referenced directly in this frontend repo; likely scraper/monitoring side project. |
| `github.com/absulysuly/Frontend-Iraqcompast-aistudio` | GitHub repo | **Strongly related**: this repo metadata says this project is a copy of that source repo. |
| `supabase.com/dashboard/project/mxxaxhrtccomkazpvthn/...` | Supabase project | Could be the backend DB if `VITE_SUPABASE_URL` points to that project; needs env check in deployment. |
| `aistudio.google.com/.../apps/ff9d62c2-...` | Google AI Studio app | Separate app id from README's app id; verify if old/new AI Studio project. |
| `aistudio.google.com/.../apps/821e3dda-...` | Google AI Studio app | Another different app id; likely another iteration. |
| `vercel.com/new/...projectName=fuck...` | Vercel setup/deploy URL | Indicates a Vercel project named `fuck` was created from GitHub at least once. |
| `https://fuck-three.vercel.app/` | Live deployment URL | Likely active frontend URL; must be verified against Vercel project settings. |

## What to verify in dashboard settings (to remove confusion)

1. **Vercel → Project → Git**
   - Confirm connected GitHub repository owner/name.
2. **Vercel → Project → Environment Variables**
   - Confirm `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` values.
3. **Supabase → Project Settings → API**
   - Check project ref in URL matches `VITE_SUPABASE_URL` host.
4. **GitHub repos**
   - Keep one primary frontend repo and archive unused experiments.
5. **AI Studio apps**
   - Keep one active app id and document ownership/purpose.

## Recommendation: canonical source-of-truth table

Create and maintain a single `SYSTEM_OF_RECORD.md` with exactly one row per layer:

- Frontend repo (GitHub)
- Frontend deployment project (Vercel)
- Backend data repo (scrapers/agents)
- Database project (Supabase)
- AI prototyping app (AI Studio)

This prevents future drift across renamed or experimental projects.
