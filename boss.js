mountAppShell("boss");

async function loadBosses() {
  try {
    const bosses = await apiRequest("/boss");
    renderBosses(bosses);
  } catch (error) {
    showMessage(error.message, "error");
  }
}

function renderBosses(bosses) {
  const target = document.querySelector("[data-boss-list]");
  if (!bosses.length) {
    target.innerHTML = `<p class="muted">Nenhum boss encontrado.</p>`;
    return;
  }

  target.innerHTML = bosses.map((boss) => `
    <article class="boss-card ${boss.status}">
      <div class="card-topline">
        <span class="status ${boss.status}">${boss.status}</span>
        <span>${boss.reward_xp} XP</span>
      </div>
      <h3>${boss.name}</h3>
      <p>${boss.penalty}</p>
      <small>Nivel necessario ${boss.level_required} | ${boss.difficulty} | Limite: ${formatDate(boss.time_limit)}</small>
      <div class="button-row">
        <button onclick="defeatBoss('${boss.id}')">Derrotar</button>
        <button class="danger" onclick="failBoss('${boss.id}')">Falhar</button>
      </div>
    </article>
  `).join("");
}

async function spawnBoss() {
  try {
    await apiRequest("/boss", { method: "POST", body: JSON.stringify({}) });
    showMessage("Boss Spawnado.", "success");
    await loadBosses();
  } catch (error) {
    showMessage(error.message, "error");
  }
}

async function defeatBoss(id) {
  try {
    const result = await apiRequest(`/boss/${id}/defeat`, { method: "PATCH" });
    showMessage(result.message, "success");
    await loadBosses();
  } catch (error) {
    showMessage(error.message, "error");
  }
}

async function failBoss(id) {
  try {
    const result = await apiRequest(`/boss/${id}/fail`, { method: "PATCH" });
    showMessage(result.message, "error");
    await loadBosses();
  } catch (error) {
    showMessage(error.message, "error");
  }
}

document.querySelector("[data-spawn-boss]").addEventListener("click", spawnBoss);
loadBosses();

