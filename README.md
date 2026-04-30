# Malagasy Citizenship Screening Test

This project provides a responsive practice citizenship screening quiz available in Malagasy, French, and English.

This is a practice tool for educational purposes only. It is not an official government examination.

## Project Structure

- `index.html`: Contains the main page for the citizenship test.
- `assets/app.js`: JavaScript file handling the test logic.
- `assets/styles.css`: Styles for the application.
- `backend/worker.js`: Cloudflare Worker API endpoint for collecting anonymized results (optional).
- `backend/wrangler.toml`: Configuration for the Cloudflare Worker.
- `.github/workflows/pages.yml`: GitHub Actions for deploying the site to GitHub Pages.

## Getting Started

You can run this as a static site.

- **Quick start**: clone the repository and open `index.html` in a browser.
- **Recommended** (avoids some browser restrictions around `file://`):

```bash
npx --yes serve .
```

Then open the printed local URL.

## Result submissions (optional Cloudflare Worker + KV)

The frontend can optionally POST anonymized quiz results to a Cloudflare Worker at `POST /api/results`.

### Privacy

The payload is designed to avoid personal data. It includes only:

- score and total questions
- language
- duration
- app version
- a random submission id (UUID) for de-duplication/debugging

Do not modify the frontend or worker to collect names, emails, or other identifiers unless you have a clear legal/privacy basis.

### Worker setup

1. Install Wrangler (once):

```bash
npm i -g wrangler
```

2. Create a KV namespace and copy its id:

```bash
wrangler kv namespace create RESULTS_KV
```

3. Edit `backend/wrangler.toml` and set:

- `[[kv_namespaces]].id` to the KV namespace id
- `[vars].ALLOWED_ORIGINS` to your GitHub Pages origin (comma-separated). Example:
  - `https://YOUR_GITHUB_USERNAME.github.io`

4. Deploy the worker from the `backend/` directory:

```bash
cd backend
wrangler deploy
```

### Wire the Worker URL into the site

In `index.html`, set:

- `window.__WORKER_URL__ = "https://YOUR_WORKER_SUBDOMAIN.workers.dev"`

If left blank, the app will run normally and simply skip submissions.
