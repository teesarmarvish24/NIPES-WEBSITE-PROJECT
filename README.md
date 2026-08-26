# AMSO Website

Official website for the **Association of Mathematical Sciences and Optimization (AMSO)**.

AMSO grew out of the Mathematical Analysis and Optimization Research Group (MANORG) in the
Department of Mathematics, University of Lagos, and now works with its sister group MAARG,
the National Mathematical Centre (Abuja), and IMSP (Benin Republic) to run the annual
ICAPTA / ICMSO international conference series and the IJMSOTA journal.

## Structure

Static site, no build step required.

```
index.html         Home
about.html          Mission, history, leadership, affiliates
conferences.html    Full ICAPTA/ICMSO conference archive (2016–2023)
journal.html        IJMSOTA journal overview & submission guidelines
membership.html     Benefits, registration fees, how to join
contact.html        Secretariat contacts, message form, address
assets/css/         Shared stylesheet
assets/js/          Nav toggle, active-link highlighting
assets/img/         Conference flyer images
```

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
