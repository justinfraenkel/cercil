/* Dev-only helper
   ──────────────────────────────────────────────────────────────────────────
   • Renders a blue user-ID toolbar (already added from index.html)
   • Stores the ID in localStorage
   • Monkey-patches fetch() so every call:
       – Adds   X-User-Id        header
       – Adds   Content-Type     if none provided
       – Prefixes the URL with  /api   **only if it isn't already**
*/

(() => {
  /* toolbar was injected earlier from index.html */
  const uidInput = document.getElementById("uid");
  if (!uidInput) return;                    // safety guard

  /* load / persist */
  uidInput.value = localStorage.getItem("userId") || "";
  uidInput.oninput = () => localStorage.setItem("userId", uidInput.value);

  /* monkey-patch fetch */
  const API_PREFIX = "/api";                // Express mounts routes here
  const origFetch  = window.fetch.bind(window);

  window.fetch = (url, opts = {}) => {
    /* Build mutable Headers */
    const headers = new Headers(opts.headers || {});
    const uid     = uidInput.value || localStorage.getItem("userId") || "";

    if (uid) headers.set("X-User-Id", uid);
    if (!headers.has("Content-Type") && !opts.body instanceof FormData) {
      headers.set("Content-Type", "application/json");
    }

    /* If url is absolute (http/https) leave it; otherwise decide prefix */
    let fullUrl;
    if (/^https?:\/\//i.test(url)) {
      fullUrl = url;                        // absolute → leave untouched
    } else if (url.startsWith(API_PREFIX + "/")) {
      fullUrl = url;                        // already has /api
    } else {
      fullUrl = API_PREFIX + url;           // add /api exactly once
    }

    return origFetch(fullUrl, { ...opts, headers });
  };
})();
