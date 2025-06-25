/* ----------  invite.js  -----------------------------------------------
   Handles:
     • Generate Invite Code   (/api/create)
     • Join Circle            (/api/join)
     • Stats refresh          (/api/stats)
   Depends on user-auth.js for X-User-Id header injection.
----------------------------------------------------------------------- */

(() => {
  const $ = id => document.getElementById(id);

  /* ------ CREATE -------------------------------------- */
  const createBtn = $("createBtn");
  if (createBtn) {
    createBtn.addEventListener("click", async () => {
      const name = $("createName").value.trim();
      if (!name) return alert("Name required");
      try {
        const r = await fetch("/create", {
          method: "POST",
          body: JSON.stringify({ name })
        }).then(res => res.json());
        $("createOut").textContent = "Share this code: " + r.code;
        refreshStats();
        navigator.clipboard.writeText(r.code).catch(() => {});
        alert("Invite code copied:\n" + r.code);
      } catch (err) {
        alert("Error creating invite:\n" + err);
        console.error(err);
      }
    });
  }

  /* ------ JOIN ---------------------------------------- */
  const joinBtn = $("joinBtn");
  if (joinBtn) {
    joinBtn.addEventListener("click", async () => {
      const name = $("joinName").value.trim();
      const code = $("joinCode").value.trim();
      if (!name || !code) return alert("Both fields required");
      try {
        const r = await fetch("/join", {
          method: "POST",
          body: JSON.stringify({ name, code })
        }).then(res => res.json());
        if (r.error) return alert(r.error);
        $("joinOut").textContent = "Joined! Your ID: " + r.id;
        refreshStats();
      } catch (err) {
        alert("Error joining Cercil:\n" + err);
        console.error(err);
      }
    });
  }

  /* ------ STATS --------------------------------------- */
  async function refreshStats () {
    try {
      const s = await fetch("/stats").then(res => res.json());
      $("stats").textContent =
        "Total trusted pros in this Cercil: " + s.size;
    } catch (err) {
      console.error("Stats fetch failed:", err);
    }
  }
  refreshStats();
})();
