# AgroMind AI — static demo

This is a portable, software-only hackathon prototype. It runs as static HTML, CSS, and JavaScript; there is no build command, server, account system, or Supabase connection required. Soil readings, weather, field conditions, alerts, and crop-scan results are sample/simulated data. The crop-scan flow does not run an AI model.

## Publish with GitHub Pages

1. Create a GitHub repository for the site.
2. Extract this archive and upload the contents of this folder to the **repository root**. The root should contain `index.html`, `app.js`, `styles.css`, `favicon.svg`, and the `assets/` folder.
3. Commit the files to the `main` branch.
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/(root)`, then click **Save**.
6. Wait for GitHub Pages to finish deployment. The site URL will be shown in the Pages settings.

The HTML uses relative file paths so it can work both at a user/organization root and under a project-repository path. No API keys or environment variables are needed. The optional Google Fonts link has system-font fallbacks.

## If you later connect Supabase

The current prototype has no database or authentication needs. If you later add Supabase, keep the browser app's Supabase URL and anonymous/publishable key in client configuration only; never put a service-role key in frontend code. Use a separate frontend host such as GitHub Pages for the website, and use Supabase for backend services as needed.
