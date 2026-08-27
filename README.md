# AMSO Website

Official website for the **Association of Mathematical Sciences and Optimization (AMSO)**.

AMSO grew out of the Mathematical Analysis and Optimization Research Group (MANORG) in the
Department of Mathematics, University of Lagos, and now works with its sister group MAARG,
the National Mathematical Centre (Abuja), and IMSP (Benin Republic) to run the annual
ICAPTA / ICMSO international conference series and the IJMSOTA journal.

## Structure

Static site, no build step required.

```
index.html          Home
about.html           Mission, history, leadership, affiliates
conferences.html     Conference archive — rendered from the `conferences` table via /api/conferences
journal.html         IJMSOTA journal overview & submission guidelines
archive.html         Manuscript submission form + approved archive listing
admin.html           Token-gated admin: manuscript review + conference add/edit/delete (not linked in nav)
membership.html      Benefits, registration fees, how to join
contact.html         Secretariat contacts, message form, address
assets/css/          Shared stylesheet
assets/js/           Nav toggle, active-link highlighting, archive/conferences page logic
assets/img/          Conference flyer images
functions/api/       Cloudflare Pages Functions (manuscripts + conferences: public read, admin write)
schema.sql           Full D1 schema (manuscripts + conferences), for a fresh setup
migration-conferences.sql  Just the conferences table + seed data, for a site that already has schema.sql applied
```

## One-time Cloudflare setup (manuscripts + conferences)

Both the manuscript archive and the conference admin panel share one D1
database and one ADMIN_TOKEN. This only needs to be done once, via the
Cloudflare dashboard:

1. **Create the database:** Storage & databases → D1 → Create database, name
   it e.g. `amso-manuscripts`. Open its Console tab and run `schema.sql` (new
   setup) or `migration-conferences.sql` (if you already ran schema.sql
   before this feature existed) to create the tables.
2. **Create the bucket:** Storage & databases → R2 → Create bucket, name it
   e.g. `amso-manuscripts` (used for manuscript files only).
3. **Bind both to the Pages project:** Workers & Pages → your project →
   Settings → Functions/Bindings:
   - D1 database binding: variable name `DB` → the database from step 1
   - R2 bucket binding: variable name `MANUSCRIPTS` → the bucket from step 2
4. **Set an admin token:** in the same Settings area, add an environment
   variable `ADMIN_TOKEN` set to a long random string — this is the password
   used on `admin.html` to review manuscripts and manage conferences.
5. Redeploy (or push a commit) so the new bindings take effect.

Manuscript submissions default to `pending` and only appear in the public
archive once approved via `admin.html`. Conferences you add via `admin.html`
appear on `conferences.html` immediately — the one with the highest "sort
priority" is shown as the current "Latest Edition", the rest as the archive
timeline underneath. The homepage's flagship-programme preview cards are
still hand-written, not pulled from this table.

## Running locally

```
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Content notes

Conference history, leadership names and fee schedules were compiled from AMSO/MANORG
conference flyers (2016–2023). Sections that reference details not yet confirmed
(e.g. the 1st/2nd/8th conference editions, current officer list, live journal site link)
are flagged inline with a callout — update these once the secretariat confirms details.

