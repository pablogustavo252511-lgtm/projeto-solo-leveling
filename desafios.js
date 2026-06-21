mountAppShell("desafios");

let editingChallengeId = null;
let currentChallenges = [];
let activeStatusFilter = "";

function getTomorrowLocalInputValue() {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  tomorrow.setMinutes(tomorrow.getMinutes() - tomorrow.getTimezoneOffset());
  return tomorrow.toISOString().slice(0, 10);
}

async function syncChallenges(status = activeStatusFilter) {
  activeStatusFilter = status;
  try {
    const playerStatus = await checkSystemLock("desafios");
    if (playerStatus.locked) return;

    const path = status ? `/challenges?status=${status}` : "/challenges";
    const challenges = await apiRequest(path);
    currentChallenges = challenges;
    renderChallenges(challenges);
  } catch (error) {
    showMessage(error.message, "error");
  }
}

function getChallengeById(id) {
  return currentChallenges.find((item) => item.id === id);
}

function renderChallenges(challenges) {
  const target = document.querySelector("[data-challenge-list]");
  if (!challenges.length) {
    target.innerHTML = `<p class="muted">Nenhum desafio encontrado.</p>`;
    return;
  }

  target.innerHTML = challenges.map((challenge) => `
    <article class="data-card">
      <div class="card-topline">
        <span class="status ${challenge.status}">${challenge.status}</span>
        <span>${challenge.xp_reward} XP</span>
      </div>
      <h3>${challenge.title}</h3>
      <p>${challenge.description || "Sem descricao."}</p>
      <small>Dificuldade: ${challenge.difficulty} | Vence: ${formatDate(challenge.due_date)}</small>
      <div class="button-row">
        <button ${challenge.status !== "pendente" ? "disabled" : ""} onclick="completeChallenge('${challenge.id}')">Concluir</button>
        <button ${challenge.status !== "pendente" ? "disabled" : ""} class="warning" onclick="failChallenge('${challenge.id}')">Falhou</button>
        <button class="ghost-button" onclick="startEdit('${challenge.id}')">Editar</button>
        <button class="danger" onclick="deleteChallenge('${challenge.id}')">Excluir</button>
      </div>
    </article>
  `).join("");
}

function startEdit(challengeId) {
  const challenge = getChallengeById(challengeId);
  if (!challenge) return;

  editingChallengeId = challenge.id;
  const form = document.querySelector("[data-challenge-form]");
  form.title.value = challenge.title;
  form.description.value = challenge.description || "";
  form.difficulty.value = challenge.difficulty;
  form.due_date.value = challenge.due_date ? challenge.due_date.slice(0, 10) : "";
  document.querySelector("[data-form-title]").textContent = "Editar desafio";
}

function resetForm() {
  editingChallengeId = null;
  const form = document.querySelector("[data-challenge-form]");
  form.reset();
  form.due_date.value = getTomorrowLocalInputValue();
  document.querySelector("[data-form-title]").textContent = "Novo desafio";
}

async function submitChallenge(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  const payload = {
    title: form.get("title"),
    description: form.get("description"),
    difficulty: form.get("difficulty"),
    due_date: form.get("due_date") || getTomorrowLocalInputValue()
  };

  try {
    if (editingChallengeId) {
      await apiRequest(`/challenges/${editingChallengeId}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
      showMessage("Desafio atualizado.", "success");
    } else {
      await apiRequest("/challenges", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      showMessage("Desafio criado.", "success");
    }
    resetForm();
    await syncChallenges();
    await syncSessionUser();
  } catch (error) {
    showMessage(error.message, "error");
  }
}

async function completeChallenge(id) {
  try {
    const result = await apiRequest(`/challenges/${id}/complete`, { method: "PATCH" });
    showMessage(result.message, "success");
    await syncChallenges();
    await syncSessionUser();
  } catch (error) {
    showMessage(error.message, "error");
  }
}

async function failChallenge(id) {
  try {
    const result = await apiRequest(`/challenges/${id}/fail`, { method: "PATCH" });
    showMessage(result.message, "error");
    await syncChallenges();
    await syncSessionUser();
  } catch (error) {
    showMessage(error.message, "error");
  }
}

async function deleteChallenge(id) {
  const challenge = getChallengeById(id);
  if (!challenge) {
    showMessage("Desafio nao encontrado na lista atual.", "error");
    return;
  }

  const confirmed = window.confirm(`Excluir a missao "${challenge.title}"?`);
  if (!confirmed) return;

  try {
    await apiRequest(`/challenges/${id}`, { method: "DELETE" });
    showMessage(`Missao "${challenge.title}" excluida.`, "success");

    if (editingChallengeId === id) {
      resetForm();
    }

    await syncChallenges();
    await syncSessionUser();
  } catch (error) {
    showMessage(error.message, "error");
  }
}

document.querySelector("[data-challenge-form]").addEventListener("submit", submitChallenge);
document.querySelector("[data-reset-form]").addEventListener("click", resetForm);
document.querySelector("[data-status-filter]").addEventListener("change", (event) => syncChallenges(event.target.value));
resetForm();
syncChallenges();
