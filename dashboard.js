mountAppShell("dashboard");

async function loadDashboard() {
  try {
    const [profile, status, challenges, bosses, history] = await Promise.all([
      apiRequest("/profile"),
      apiRequest("/player/status"),
      apiRequest("/challenges"),
      apiRequest("/boss"),
      apiRequest("/history")
    ]);

    setSession(getToken(), profile);
    renderPlayerStatus(status);
    renderTodayChallenges(challenges);
    renderBossPreview(bosses);
    renderHistoryPreview(history);
  } catch (error) {
    showMessage(error.message, "error");
  }
}

function renderPlayerStatus(status) {
  document.querySelector("[data-player-name]").textContent = status.nome;
  document.querySelector("[data-level]").textContent = status.level;
  document.querySelector("[data-xp]").textContent = status.xp;
  document.querySelector("[data-next-xp]").textContent = status.xp_next_level;
  document.querySelector("[data-rank]").textContent = status.rank;
  document.querySelector("[data-progress]").style.width = `${status.progress_percent}%`;
  document.querySelector("[data-progress-label]").textContent = `${status.xp} / ${status.xp_next_level} XP`;
}

function renderTodayChallenges(challenges) {
  const target = document.querySelector("[data-challenges]");
  const pending = challenges.filter((challenge) => challenge.status === "pendente").slice(0, 5);

  if (!pending.length) {
    target.innerHTML = `<p class="muted">Nenhuma missao pendente.</p>`;
    return;
  }

  target.innerHTML = pending.map((challenge) => `
    <article class="mission-row">
      <div>
        <strong>${challenge.title}</strong>
        <span>${challenge.difficulty} - ${challenge.xp_reward} XP</span>
      </div>
      <button onclick="completeChallenge('${challenge.id}')">Concluir</button>
    </article>
  `).join("");
}

function renderBossPreview(bosses) {
  const target = document.querySelector("[data-boss-preview]");
  const active = bosses.find((boss) => boss.status === "ativo");

  if (!active) {
    target.innerHTML = `<p class="muted">Nenhum boss ativo.</p>`;
    return;
  }

  target.innerHTML = `
    <strong>${active.name}</strong>
    <span>${active.difficulty} - recompensa ${active.reward_xp} XP</span>
    <small>Limite: ${formatDate(active.time_limit)}</small>
  `;
}

function renderHistoryPreview(history) {
  const target = document.querySelector("[data-history-preview]");
  target.innerHTML = history.slice(0, 6).map((item) => `
    <li>
      <span>${item.action}</span>
      <small>${formatDate(item.created_at)}</small>
    </li>
  `).join("") || `<li class="muted">Sem registros ainda.</li>`;
}

async function completeChallenge(id) {
  try {
    const result = await apiRequest(`/challenges/${id}/complete`, { method: "PATCH" });
    showMessage(result.message, "success");
    await loadDashboard();
  } catch (error) {
    showMessage(error.message, "error");
  }
}

loadDashboard();

