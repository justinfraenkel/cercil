(function () {
  // Create a tiny toolbar
  const bar = document.createElement("div");
  bar.style.cssText = "padding:6px;background:#eef;border-bottom:1px solid #ccd;";
  bar.innerHTML = `
    <label style="margin-right:4px;">User&nbsp;ID:</label>
    <input id="uid" style="border:1px solid #ccc;padding:2px;" placeholder="e.g. alice">
  `;
  document.body.prepend(bar);

  // Persist to localStorage
  const uidInput = document.getElementById("uid");
  uidInput.value = localStorage.getItem("userId") || "";
  uidInput.oninput = () => localStorage.setItem("userId", uidInput.value);

  // API path config
  const API_BASE = '';
  const API_PREFIX = '/api';

  // Monkey-patch global fetch so every call adds the header
  const origFetch = window.fetch;
  window.fetch = (url, opts = {}) => {
    const headers = new Headers(opts.headers || {});
    const uid = uidInput.value || localStorage.getItem("userId") || "";
    if (uid) headers.set("X-User-Id", uid);
    return origFetch(API_BASE + API_PREFIX + url, {
      ...opts,
      headers
    });
  };
})(); 