document.addEventListener("DOMContentLoaded", function () {
  var listEl = document.getElementById("archive-list");
  var form = document.getElementById("submit-form");
  var statusEl = document.getElementById("form-status");

  function loadArchive() {
    fetch("/api/manuscripts")
      .then(function (r) {
        if (!r.ok) throw new Error("Failed to load archive");
        return r.json();
      })
      .then(function (items) {
        if (!items.length) {
          listEl.innerHTML = '<p style="color:var(--ink-soft);">No approved manuscripts yet — be the first to submit.</p>';
          return;
        }
        listEl.innerHTML = items
          .map(function (m) {
            var conf = m.conference ? m.conference + " &middot; " : "";
            var date = m.submitted_at ? new Date(m.submitted_at.replace(" ", "T") + "Z").toLocaleDateString() : "";
            return (
              '<div class="archive-item">' +
              "<h4>" + escapeHtml(m.title) + "</h4>" +
              '<div class="meta">' + escapeHtml(m.authors) + " &middot; " + conf + date + "</div>" +
              '<a class="btn btn-outline btn-sm" href="/api/manuscripts/' + m.id + '/download">Download</a>' +
              "</div>"
            );
          })
          .join("");
      })
      .catch(function () {
        listEl.innerHTML = '<p style="color:var(--ink-soft);">Couldn\'t load the archive right now — please refresh.</p>';
      });
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      statusEl.textContent = "Submitting…";
      statusEl.className = "status-msg";

      var submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;

      fetch("/api/manuscripts", { method: "POST", body: new FormData(form) })
        .then(function (r) {
          return r.json().then(function (data) {
            return { ok: r.ok, data: data };
          });
        })
        .then(function (res) {
          if (!res.ok) throw new Error(res.data.error || "Submission failed.");
          statusEl.textContent = res.data.message || "Submitted successfully.";
          statusEl.className = "status-msg success";
          form.reset();
        })
        .catch(function (err) {
          statusEl.textContent = err.message || "Something went wrong — please try again.";
          statusEl.className = "status-msg error";
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }

  if (listEl) loadArchive();
});
