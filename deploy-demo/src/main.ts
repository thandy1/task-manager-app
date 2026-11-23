type Flags = { showTaskStats: boolean}

// Runtime config: fetched when the page loads, not baked in at build time.
async function loadFlags(): Promise<Flags> {
  try {
    // Relative path so it resolves under whichever prefix serves the page.
    // no-store stops the browser from caching an old flags.json.
    const res = await fetch("flags.json", { cache: "no-store"});
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as Flags;
  } catch {
    // Fail safe: if the config can't be loaded, the feature stays off.
    return { showTaskStats: false };
  }
}

async function main() {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  const flags = await loadFlags();

  app.innerHTML = `
    <h1>Task Manager (deploy demo)</h1>
    <p>Task list placeholder.</p>
  `;

  // The feature the flag gates.
  if (flags.showTaskStats) {
    app.innerHTML += `
      <section>
        <h2>Task stats</h2>
        <p>Total: 12 | In progress: 3 | Done: 5</p>
      </section>
    `;
  }

  // Slot label
  // Baked in at build time: shows which prefix this build was deployed to.
  const slot = import.meta.env.VITE_DEPLOY_SLOT ?? "local";
  app.innerHTML += `<footer><small>Deployed slot: ${slot}</small></footer>`;
}

main();