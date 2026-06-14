mountAppShell("perfil");

async function loadProfile() {
  try {
    const [profile, status, history] = await Promise.all([
      apiRequest("/profile"),
      apiRequest("/player/status"),
      apiRequest("/history")
    ]);

    setSession(getToken(), profile);
    document.querySelector("[data-profile]").innerHTML = `
      <div class="profile-grid">
        <span>Nome</span><strong>${profile.nome}</strong>
        <span>Email</span><strong>${profile.email}</strong>
        <span>Nivel</span><strong>${status.level}</strong>
        <span>XP</span><strong>${status.xp}</strong>
        <span>Rank</span><strong>${status.rank}</strong>
        <span>Criado em</span><strong>${formatDate(profile.created_at)}</strong>
      </div>
    `;

    document.querySelector("[data-history]").innerHTML = history.map((item) => `
      <article class="timeline-item">
        <span>${item.action}</span>
        <p>${item.description}</p>
        <small>${formatDate(item.created_at)} | XP ${item.xp_earned}</small>
      </article>
    `).join("") || `<p class="muted">Sem historico ainda.</p>`;
  } catch (error) {
    showMessage(error.message, "error");
  }
}

loadProfile();

