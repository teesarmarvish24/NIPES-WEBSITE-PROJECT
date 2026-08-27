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
conferences.html     Full ICAPTA/ICMSO conference archive (2016–2023)
journal.html         IJMSOTA journal overview & submission guidelines
archive.html         Manuscript submission form + approved archive listing
admin.html           Token-gated manuscript review queue (secretariat only, not linked in nav)
membership.html      Benefits, registration fees, how to join
contact.html         Secretariat contacts, message form, address
assets/css/          Shared stylesheet
assets/js/           Nav toggle, active-link highlighting, archive page logic
assets/img/          Conference flyer images
functions/api/       Cloudflare Pages Functions (manuscript submit/list/download, admin review)
schema.sql           D1 database schema for the manuscript archive
```

## Manuscript archive — one-time Cloudflare setup

The archive/upload feature needs a D1 database and an R2 bucket, bound to the
Pages project. This only needs to be done once, via the Cloudflare dashboard:

1. **Create the database:** Storage & databases → D1 → Create database, name
   it e.g. `amso-manuscripts`. Open its Console tab and run the contents of
   `schema.sql` to create the `manuscripts` table.
2. **Create the bucket:** Storage & databases → R2 → Create bucket, name it
   e.g. `amso-manuscripts`.
3. **Bind both to the Pages project:** Workers & Pages → your project →
   Settings → Functions/Bindings:
   - D1 database binding: variable name `DB` → the database from step 1
   - R2 bucket binding: variable name `MANUSCRIPTS` → the bucket from step 2
4. **Set an admin token:** in the same Settings area, add an environment
   variable `ADMIN_TOKEN` set to a long random string — this is the password
   used on `admin.html` to review and approve/reject submissions.
5. Redeploy (or push a commit) so the new bindings take effect.

Submissions default to `pending` and only appear in the public archive once
approved via `admin.html`.

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
