mountAppShell("boss");

let currentBosses = [];

async function loadBosses() {
  try {
    const bosses = await apiRequest("/boss");
    currentBosses = bosses;
    renderBosses(bosses);
  } catch (error) {
    showMessage(error.message, "error");
  }
}

function getBossById(id) {
  return currentBosses.find((boss) => boss.id === id);
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
        <button ${boss.status !== "ativo" ? "disabled" : ""} onclick="defeatBoss('${boss.id}')">Derrotar</button>
        <button ${boss.status !== "ativo" ? "disabled" : ""} class="danger" onclick="failBoss('${boss.id}')">Falhar</button>
        <button class="ghost-button" onclick="deleteBoss('${boss.id}')">Excluir</button>
      </div>
    </article>
  `).join("");
}

async function spawnBoss() {
  try {
    await apiRequest("/boss", { method: "POST", body: JSON.stringify({}) });
    showMessage("Boss Spawnado.", "success");
    await loadBosses();
    await syncSessionUser();
  } catch (error) {
    showMessage(error.message, "error");
  }
}

async function defeatBoss(id) {
  try {
    const result = await apiRequest(`/boss/${id}/defeat`, { method: "PATCH" });
    showMessage(result.message, "success");
    await loadBosses();
    await syncSessionUser();
  } catch (error) {
    showMessage(error.message, "error");
  }
}

async function failBoss(id) {
  try {
    const result = await apiRequest(`/boss/${id}/fail`, { method: "PATCH" });
    showMessage(result.message, "error");
    await loadBosses();
    await syncSessionUser();
  } catch (error) {
    showMessage(error.message, "error");
  }
}

async function deleteBoss(id) {
  const boss = getBossById(id);
  if (!boss) {
    showMessage("Boss nao encontrado na lista atual.", "error");
    return;
  }

  const confirmed = window.confirm(`Excluir o boss "${boss.name}"?`);
  if (!confirmed) return;

  try {
    await apiRequest(`/boss/${id}`, { method: "DELETE" });
    showMessage(`Boss "${boss.name}" excluido.`, "success");
    await loadBosses();
    await syncSessionUser();
  } catch (error) {
    showMessage(error.message, "error");
  }
}

document.querySelector("[data-spawn-boss]").addEventListener("click", spawnBoss);
loadBosses();
