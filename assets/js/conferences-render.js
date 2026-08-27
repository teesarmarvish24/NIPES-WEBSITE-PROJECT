document.addEventListener("DOMContentLoaded", function () {
  var latestEl = document.getElementById("latest-conference");
  var latestHeading = document.getElementById("latest-heading");
  var timelineEl = document.getElementById("conference-timeline");
  if (!latestEl || !timelineEl) return;

  fetch("/api/conferences")
    .then(function (r) {
      if (!r.ok) throw new Error("Failed to load conferences");
      return r.json();
    })
    .then(function (items) {
      if (!items.length) {
        latestEl.innerHTML = '<p style="color:var(--ink-soft);">No conferences listed yet.</p>';
        timelineEl.innerHTML = "";
        return;
      }

      var latest = items[0];
      var rest = items.slice(1);

      latestHeading.textContent = latest.edition;
      latestEl.innerHTML =
        (latest.image_url
          ? '<img src="' + escapeAttr(latest.image_url) + '" alt="' + escapeAttr(latest.edition) + ' flyer" style="border-radius:10px;box-shadow:var(--shadow);">'
          : '<div class="card" style="display:flex;align-items:center;justify-content:center;min-height:220px;color:var(--ink-soft);">No flyer image</div>') +
        '<div class="card">' +
        '<span class="tl-tag current">Latest</span>' +
        '<h3 class="mt-0">' + escapeHtml(latest.title) + "</h3>" +
        "<p>" + metaLine(latest) + "</p>" +
        (latest.description ? '<p class="mb-0">' + escapeHtml(latest.description) + "</p>" : "") +
        "</div>";

      if (!rest.length) {
        timelineEl.innerHTML = '<p style="color:var(--ink-soft);">No earlier editions listed yet.</p>';
        return;
      }

      timelineEl.innerHTML = rest
        .map(function (c) {
          return (
            '<div class="tl-item">' +
            '<div class="tl-dot"></div>' +
            '<div class="tl-card">' +
            '<span class="tl-tag">' + escapeHtml(c.edition) + "</span>" +
            '<div class="tl-meta">' + metaLine(c) + "</div>" +
            '<h3 class="mt-0" style="font-size:1.1rem;">' + escapeHtml(c.title) + "</h3>" +
            (c.description ? '<p class="mb-0">' + escapeHtml(c.description) + "</p>" : "") +
            "</div></div>"
          );
        })
        .join("");
    })
    .catch(function () {
      latestEl.innerHTML = '<p style="color:var(--ink-soft);">Couldn\'t load conferences right now — please refresh.</p>';
      timelineEl.innerHTML = "";
    });

  function metaLine(c) {
    var parts = [];
    if (c.start_date || c.end_date) {
      parts.push("<strong>" + escapeHtml([c.start_date, c.end_date].filter(Boolean).join(" – ")) + "</strong>");
    }
    if (c.venue) parts.push(escapeHtml(c.venue));
    return parts.join(" &middot; ");
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }
  function escapeAttr(str) {
    return escapeHtml(str).replace(/"/g, "&quot;");
  }
});
