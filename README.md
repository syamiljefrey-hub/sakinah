# Sakina

One repo, two projects that run separately.

- `landing/` Next.js landing page (this is built)
- `app/` 4-page Muslim azan app (next step)

## Run the landing page
    cd landing
    npm install
    npm run dev        # http://localhost:3000
    npm run build      # static site in landing/out

## Deploy to Cloudflare Pages
Build command: `npm run build`  |  Output directory: `out`  |  Root directory: `landing`
Or: `npx wrangler pages deploy out --project-name sakina`

## The Sakina app (`app/`)
Next.js, 4 tabs (Home, Quran, Adhan, Qibla). Runs separately from the landing page.

    cd app
    npm install
    npm run dev            # http://localhost:3000 (use phone-width window)

### PC executable (Windows .exe)
    npm run dist:win       # installer appears in app/dist

### Mobile (Android APK via Capacitor)
    npm run build
    npm run cap:add        # first time only
    npm run cap:android    # opens Android Studio -> Build APK
Android needs Android Studio. iOS needs a Mac (`npm i @capacitor/ios && npx cap add ios`).
