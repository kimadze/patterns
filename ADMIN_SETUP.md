# Protected Pattern Atlas admin

The public catalog is at `/`; the publishing form is at `/admin`.

Set two encrypted **Production** environment variables in Vercel → patterns → Settings → Environment Variables:

- `ADMIN_PASSWORD`: a unique password of at least 8 characters; the owner chooses the password. This is the password used on `/admin`.
- `GITHUB_TOKEN`: a fine-grained GitHub personal access token owned by `kimadze`, limited to the **patterns** repository with **Contents: Read and write** and the default Metadata read permission. No other repositories or account permissions are needed. Use an expiry and renew when required.

Then redeploy the latest commit so the functions receive these values. Enter credentials directly in Vercel; do not commit them or paste them into the site source. GitHub token stays server-side and is never sent to the browser. Missing configuration disables login and writes.

## Publishing

1. Open `/admin` and sign in.
2. Add title, summary, full lesson, category, direction, level and optional comma-separated tags.
3. Upload 1–8 PNG/JPG/WebP images, up to 3,000,000 bytes each. Uploaded bytes are preserved. Large images are rejected before upload rather than silently compressed.
4. Preview the lesson, then publish. Each upload is committed to `public/images/`; the lesson is committed to `public/catalog-extra.json`. The catalog loads published additions immediately through `/api/catalog`; Vercel also deploys the updated repository.
5. Existing added lessons can be edited. Original imported lessons are preserved in `index.html` and are not editable through the new-content admin. No deletion action is exposed.

Image commits use `[skip ci]` in the message. Whether Vercel skips those builds depends on the project's build rules; the final lesson commit triggers the ordinary Git deployment. Failed or abandoned uploads may leave an unused image in Git history, but do not create a partial public lesson. Retrying an incomplete form reuses successfully uploaded image IDs.

## Security and data

Session cookies are signed, HttpOnly, SameSite=Strict, Secure on Vercel, and expire after 8 hours. Changing ADMIN_PASSWORD invalidates existing sessions. Mutation requests require matching Origin and an explicit same-origin header. Password comparison uses a constant-time digest comparison. A five-failure/15-minute limiter is per server instance, not a global distributed limit; use a strong unique password and Vercel firewall controls if stronger login throttling is required. GitHub writes use SHA conflict checks to prevent overwriting concurrent changes.

Public visitors can read published lessons and images. Treat uploaded material as public. No offline download feature is included.

API references: [GitHub Contents API](https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents), [Vercel Node.js Functions](https://vercel.com/docs/functions/runtimes/node-js).
