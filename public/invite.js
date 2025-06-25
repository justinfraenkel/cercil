(() => {
  const btn    = document.getElementById("generateBtn");
  const output = document.getElementById("inviteCode");   // <span> to display

  if (!btn) { console.warn("generateBtn not found"); return; }

  btn.addEventListener("click", async () => {
    try {
      const res  = await fetch("/api/invite", { method: "POST" });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      // show the code
      if (output) output.textContent = data.code;
      navigator.clipboard.writeText(data.code).catch(() => {});
      alert("Invite code copied: " + data.code);
    } catch (err) {
      alert("Error generating invite: " + err);
    }
  });
})(); 