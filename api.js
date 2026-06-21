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
  localStorage.removeItem("hunter_lock");
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
    if (data.locked) {
      setLockState({
        locked: true,
        lock_message: data.message || "Sistema bloqueado. Enfrente o boss para continuar."
      });

      if (currentPageName() !== "boss.html") {
        window.location.href = "boss.html?locked=1";
      }
    }

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
  const lockState = getLockState();
  const locked = lockState.locked;

  return `
    <aside class="sidebar">
      <a class="brand" href="dashboard.html">
        <span class="brand-mark">SL</span>
        <span>Daily Hunter</span>
      </a>
      <nav class="nav">
        <a class="${activePage === "dashboard" ? "active" : ""} ${locked ? "locked-link" : ""}" href="${locked ? "boss.html?locked=1" : "dashboard.html"}">Dashboard</a>
        <a class="${activePage === "desafios" ? "active" : ""} ${locked ? "locked-link" : ""}" href="${locked ? "boss.html?locked=1" : "desafios.html"}">Desafios</a>
        <a class="${activePage === "boss" ? "active" : ""}" href="boss.html">Boss</a>
        <a class="${activePage === "ranking" ? "active" : ""} ${locked ? "locked-link" : ""}" href="${locked ? "boss.html?locked=1" : "ranking.html"}">Top Hunters</a>
        <a class="${activePage === "perfil" ? "active" : ""} ${locked ? "locked-link" : ""}" href="${locked ? "boss.html?locked=1" : "perfil.html"}">Perfil</a>
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

function getLockState() {
  try {
    return JSON.parse(localStorage.getItem("hunter_lock")) || { locked: false };
  } catch (error) {
    return { locked: false };
  }
}

function setLockState(status) {
  const state = {
    locked: Boolean(status?.locked),
    message: status?.lock_message || "",
    bosses: status?.lock_bosses || []
  };

  localStorage.setItem("hunter_lock", JSON.stringify(state));
  return state;
}

function currentPageName() {
  return (window.location.pathname.split("/").pop() || "dashboard.html").toLowerCase();
}

function showLockNotice(message) {
  const existing = document.querySelector("[data-lock-notice]");
  if (existing) {
    existing.querySelector("p").textContent = message;
    return;
  }

  const notice = document.createElement("section");
  notice.className = "lock-notice";
  notice.setAttribute("data-lock-notice", "");
  notice.innerHTML = `
    <strong>Sistema bloqueado</strong>
    <p>${message}</p>
    <a class="button" href="boss.html">Enfrentar boss</a>
  `;

  const main = document.querySelector(".app-main") || document.body;
  main.prepend(notice);
}

function clearLockNotice() {
  const notice = document.querySelector("[data-lock-notice]");
  if (notice) notice.remove();
}

function enforceSystemLock(status, activePage) {
  const lockState = setLockState(status);
  const page = activePage ? `${activePage}.html` : currentPageName();
  const isBossPage = page === "boss.html";

  if (lockState.locked && !isBossPage) {
    window.location.href = "boss.html?locked=1";
    return true;
  }

  if (lockState.locked && isBossPage) {
    showLockNotice(lockState.message || "Va para a aba Boss e derrote o boss para liberar o sistema.");
    return false;
  }

  clearLockNotice();
  return false;
}

async function checkSystemLock(activePage) {
  const status = await apiRequest("/player/status");
  setSession(getToken(), status);
  enforceSystemLock(status, activePage);
  return status;
}

function mountAppShell(activePage) {
  requireAuth();
  const shell = document.querySelector("[data-shell]");
  if (shell) {
    shell.innerHTML = renderShell(activePage);
  }
}

async function syncSessionUser() {
  const profile = await apiRequest("/player/status");
  setSession(getToken(), profile);
  enforceSystemLock(profile);
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
