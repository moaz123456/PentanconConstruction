# Pentacon Construction - website

React 18 + Vite + React Router. Public website that reads everything dynamic from the
Pentacon API (`https://pentacon-construction.runasp.net`).

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

In development the site calls `/api/...` and `/uploads/...` on the Vite server, which forwards them to the live API
(see `vite.config.js`), so you do not need to touch CORS while working. To use a local API instead:
`VITE_PROXY_TARGET=http://localhost:5080 npm run dev`.

## Pages and the API endpoints they use

| Page | Route | Data |
|---|---|---|
| Home | `/` | categories, latest projects, clients, testimonials, project counts |
| About us | `/about` | static text + counts from the API |
| Services | `/services` | static (`src/content/siteContent.js`) |
| Projects | `/projects`, `/projects/category/:slug`, `/projects?client=ID` | `GET /api/projects` (paged, filtered) |
| Project | `/project/:id` | `GET /api/projects/{id}` |
| Clients | `/clients` | `GET /api/clients` |
| Testimonials | `/testimonials` | `GET /api/testimonials` |
| Contact | `/contact` | form (see below) |
| Admin login | `/admin/login` | `POST /api/auth/login` |
| Admin dashboard | `/admin` | the admin endpoints below |

The header "Projects" menu, the home page panels and the footer all list the categories from
`GET /api/project-categories`, with a cover image for each.

## Admin dashboard

Sign in at `/admin/login` (footer link) with an administrator account. The dashboard manages everything
that the API can, and changes are published immediately:

| Section | What you can do |
|---|---|
| Sectors | Create, edit and delete categories, with a cover image for each |
| Projects | Create, edit and delete projects |
| Photos | Upload project photos, set the cover, write captions, reorder and delete |
| Clients | Create, edit and delete clients, with logo upload |
| Testimonials | Create, edit and delete testimonials, with photo upload |

A signed-out token redirects you back to the login page automatically.

## Setting up the content (once, through Swagger)

1. `POST /api/auth/login`, then **Authorize** with the token.
2. Create the categories (or do it in the admin dashboard instead). The site bundles covers for
   **Coastal**, **Residential**, **Commercial**, **Corporate** in `src/content/categories.js`, but any
   category you give a cover image through the API shows that image instead.
3. Create projects (`POST /api/projects`), then upload photos (`POST /api/projects/{id}/images`).
   The first photo becomes the cover; use `PUT .../cover` to change it.
4. Add clients and testimonials.
   A client or testimonial whose name contains "Soil" and that has no image uses the bundled logo in `src/assets/clients/`.

Until the API has categories, the site shows the four bundled ones so the menu never looks empty.

## Things you will want to edit

| File | What |
|---|---|
| `src/config/site.js` | Email, phone, address (shown in the footer and on the Contact page when filled in), social links |
| `src/content/siteContent.js` | Hero text, About text, the six services. **This is starter copy - replace it with the company's own wording.** |
| `src/content/categories.js` | Cover images per category name |
| `src/styles/base.css` | Colors, fonts, spacing (`:root` variables at the top) |
| `public/videos/hero.mp4` | Home page video. The top 48 px of the original was cropped off to remove the logo that was baked into the corner, and the (silent) audio track was dropped. Replace the file to change it. |

## Contact form

The site has no backend endpoint for messages (by design), so pick one:

- **Form service** (recommended): create a form at Formspree / FormSubmit / similar and put its URL in `.env.production` as
  `VITE_CONTACT_FORM_URL=...`. The form posts JSON `{ name, email, phone, message }`.
- **Email app fallback**: fill `contact.email` in `src/config/site.js`. The form then opens the visitor's email app with the message prepared.

If neither is set, the form tells the visitor to use Instagram or Facebook.

## Build and deploy (MonsterASP.NET or any static host)

```bash
npm run build      # creates dist/
```

Upload the **contents** of `dist/` to the site's root folder. `web.config` (IIS) and `_redirects` (Netlify) are included
so deep links such as `/projects/category/coastal` work after a refresh.

The production build calls the API directly (`.env.production`), so the API must allow the site's address:
add it to `Cors:AllowedOrigins` in the API's `appsettings.Production.json`, for example
`"https://your-site.runasp.net"`, and republish the API.

## Design notes   

- Colors: black `#000`, neon `#e0e324` (sampled from the logo mark), gold `#c8a24c`, bone `#f2f1ea`.
- Type: Archivo (variable, width axis - set extra-wide for headings, normal for text) and Instrument Serif for statements and quotes. Both are self-hosted through Fontsource.
- The slanted shape comes from the lean of the logo's stem (about 7 degrees). It is used on buttons, cards, chips and the category panels.
