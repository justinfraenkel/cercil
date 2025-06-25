/* Dev-only helper
   ───────────────────────────────────────────────
   • Creates a blue “User ID” toolbar at the very top (if it isn’t already there)
   • Stores the ID in localStorage
   • Monkey-patches fetch() so every call:
       – Adds  X-User-Id  header
       – Adds  Content-Type: application/json  if one isn’t set
       – Prefixes relative URLs with /api   (but never doubles it)
*/

(() => {
  /* 1 ─ Ensure the toolbar exists */
  let uidInput = document.getElementById("uid");
  if (!uidInput) {
    const bar = document.createElement("div");
    bar.style.cssText =
      "padding:6px;background:#eef;border-bottom:1px solid #ccd;";
    bar.innerHTML = `
      <label style="margin-right:4px;">User&nbsp;ID:</label>
      <input id="uid" style="border:1px solid #ccc;padding:2px;" placeholder="e.g. alice">
    `;
    document.body.prepend(bar);
    uidInput = /** @type {HTMLInputElement} */ (bar.querySelector("#uid"));
  }

  /* 2 ─ Load / persist the ID */
  uidInput.value = localStorage.getItem("userId") || "";
  uidInput.oninput = () => localStorage.setItem("userId", uidInput.value);

  /* 3 ─ Monkey-patch fetch */
  const API_PREFIX = "/api";
  const origFetch  = window.fetch.bind(window);

  window.fetch = (url, opts = {}) => {
    const headers = new Headers(opts.headers || {});
    const uid     = uidInput.value || localStorage.getItem("userId") || "";

    if (uid) headers.set("X-User-Id", uid);
    if (!headers.has("Content-Type") && !(opts.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    let fullUrl;
    if (/^https?:\/\//i.test(url)) {
      fullUrl = url;                       // absolute URL → leave as-is
    } else if (url.startsWith(API_PREFIX + "/")) {
      fullUrl = url;                       // already begins with /api
    } else {
      fullUrl = API_PREFIX + url;          // add prefix exactly once
    }

    return origFetch(fullUrl, { ...opts, headers });
  };
})();
