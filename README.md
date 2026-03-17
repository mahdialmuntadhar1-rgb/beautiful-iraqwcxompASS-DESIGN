# Beautiful Iraq Compass Design

  A modern, beautiful Iraqi city guide and business directory app with glassmorphism UI, bilingual (Arabic/English) support, and AI-powered features.

  ## Branch Strategy

  - `main` → AI Studio generated code (source of truth)
  - `production` → Stable, fixed, deployment-ready version

  ## Project Structure

  ```
  ├── index.tsx          # App entry point
  ├── App.tsx            # Root component
  ├── components/        # UI components
  │   ├── Header.tsx
  │   ├── HeroSection.tsx
  │   ├── Dashboard.tsx
  │   ├── BusinessDirectory.tsx
  │   └── ...
  ├── hooks/             # Custom React hooks
  ├── constants.tsx      # App constants
  ├── types.ts           # TypeScript types
  ├── index.css          # Global styles
  ├── vite.config.ts
  └── tsconfig.json
  ```

  ## Environment Variables

  Copy `.env.example` to `.env` (or `.env.local`) and fill in your values:

  ```
  GEMINI_API_KEY=    # Your Google Gemini API key
  ```

  ## Run on Replit

  1. Import this repository into Replit (use the production branch).
  2. Go to **Secrets** and add:
     - `GEMINI_API_KEY`
  3. Run `npm install` in the Shell if not auto-installed.
  4. Click **Run** — starts via `npm run dev`.

  ## Commands

  | Command          | Description                      |
  |------------------|----------------------------------|
  | `npm run dev`    | Start development server (Vite)  |
  | `npm run build`  | Build for production             |
  | `npm run preview`| Preview production build locally |
  | `npm run lint`   | TypeScript type check            |

  ## Deploy on Replit

  1. Set **build command** to `npm run build`
  2. Set **run command** to `npx serve dist -s` (serves static build)
  3. Add environment variables to Replit Secrets

  ## Features

  - Glassmorphism dark UI design
  - Arabic/English bilingual support with RTL layout
  - City guide and business directory
  - Community stories and events
  - Deals marketplace
  - High contrast accessibility mode
  - AI-powered search and recommendations (requires Gemini API key)
  