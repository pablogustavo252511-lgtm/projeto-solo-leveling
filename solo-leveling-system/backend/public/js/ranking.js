mountAppShell("ranking");

async function loadRanking() {
  try {
    const playerStatus = await checkSystemLock("ranking");
    if (playerStatus.locked) return;

    const ranking = await apiRequest("/ranking");
    const target = document.querySelector("[data-ranking]");
    target.innerHTML = ranking.map((hunter, index) => `
      <tr>
        <td>#${index + 1}</td>
        <td>${hunter.nome}</td>
        <td>${hunter.level}</td>
        <td>${hunter.xp}</td>
        <td>${hunter.rank}</td>
        <td>${hunter.completed_challenges}</td>
        <td>${hunter.defeated_bosses}</td>
      </tr>
    `).join("") || `<tr><td colspan="7">Nenhum hunter ranqueado.</td></tr>`;
  } catch (error) {
    showMessage(error.message, "error");
  }
}

loadRanking();
