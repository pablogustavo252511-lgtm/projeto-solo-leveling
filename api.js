const savedApiBaseUrl = localStorage.getItem("api_base_url");
const API_BASE_URL = savedApiBaseUrl
  || (window.location.protocol === "file:" ? "http://localhost:3000" : window.location.origin);

function getToken() {
  return localStorage.getItem("hunter_token");
}

function setSession(token, user) {
  localStorage.setItem("hunter_token", token);
  localStorage.setItem("hunter_user", JSON.stringify(user));
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("hunter_user")) || null;
  } catch (error) {
    return null;
  }
}

function clearSession() {
  localStorage.removeItem("hunter_token");
  localStorage.removeItem("hunter_user");
}

function requireAuth() {
  if (!getToken()) {
    window.location.href = "login.html";
  }
}

function logout() {
  clearSession();
  window.location.href = "login.html";
}

async function apiRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.message || "Erro na requisicao.");
  }

  return data;
}

function showMessage(message, type = "info") {
  const target = document.querySelector("[data-message]");
  if (!target) return;
  target.textContent = message;
  target.className = `system-message ${type}`;
}

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

function renderShell(activePage) {
  const user = getStoredUser();
  const name = user?.nome || "Hunter";
  const rank = user?.rank || "E";

  return `
    <aside class="sidebar">
      <a class="brand" href="dashboard.html">
        <span class="brand-mark">SL</span>
        <span>Daily Hunter</span>
      </a>
      <nav class="nav">
        <a class="${activePage === "dashboard" ? "active" : ""}" href="dashboard.html">Dashboard</a>
        <a class="${activePage === "desafios" ? "active" : ""}" href="desafios.html">Desafios</a>
        <a class="${activePage === "boss" ? "active" : ""}" href="boss.html">Boss</a>
        <a class="${activePage === "ranking" ? "active" : ""}" href="ranking.html">Top Hunters</a>
        <a class="${activePage === "perfil" ? "active" : ""}" href="perfil.html">Perfil</a>
      </nav>
    </aside>
    <header class="topbar">
      <div>
        <span class="eyebrow">Sistema do Hunter</span>
        <strong>${name}</strong>
      </div>
      <div class="topbar-actions">
        <span class="rank-pill">Rank ${rank}</span>
        <button class="ghost-button" onclick="logout()">Sair</button>
      </div>
    </header>
  `;
}

function mountAppShell(activePage) {
  requireAuth();
  const shell = document.querySelector("[data-shell]");
  if (shell) {
    shell.innerHTML = renderShell(activePage);
  }
}

async function syncSessionUser() {
  const profile = await apiRequest("/profile");
  setSession(getToken(), profile);
  const shell = document.querySelector("[data-shell]");
  const activeLink = document.querySelector(".nav a.active");
  const activePage = activeLink ? activeLink.textContent.trim().toLowerCase() : "";

  if (shell) {
    const pageMap = {
      dashboard: "dashboard",
      desafios: "desafios",
      boss: "boss",
      "top hunters": "ranking",
      perfil: "perfil"
    };
    shell.innerHTML = renderShell(pageMap[activePage] || "dashboard");
  }

  return profile;
}
