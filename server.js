require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function parseMissionDueDate(value) {
  const fallbackDate = new Date().toISOString().slice(0, 10);
  const dateText = value ? String(value).trim() : fallbackDate;

  if (DATE_ONLY_PATTERN.test(dateText)) {
    return new Date(`${dateText}T23:59:59.999-03:00`);
  }

  const parsed = new Date(dateText);
  if (!Number.isFinite(parsed.getTime())) {
    return new Date(`${fallbackDate}T23:59:59.999-03:00`);
  }

  const isLegacyMidnightUtc = parsed.getUTCHours() === 0
    && parsed.getUTCMinutes() === 0
    && parsed.getUTCSeconds() === 0
    && parsed.getUTCMilliseconds() === 0;

  return isLegacyMidnightUtc
    ? new Date(`${parsed.toISOString().slice(0, 10)}T23:59:59.999-03:00`)
    : parsed;
}

function getDatabaseUrl() {
  let url = String(process.env.DATABASE_URL || "").trim();

  if (url.startsWith("DATABASE_URL=")) {
    url = url.slice("DATABASE_URL=".length).trim();
  }

  if ((url.startsWith('"') && url.endsWith('"')) || (url.startsWith("'") && url.endsWith("'"))) {
    url = url.slice(1, -1).trim();
  }

  if (url.includes("clever-cloud.com") && !/[?&]sslmode=/.test(url)) {
    url += url.includes("?") ? "&sslmode=require" : "?sslmode=require";
  }

  return url;
}

function hasUsableDatabaseUrl() {
  const url = getDatabaseUrl();
  if (!url) return false;

  return ![
    "USER:PASSWORD",
    "HOST:5432",
    "DATABASE",
    "cole_a_internal_database_url",
    "sua_url_real_do_banco"
  ].some((placeholder) => url.includes(placeholder));
}

function shouldUseLocalDatabase() {
  if (process.env.USE_LOCAL_DB !== undefined) {
    return process.env.USE_LOCAL_DB === "true";
  }

  if (process.env.RENDER) {
    return false;
  }

  return !hasUsableDatabaseUrl();
}

const normalizedDatabaseUrl = getDatabaseUrl();
if (normalizedDatabaseUrl) {
  process.env.DATABASE_URL = normalizedDatabaseUrl;
}

const app = express();
const port = process.env.PORT || 3000;
const frontendOrigin = process.env.FRONTEND_ORIGIN || process.env.FRONTEND_ORIGI || "*";
const frontendPathCandidates = [
  path.join(__dirname, "public"),
  path.join(__dirname, "..", "frontend"),
  path.join(process.cwd(), "..", "frontend"),
  path.join(process.cwd(), "frontend"),
  path.join(process.cwd(), "solo-leveling-system", "frontend"),
  path.join(__dirname, "..", "..", "frontend"),
  path.join(__dirname, "..", "..", "solo-leveling-system", "frontend")
];
const generatedPublicPath = path.join(__dirname, "public");
const frontendPageFiles = [
  "page.html",
  "index.html",
  "login.html",
  "register.html",
  "dashboard.html",
  "desafios.html",
  "boss.html",
  "ranking.html",
  "perfil.html"
];

function copyFrontendSourceToPublic() {
  const sourcePath = frontendPathCandidates.find((candidate) => {
    return candidate !== generatedPublicPath
      && fs.existsSync(path.join(candidate, "login.html"))
      && fs.existsSync(path.join(candidate, "css", "style.css"));
  });

  if (!sourcePath) return;

  const publicNeedsSync = !fs.existsSync(path.join(generatedPublicPath, "login.html"))
    || !fs.existsSync(path.join(generatedPublicPath, "register.html"))
    || !fs.existsSync(path.join(generatedPublicPath, "css", "style.css"))
    || !fs.existsSync(path.join(generatedPublicPath, "js", "api.js"));

  if (!publicNeedsSync) return;

  fs.mkdirSync(generatedPublicPath, { recursive: true });
  fs.cpSync(sourcePath, generatedPublicPath, { recursive: true });
  console.log(`Frontend copiado para public a partir de: ${sourcePath}`);
}

function writeGeneratedPublicFile(relativePath, content) {
  const filePath = path.join(generatedPublicPath, relativePath);
  if (fs.existsSync(filePath)) {
    const currentContent = fs.readFileSync(filePath, "utf8");
    if (!currentContent.includes("data-generated-fallback")) return;
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function generatedAuthPage(type) {
  const isRegister = type === "register";
  const title = isRegister ? "Cadastro" : "Login";
  const subtitle = isRegister ? "Nivel 1, XP 0, Rank E." : "Entre no sistema do hunter.";
  const endpoint = isRegister ? "/register" : "/login";
  const submitLabel = isRegister ? "Despertar Hunter" : "Entrar";
  const extraField = isRegister
    ? '<label>Nome<input name="nome" type="text" required></label>'
    : "";
  const switchLink = isRegister
    ? '<a href="/login.html">Ja tenho conta</a>'
    : '<a href="/register.html">Criar novo hunter</a>';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Daily Hunter</title>
  <style>
    *{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:radial-gradient(circle at 50% 20%,rgba(24,216,255,.18),transparent 25rem),radial-gradient(circle at 80% 70%,rgba(141,92,255,.16),transparent 28rem),#02050b;color:#eef7ff;font-family:Arial,sans-serif}.panel{width:min(440px,calc(100vw - 32px));padding:32px;border:1px solid rgba(24,216,255,.34);border-radius:10px;background:rgba(12,18,32,.86);box-shadow:0 0 42px rgba(24,216,255,.12);text-align:center}.mark{display:grid;place-items:center;width:46px;height:46px;margin:0 auto 18px;border:1px solid #18d8ff;border-radius:8px;color:#18d8ff;font-weight:900;box-shadow:0 0 22px rgba(24,216,255,.35)}h1{margin:0 0 10px;font-size:46px}p{color:#a9bed3}.form{display:grid;gap:14px;margin-top:24px;text-align:left}label{display:grid;gap:8px;color:#9ec8ed}input{width:100%;padding:14px;border:1px solid rgba(238,247,255,.2);border-radius:8px;background:#050913;color:#fff;font-size:16px}button,.btn{width:100%;padding:14px;border:1px solid #18d8ff;border-radius:8px;background:linear-gradient(135deg,rgba(24,216,255,.25),rgba(141,92,255,.28));color:#fff;font-size:16px;cursor:pointer}a{display:inline-block;margin-top:18px;color:#18d8ff;text-decoration:none}.message{min-height:22px;margin-top:14px;color:#ff4f8b}.message.ok{color:#2cffad}
  </style>
</head>
<body>
  <main class="panel">
    <span class="mark">SL</span>
    <h1>${title}</h1>
    <p>${subtitle}</p>
    <form class="form">
      ${extraField}
      <label>Email<input name="email" type="email" required></label>
      <label>Senha<input name="senha" type="password" required minlength="6"></label>
      <button type="submit">${submitLabel}</button>
      <p class="message" data-message></p>
    </form>
    ${switchLink}
  </main>
  <script>
    const form = document.querySelector("form");
    const message = document.querySelector("[data-message]");
    const isRegistrationPage = ${isRegister ? "true" : "false"};
    const params = new URLSearchParams(window.location.search);
    if (!isRegistrationPage && params.get("registered") === "1") {
      message.textContent = "Conta criada. Agora faca login para entrar no sistema.";
      message.className = "message ok";
    }
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      message.textContent = "";
      message.className = "message";
      const data = Object.fromEntries(new FormData(form).entries());
      try {
        const response = await fetch("${endpoint}", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Erro no sistema.");
        if (isRegistrationPage) {
          localStorage.removeItem("hunter_token");
          localStorage.removeItem("hunter_user");
          window.location.href = "/login.html?registered=1";
          return;
        }
        localStorage.setItem("hunter_token", result.token);
        localStorage.setItem("hunter_user", JSON.stringify(result.user));
        window.location.href = "/dashboard.html";
      } catch (error) {
        message.textContent = error.message;
      }
    });
  </script>
</body>
</html>`;
}

function generatedAppPage(title, message) {
  const pageKey = ({
    Dashboard: "dashboard",
    Desafios: "desafios",
    Boss: "boss",
    "Top Hunters": "ranking",
    Perfil: "perfil"
  })[title] || "dashboard";

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Daily Hunter</title>
  <style>
    :root{--bg:#03060d;--panel:rgba(10,16,31,.74);--panel-2:rgba(13,22,42,.9);--line:rgba(24,216,255,.24);--line-strong:rgba(24,216,255,.6);--cyan:#18d8ff;--violet:#8d5cff;--white:#edf8ff;--muted:#94aac0;--danger:#ff4f8b;--ok:#2cffad}
    *{box-sizing:border-box}html{background:var(--bg)}body{margin:0;min-height:100vh;overflow-x:hidden;color:var(--white);font-family:Inter,Segoe UI,Arial,sans-serif;background:linear-gradient(rgba(24,216,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(141,92,255,.035) 1px,transparent 1px),radial-gradient(circle at 22% 18%,rgba(24,216,255,.18),transparent 28rem),radial-gradient(circle at 86% 10%,rgba(141,92,255,.18),transparent 34rem),linear-gradient(135deg,#02050b 0%,#050716 46%,#080516 100%);background-size:42px 42px,42px 42px,auto,auto,auto}
    body:before{content:"";position:fixed;inset:0;z-index:0;pointer-events:none;background:linear-gradient(180deg,transparent,rgba(0,0,0,.5)),repeating-linear-gradient(180deg,rgba(255,255,255,.025) 0 1px,transparent 1px 5px)}
    a{color:inherit;text-decoration:none}.shell{position:relative;z-index:1;min-height:100vh;display:grid;grid-template-columns:270px minmax(0,1fr)}.sidebar{position:sticky;top:0;height:100vh;padding:26px 20px;border-right:1px solid var(--line);background:linear-gradient(180deg,rgba(1,5,12,.88),rgba(4,9,18,.74));backdrop-filter:blur(18px)}.brand{display:flex;align-items:center;gap:13px;font-size:18px;font-weight:900}.mark{display:grid;place-items:center;width:48px;height:48px;border:1px solid var(--cyan);border-radius:8px;color:var(--cyan);letter-spacing:.04em;background:rgba(24,216,255,.07);box-shadow:0 0 26px rgba(24,216,255,.28)}.nav{display:grid;gap:9px;margin-top:44px}.nav a{position:relative;padding:14px 14px;border:1px solid transparent;border-radius:8px;color:#b1c4d8}.nav a:hover,.nav a.active{border-color:rgba(24,216,255,.24);background:linear-gradient(90deg,rgba(24,216,255,.14),rgba(141,92,255,.09));color:#fff;box-shadow:0 0 20px rgba(24,216,255,.07)}.nav a.active:before{content:"";position:absolute;left:8px;top:13px;bottom:13px;width:3px;border-radius:999px;background:var(--cyan);box-shadow:0 0 12px var(--cyan)}
    .main{padding:30px clamp(22px,4vw,64px) 54px}.topbar{display:flex;justify-content:space-between;align-items:center;gap:18px;margin-bottom:28px}.system{color:var(--cyan);text-transform:uppercase;font-size:12px;font-weight:900;letter-spacing:.08em}.top-actions{display:flex;align-items:center;gap:12px}.rank-pill,.level-pill{padding:10px 13px;border:1px solid rgba(24,216,255,.36);border-radius:999px;background:rgba(24,216,255,.08);color:#dff9ff}.ghost-button,.button{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:42px;padding:10px 15px;border:1px solid rgba(238,248,255,.25);border-radius:8px;background:rgba(255,255,255,.02);color:#fff;font:inherit;cursor:pointer}.button{border-color:var(--line-strong);background:linear-gradient(135deg,rgba(24,216,255,.18),rgba(141,92,255,.18));box-shadow:0 0 20px rgba(24,216,255,.1)}.danger{border-color:rgba(255,79,139,.54);color:#ffd7e5}.ok{border-color:rgba(44,255,173,.54);color:#dcfff3}
    .hero-panel{position:relative;overflow:hidden;display:grid;grid-template-columns:minmax(0,1fr) 220px;gap:24px;align-items:center;padding:30px;border:1px solid var(--line);border-radius:8px;background:linear-gradient(135deg,rgba(13,22,42,.92),rgba(7,11,23,.74));box-shadow:0 24px 70px rgba(0,0,0,.3),0 0 40px rgba(24,216,255,.08)}.hero-panel:after{content:"";position:absolute;right:-120px;top:-140px;width:360px;aspect-ratio:1;border-radius:50%;border:1px solid rgba(24,216,255,.22);box-shadow:inset 0 0 60px rgba(24,216,255,.11),0 0 70px rgba(141,92,255,.14)}h1{position:relative;margin:7px 0 12px;font-size:clamp(48px,7.8vw,96px);line-height:.9;letter-spacing:0;text-shadow:0 0 22px rgba(24,216,255,.18)}.subtitle{position:relative;max-width:760px;margin:0;color:var(--muted);font-size:17px;line-height:1.6}.core{position:relative;z-index:1;display:grid;place-items:center;text-align:center;justify-self:end;width:170px;height:170px;border:1px solid rgba(24,216,255,.5);border-radius:50%;background:radial-gradient(circle,rgba(24,216,255,.13),rgba(5,7,15,.86) 65%);box-shadow:0 0 40px rgba(24,216,255,.22)}.core strong{font-size:34px}.core small{color:var(--muted)}
    .metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin:18px 0}.metric,.card,.list-item,.panel{border:1px solid rgba(24,216,255,.2);border-radius:8px;background:var(--panel);box-shadow:0 0 28px rgba(24,216,255,.06)}.metric{padding:17px}.metric span,.label{display:block;color:var(--muted);font-size:12px;text-transform:uppercase;font-weight:800}.metric strong{display:block;margin-top:8px;font-size:28px}.xp-track{height:10px;margin-top:12px;overflow:hidden;border-radius:999px;background:rgba(238,248,255,.1)}.xp-fill{height:100%;width:0%;border-radius:inherit;background:linear-gradient(90deg,var(--cyan),var(--violet));box-shadow:0 0 18px rgba(24,216,255,.5);transition:width .45s ease}.content-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:18px}.card{padding:22px}.card h2{margin:0 0 15px;font-size:22px}.list{display:grid;gap:12px}.list-item{padding:15px}.list-item header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:8px}.list-item h3{margin:0;font-size:18px}.list-item p{margin:7px 0;color:#b7c6d5;line-height:1.5}.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:11px}.chip{display:inline-flex;align-items:center;padding:6px 9px;border:1px solid rgba(24,216,255,.22);border-radius:999px;background:rgba(24,216,255,.07);color:#dff9ff;font-size:12px}.chip.danger{border-color:rgba(255,79,139,.42);color:#ff9fc0;background:rgba(255,79,139,.09)}.actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.empty{padding:18px;border:1px dashed rgba(238,248,255,.18);border-radius:8px;color:var(--muted);text-align:center}.form-grid{display:grid;gap:12px}.form-grid label{display:grid;gap:7px;color:#abd2f5;font-size:14px}.form-grid input,.form-grid textarea,.form-grid select{width:100%;min-height:43px;padding:12px;border:1px solid rgba(238,248,255,.18);border-radius:8px;background:#050913;color:#fff;font:inherit}.form-grid textarea{min-height:100px;resize:vertical}.leader-row{display:grid;grid-template-columns:46px 1fr auto;gap:12px;align-items:center}.place{display:grid;place-items:center;width:42px;height:42px;border-radius:8px;border:1px solid var(--line);color:var(--cyan);background:rgba(24,216,255,.08);font-weight:900}.message{min-height:22px;margin:12px 0 0;color:var(--ok)}.message.error{color:var(--danger)}
    .lock-banner{display:none;margin:18px 0 0;padding:16px;border:1px solid rgba(255,79,139,.55);border-radius:8px;background:linear-gradient(135deg,rgba(255,79,139,.16),rgba(141,92,255,.16));box-shadow:0 0 34px rgba(255,79,139,.12)}.lock-banner.show{display:grid;gap:8px}.lock-banner strong{color:var(--danger);text-transform:uppercase}.nav a.locked{opacity:.55}.nav a.locked:after{content:" bloqueado";color:var(--danger);font-size:11px}
    @media(max-width:1050px){.shell{grid-template-columns:1fr}.sidebar{position:relative;height:auto}.nav{grid-template-columns:repeat(5,minmax(0,1fr));margin-top:22px}.hero-panel,.content-grid{grid-template-columns:1fr}.core{justify-self:start}.metrics{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:720px){.main{padding:20px 14px 36px}.topbar{align-items:flex-start;flex-direction:column}.top-actions{width:100%;justify-content:space-between}.nav{grid-template-columns:1fr 1fr}.hero-panel{padding:22px}.metrics{grid-template-columns:1fr}h1{font-size:48px}.core{width:140px;height:140px}.content-grid{gap:14px}}
  </style>
</head>
<body data-generated-fallback data-page="${pageKey}">
  <div class="shell">
    <aside class="sidebar">
      <a class="brand" href="/dashboard.html"><span class="mark">SL</span><span>Daily Hunter</span></a>
      <nav class="nav">
        <a href="/dashboard.html" class="${pageKey === "dashboard" ? "active" : ""}">Dashboard</a>
        <a href="/desafios.html" class="${pageKey === "desafios" ? "active" : ""}">Desafios</a>
        <a href="/boss.html" class="${pageKey === "boss" ? "active" : ""}">Boss</a>
        <a href="/ranking.html" class="${pageKey === "ranking" ? "active" : ""}">Top Hunters</a>
        <a href="/perfil.html" class="${pageKey === "perfil" ? "active" : ""}">Perfil</a>
      </nav>
    </aside>
    <main class="main">
      <header class="topbar">
        <div><span class="system">Sistema do Hunter</span></div>
        <div class="top-actions">
          <span class="level-pill" data-top-level>Nivel 1</span>
          <span class="rank-pill" data-top-rank>Rank E</span>
          <button class="ghost-button" data-logout>Sair</button>
        </div>
      </header>

      <section class="hero-panel">
        <div>
          <span class="system" data-player-name>Carregando hunter...</span>
          <h1>${title}</h1>
          <p class="subtitle">${message}</p>
        </div>
        <div class="core">
          <div>
            <small>Rank</small>
            <strong data-core-rank>E</strong>
            <small data-core-level>Nivel 1</small>
          </div>
        </div>
      </section>

      <section class="lock-banner" data-lock-banner>
        <strong>Sistema bloqueado</strong>
        <p data-lock-message>Va para a aba Boss e derrote o boss para liberar o sistema.</p>
      </section>

      <section class="metrics">
        <article class="metric"><span>Nivel</span><strong data-level>1</strong></article>
        <article class="metric"><span>XP atual</span><strong data-xp>0</strong><div class="xp-track"><div class="xp-fill" data-xp-fill></div></div></article>
        <article class="metric"><span>Missoes concluidas</span><strong data-completed>0</strong></article>
        <article class="metric"><span>Bosses derrotados</span><strong data-defeated>0</strong></article>
      </section>

      <section class="content-grid" data-content>
        <article class="card"><h2>Sincronizando...</h2><p class="empty">Conectando ao sistema do hunter.</p></article>
      </section>
    </main>
  </div>

  <script>
    const pageName = "${pageKey}";
    const token = localStorage.getItem("hunter_token");
    const state = { profile: null, challenges: [], bosses: [], history: [], ranking: [] };
    const content = document.querySelector("[data-content]");

    if (!token) location.href = "/login.html";

    document.querySelector("[data-logout]").addEventListener("click", function() {
      localStorage.clear();
      location.href = "/login.html";
    });

    function applyLockState() {
      const player = state.profile || {};
      const locked = Boolean(player.locked);
      const message = player.lock_message || "Va para a aba Boss e derrote o boss para liberar o sistema.";
      const banner = document.querySelector("[data-lock-banner]");
      const bannerMessage = document.querySelector("[data-lock-message]");
      const links = document.querySelectorAll(".nav a");

      links.forEach(function(link) {
        const isBossLink = link.getAttribute("href") === "/boss.html";
        link.classList.toggle("locked", locked && !isBossLink);
        if (locked && !isBossLink) {
          link.setAttribute("href", "/boss.html?locked=1");
        }
      });

      if (locked && pageName !== "boss") {
        location.href = "/boss.html?locked=1";
        return true;
      }

      if (banner) {
        banner.classList.toggle("show", locked);
      }

      if (bannerMessage) {
        bannerMessage.textContent = message;
      }

      return false;
    }

    function html(value) {
      return String(value == null ? "" : value).replace(/[&<>"']/g, function(char) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
      });
    }

    function dateLabel(value) {
      if (!value) return "Sem prazo";
      try {
        return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
      } catch (error) {
        return "Sem prazo";
      }
    }

    function missionDateLabel(value) {
      if (!value) return "Sem prazo";
      try {
        const date = new Date(value);
        const isLegacyMidnightUtc = date.getUTCHours() === 0
          && date.getUTCMinutes() === 0
          && date.getUTCSeconds() === 0
          && date.getUTCMilliseconds() === 0;

        if (isLegacyMidnightUtc) {
          const parts = date.toISOString().slice(0, 10).split("-");
          return parts[2] + "/" + parts[1] + "/" + parts[0];
        }

        return new Intl.DateTimeFormat("pt-BR", {
          dateStyle: "short",
          timeZone: "America/Sao_Paulo"
        }).format(date);
      } catch (error) {
        return "Sem prazo";
      }
    }

    function api(path, options) {
      options = options || {};
      const headers = Object.assign({ "Content-Type": "application/json", Authorization: "Bearer " + token }, options.headers || {});
      return fetch(path, Object.assign({}, options, { headers: headers })).then(function(response) {
        return response.text().then(function(text) {
          const data = text ? JSON.parse(text) : {};
          if (!response.ok) throw new Error(data.message || "Erro no sistema.");
          return data;
        });
      });
    }

    function xpNext(level) {
      const table = { 1: 100, 2: 250, 3: 500, 4: 1000 };
      return table[level] || level * 500;
    }

    function updateHud() {
      const player = state.profile || {};
      const level = Number(player.level || 1);
      const xp = Number(player.xp || 0);
      const needed = Number(player.xp_for_next_level || player.xpForNextLevel || xpNext(level));
      const percent = Math.max(0, Math.min(100, Math.round((xp / needed) * 100)));
      const completed = state.challenges.filter(function(item) { return item.status === "concluido"; }).length;
      const defeated = state.bosses.filter(function(item) { return item.status === "derrotado"; }).length;

      document.querySelector("[data-player-name]").textContent = player.nome || "Hunter";
      document.querySelector("[data-top-level]").textContent = "Nivel " + level;
      document.querySelector("[data-top-rank]").textContent = "Rank " + (player.rank || "E");
      document.querySelector("[data-core-rank]").textContent = player.rank || "E";
      document.querySelector("[data-core-level]").textContent = "Nivel " + level;
      document.querySelector("[data-level]").textContent = level;
      document.querySelector("[data-xp]").textContent = xp + " / " + needed;
      document.querySelector("[data-xp-fill]").style.width = percent + "%";
      document.querySelector("[data-completed]").textContent = completed;
      document.querySelector("[data-defeated]").textContent = defeated;
    }

    function itemStatusClass(status) {
      return status === "falhou" ? "chip danger" : "chip";
    }

    function challengeCard(item) {
      return '<article class="list-item">'
        + '<header><h3>' + html(item.title) + '</h3><span class="' + itemStatusClass(item.status) + '">' + html(item.status || "pendente") + '</span></header>'
        + '<p>' + html(item.description || "Sem descricao.") + '</p>'
        + '<div class="chips"><span class="chip">' + html(item.difficulty || "normal") + '</span><span class="chip">' + Number(item.xp_reward || 0) + ' XP</span><span class="chip">' + missionDateLabel(item.due_date) + '</span></div>'
        + '<div class="actions"><button class="button ok" data-action="complete-challenge" data-id="' + html(item.id) + '">Concluir</button><button class="ghost-button" data-action="delete-challenge" data-id="' + html(item.id) + '">Excluir</button></div>'
        + '</article>';
    }

    function bossCard(item) {
      return '<article class="list-item">'
        + '<header><h3>' + html(item.name) + '</h3><span class="' + itemStatusClass(item.status) + '">' + html(item.status || "ativo") + '</span></header>'
        + '<p>Penalidade: ' + html(item.penalty || "Missao de penalidade") + '</p>'
        + '<div class="chips"><span class="chip">Nivel ' + Number(item.level_required || 1) + '</span><span class="chip">' + html(item.difficulty || "normal") + '</span><span class="chip">' + Number(item.reward_xp || 0) + ' XP</span><span class="chip">' + dateLabel(item.time_limit) + '</span></div>'
        + '<div class="actions"><button class="button ok" data-action="defeat-boss" data-id="' + html(item.id) + '">Derrotar</button><button class="ghost-button danger" data-action="fail-boss" data-id="' + html(item.id) + '">Falhar</button><button class="ghost-button" data-action="delete-boss" data-id="' + html(item.id) + '">Excluir</button></div>'
        + '</article>';
    }

    function renderDashboard() {
      const pending = state.challenges.filter(function(item) { return item.status === "pendente"; }).slice(0, 4);
      const activeBosses = state.bosses.filter(function(item) { return item.status === "ativo"; }).slice(0, 3);
      const history = state.history.slice(0, 5);
      content.innerHTML = '<article class="card"><h2>Missoes do dia</h2><div class="list">'
        + (pending.length ? pending.map(challengeCard).join("") : '<p class="empty">Nenhuma missao pendente.</p>')
        + '</div></article><article class="card"><h2>Ameacas ativas</h2><div class="list">'
        + (activeBosses.length ? activeBosses.map(bossCard).join("") : '<p class="empty">Nenhum boss ativo.</p>')
        + '</div><h2 style="margin-top:22px">Historico recente</h2><div class="list">'
        + (history.length ? history.map(function(item) { return '<article class="list-item"><span class="label">' + dateLabel(item.created_at) + '</span><p>' + html(item.description || item.action) + '</p></article>'; }).join("") : '<p class="empty">Sem historico ainda.</p>')
        + '</div></article>';
    }

    function renderChallenges() {
      content.innerHTML = '<article class="card"><h2>Lista de desafios</h2><div class="list">'
        + (state.challenges.length ? state.challenges.map(challengeCard).join("") : '<p class="empty">Nenhum desafio criado.</p>')
        + '</div></article><article class="card"><h2>Novo desafio</h2><form class="form-grid" data-challenge-form><label>Titulo<input name="title" required placeholder="Correr 2 km"></label><label>Descricao<textarea name="description" placeholder="Detalhe a missao"></textarea></label><label>Dificuldade<select name="difficulty"><option>Facil</option><option selected>Normal</option><option>Dificil</option><option>Insano</option></select></label><label>Vencimento<input name="due_date" type="date"></label><button class="button" type="submit">Criar missao</button><p class="message" data-form-message></p></form></article>';
      document.querySelector("[data-challenge-form]").addEventListener("submit", submitChallenge);
    }

    function renderBoss() {
      content.innerHTML = '<article class="card"><h2>Bosses</h2><div class="list">'
        + (state.bosses.length ? state.bosses.map(bossCard).join("") : '<p class="empty">Nenhum boss encontrado.</p>')
        + '</div></article><article class="card"><h2>Portal de ameaca</h2><p class="subtitle">Gere um boss quando precisar recuperar disciplina ou pagar uma penalidade.</p><button class="button" data-action="spawn-boss">Spawnar boss</button><p class="message" data-form-message></p></article>';
    }

    function renderRanking() {
      content.innerHTML = '<article class="card" style="grid-column:1/-1"><h2>Top Hunters</h2><div class="list">'
        + (state.ranking.length ? state.ranking.map(function(item, index) {
          return '<article class="list-item leader-row"><span class="place">#' + (index + 1) + '</span><div><h3>' + html(item.nome || "Hunter") + '</h3><div class="chips"><span class="chip">Nivel ' + Number(item.level || 1) + '</span><span class="chip">Rank ' + html(item.rank || "E") + '</span></div></div><strong>' + Number(item.xp || 0) + ' XP</strong></article>';
        }).join("") : '<p class="empty">Ranking vazio.</p>')
        + '</div></article>';
    }

    function renderProfile() {
      const history = state.history.slice(0, 8);
      const player = state.profile || {};
      content.innerHTML = '<article class="card"><h2>Perfil do hunter</h2><div class="list"><article class="list-item"><span class="label">Nome</span><h3>' + html(player.nome || "Hunter") + '</h3></article><article class="list-item"><span class="label">Email</span><h3>' + html(player.email || "-") + '</h3></article><article class="list-item"><span class="label">Criado em</span><h3>' + dateLabel(player.created_at) + '</h3></article></div></article><article class="card"><h2>Historico</h2><div class="list">'
        + (history.length ? history.map(function(item) { return '<article class="list-item"><span class="label">' + dateLabel(item.created_at) + '</span><p>' + html(item.description || item.action) + '</p></article>'; }).join("") : '<p class="empty">Sem eventos registrados.</p>')
        + '</div></article>';
    }

    function render() {
      updateHud();
      if (applyLockState()) return;
      if (pageName === "desafios") return renderChallenges();
      if (pageName === "boss") return renderBoss();
      if (pageName === "ranking") return renderRanking();
      if (pageName === "perfil") return renderProfile();
      return renderDashboard();
    }

    function refresh() {
      return Promise.all([
        api("/player/status").catch(function() { return api("/profile"); }),
        api("/challenges").catch(function() { return []; }),
        api("/boss").catch(function() { return []; }),
        api("/history").catch(function() { return []; }),
        api("/ranking").catch(function() { return []; })
      ]).then(function(results) {
        state.profile = results[0].player || results[0];
        state.challenges = Array.isArray(results[1]) ? results[1] : [];
        state.bosses = Array.isArray(results[2]) ? results[2] : [];
        state.history = Array.isArray(results[3]) ? results[3] : [];
        state.ranking = Array.isArray(results[4]) ? results[4] : [];
        localStorage.setItem("hunter_user", JSON.stringify(state.profile));
        render();
      }).catch(function() {
        localStorage.clear();
        location.href = "/login.html";
      });
    }

    function submitChallenge(event) {
      event.preventDefault();
      const form = event.currentTarget;
      const data = Object.fromEntries(new FormData(form).entries());
      api("/challenges", { method: "POST", body: JSON.stringify(data) }).then(function() {
        form.reset();
        return refresh();
      }).catch(function(error) {
        const message = document.querySelector("[data-form-message]");
        if (message) {
          message.textContent = error.message;
          message.className = "message error";
        }
      });
    }

    document.addEventListener("click", function(event) {
      const button = event.target.closest("[data-action]");
      if (!button) return;
      const action = button.getAttribute("data-action");
      const id = button.getAttribute("data-id");
      let request = null;
      if (action === "complete-challenge") request = api("/challenges/" + id + "/complete", { method: "PATCH" });
      if (action === "delete-challenge" && confirm("Excluir esta missao?")) request = api("/challenges/" + id, { method: "DELETE" });
      if (action === "spawn-boss") request = api("/boss", { method: "POST", body: JSON.stringify({}) });
      if (action === "defeat-boss") request = api("/boss/" + id + "/defeat", { method: "PATCH" });
      if (action === "fail-boss") request = api("/boss/" + id + "/fail", { method: "PATCH" });
      if (action === "delete-boss" && confirm("Excluir este boss?")) request = api("/boss/" + id, { method: "DELETE" });
      if (request) request.then(refresh).catch(function(error) { alert(error.message); });
    });

    refresh();
  </script>
</body>
</html>`;
}

function ensureGeneratedFrontend() {
  if (!fs.existsSync(generatedPublicPath)) {
    fs.mkdirSync(generatedPublicPath, { recursive: true });
  }

  const pageFile = path.join(generatedPublicPath, "page.html");
  const shouldWriteFallback = !fs.existsSync(pageFile)
    || fs.readFileSync(pageFile, "utf8").includes("Frontend fallback gerado pelo servidor");

  if (shouldWriteFallback) {
    fs.writeFileSync(pageFile, `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Solo Leveling - Daily Hunter System</title>
  <style>
    *{box-sizing:border-box}body{margin:0;min-height:100vh;overflow-x:hidden;background:linear-gradient(rgba(24,216,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(141,92,255,.05) 1px,transparent 1px),radial-gradient(circle at 58% 46%,rgba(24,216,255,.22),transparent 22rem),radial-gradient(circle at 78% 18%,rgba(141,92,255,.2),transparent 26rem),#03060c;background-size:44px 44px,44px 44px,auto,auto,auto;color:#eef7ff;font-family:Arial,sans-serif}body:before{content:"";position:fixed;inset:0;pointer-events:none;background:linear-gradient(180deg,transparent,rgba(3,6,12,.45)),repeating-linear-gradient(180deg,rgba(255,255,255,.025) 0 1px,transparent 1px 4px)}main{min-height:100vh;padding:24px clamp(18px,4vw,64px);display:grid;grid-template-rows:auto 1fr auto;gap:24px}.nav{display:flex;align-items:center;justify-content:space-between;gap:16px}.brand,.actions{display:flex;align-items:center;gap:12px}.mark{display:grid;place-items:center;width:46px;height:46px;border:1px solid #18d8ff;border-radius:8px;color:#18d8ff;font-weight:900;box-shadow:0 0 22px rgba(24,216,255,.35)}.hero{display:grid;align-items:center;grid-template-columns:minmax(0,1.05fr) minmax(320px,.95fr);gap:32px}.eyebrow{color:#18d8ff;text-transform:uppercase;font-size:12px;font-weight:900}.copy h1{margin:8px 0 14px;font-size:clamp(64px,13vw,150px);line-height:.84;text-shadow:0 0 22px rgba(24,216,255,.24)}.copy p{max-width:620px;color:#b5c7da;font-size:clamp(17px,2vw,22px);line-height:1.6}.buttons{display:flex;flex-wrap:wrap;gap:12px;margin-top:24px}a{color:#eef7ff;text-decoration:none}.btn{display:inline-flex;justify-content:center;min-width:154px;padding:13px 18px;border:1px solid rgba(24,216,255,.65);border-radius:8px;background:linear-gradient(135deg,rgba(24,216,255,.18),rgba(141,92,255,.22));box-shadow:0 0 18px rgba(24,216,255,.12)}.ghost{background:transparent;border-color:rgba(238,247,255,.22)}.gate{position:relative;display:grid;place-items:center;min-height:520px}.gate:before{content:"";position:absolute;width:min(72vw,540px);aspect-ratio:1;border-radius:50%;background:conic-gradient(from 120deg,transparent 0 22%,rgba(24,216,255,.9),transparent 38% 56%,rgba(141,92,255,.8),transparent 76% 100%);filter:drop-shadow(0 0 34px rgba(24,216,255,.3));opacity:.88}.gate:after{content:"";position:absolute;width:min(52vw,380px);aspect-ratio:1;border-radius:50%;border:1px solid rgba(238,247,255,.18);box-shadow:inset 0 0 42px rgba(24,216,255,.18),0 0 58px rgba(141,92,255,.18)}.core{z-index:1;display:grid;place-items:center;width:190px;height:190px;border:1px solid rgba(24,216,255,.55);border-radius:50%;background:rgba(5,7,13,.74);box-shadow:0 0 46px rgba(24,216,255,.25);text-transform:uppercase}.core span,.core small{color:#9db2c8}.core strong{font-size:26px}.cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.cards article{min-height:145px;border:1px solid rgba(24,216,255,.24);border-radius:8px;background:rgba(12,18,32,.72);box-shadow:0 0 28px rgba(24,216,255,.1);padding:18px}.cards span{color:#18d8ff;font-size:12px;font-weight:900;text-transform:uppercase}.cards strong{display:block;margin:8px 0;font-size:22px}.cards small{color:#9db2c8;line-height:1.55}@media(max-width:900px){.hero{grid-template-columns:1fr}.gate{min-height:360px}.cards{grid-template-columns:1fr}}@media(max-width:620px){.nav{align-items:flex-start;flex-direction:column}.copy h1{font-size:clamp(54px,19vw,86px)}.gate{min-height:290px}.core{width:150px;height:150px}}
  </style>
</head>
<body>
  <main>
    <nav class="nav"><a class="brand" href="/"><span class="mark">SL</span><strong>Daily Hunter</strong></a><div class="actions"><a href="/login.html">Entrar</a><a class="btn" href="/register.html">Criar conta</a></div></nav>
    <section class="hero">
      <div class="copy"><span class="eyebrow">Sistema do Hunter ativado</span><h1>Solo Leveling</h1><p>Transforme suas missoes diarias em XP, niveis, ranks e batalhas contra bosses.</p><div class="buttons"><a class="btn" href="/register.html">Despertar hunter</a><a class="btn ghost" href="/login.html">Entrar no sistema</a></div></div>
      <div class="gate" aria-hidden="true"><div class="core"><span>Rank E</span><strong>Nivel 1</strong><small>0 / 100 XP</small></div></div>
    </section>
    <section class="cards"><article><span>Missoes</span><strong>XP automatico</strong><small>O sistema analisa a tarefa e define uma recompensa equilibrada.</small></article><article><span>Evolucao</span><strong>Level up</strong><small>Ganhe XP, suba de nivel e avance de Rank E ate Rank S.</small></article><article><span>Penalidade</span><strong>Boss spawn</strong><small>Falhou uma missao importante? Enfrente o boss e recupere progresso.</small></article></section>
  </main>
</body>
</html>`);
  }

  writeGeneratedPublicFile("login.html", generatedAuthPage("login"));
  writeGeneratedPublicFile("register.html", generatedAuthPage("register"));
  writeGeneratedPublicFile("dashboard.html", generatedAppPage("Dashboard", "Acompanhe seu nivel, XP, missoes pendentes, bosses ativos e historico recente em tempo real."));
  writeGeneratedPublicFile("desafios.html", generatedAppPage("Desafios", "Crie missoes, deixe o sistema calcular o XP, conclua objetivos e mantenha sua rotina sob controle."));
  writeGeneratedPublicFile("boss.html", generatedAppPage("Boss", "Enfrente penalidades, derrote bosses e recupere progresso quando o sistema exigir disciplina extra."));
  writeGeneratedPublicFile("ranking.html", generatedAppPage("Top Hunters", "Compare nivel, XP e progresso dos hunters mais fortes do sistema."));
  writeGeneratedPublicFile("perfil.html", generatedAppPage("Perfil", "Veja seus dados, rank atual e os eventos que marcaram sua evolucao."));
}

copyFrontendSourceToPublic();
ensureGeneratedFrontend();

const frontendPath = frontendPathCandidates.find((candidate) => {
  return fs.existsSync(path.join(candidate, "login.html"))
    && fs.existsSync(path.join(candidate, "register.html"))
    && fs.existsSync(path.join(candidate, "css", "style.css"));
}) || frontendPathCandidates.find((candidate) => {
  return fs.existsSync(path.join(candidate, "page.html"))
    || fs.existsSync(path.join(candidate, "index.html"));
});
const jwtSecret = process.env.JWT_SECRET || process.env.JWT_SECRE || "daily-hunter-dev-secret";

app.use(cors({
  origin: frontendOrigin === "*" ? true : frontendOrigin,
  credentials: frontendOrigin !== "*"
}));
app.use(express.json());
if (frontendPath) {
  console.log(`Frontend encontrado em: ${frontendPath}`);
  app.use(express.static(frontendPath, { index: false }));
} else {
  console.warn("Frontend nao encontrado. Verifique se a pasta frontend foi enviada para o deploy.");
}

app.get("/api/health", (req, res) => {
  res.json({
    name: "Solo Leveling - Daily Hunter System API",
    status: "online",
    storage: shouldUseLocalDatabase() ? "local-json" : "postgres",
    persistent_storage: !shouldUseLocalDatabase(),
    database_configured: hasUsableDatabaseUrl()
  });
});

app.get("/", (req, res) => {
  if (frontendPath) {
    const pageFile = path.join(frontendPath, "page.html");
    const indexFile = path.join(frontendPath, "index.html");

    if (fs.existsSync(pageFile)) {
      return res.sendFile(pageFile);
    }

    if (fs.existsSync(indexFile)) {
      return res.sendFile(indexFile);
    }
  }

  return res.json({
    name: "Solo Leveling - Daily Hunter System API",
    status: "online",
    message: "Frontend nao encontrado neste deploy. Use as rotas da API."
  });
});

function sendFrontendFile(fileName, res) {
  const searchPaths = [
    frontendPath,
    generatedPublicPath,
    ...frontendPathCandidates
  ].filter(Boolean);

  for (const candidate of searchPaths) {
    const filePath = path.join(candidate, fileName);
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
  }

  return res.status(404).json({
    message: `Arquivo ${fileName} nao encontrado no frontend do deploy.`
  });
}

frontendPageFiles.forEach((fileName) => {
  app.get(`/${fileName}`, (req, res) => sendFrontendFile(fileName, res));
});

function registerModularRoutes() {
  try {
    app.use(require("./routes/auth.routes"));
    app.use(require("./routes/challenge.routes"));
    app.use(require("./routes/player.routes"));
    app.use(require("./routes/boss.routes"));
    app.use(require("./routes/history.routes"));
    app.use(require("./routes/ranking.routes"));
    console.log("Rotas modulares carregadas.");
    return true;
  } catch (error) {
    console.error("Rotas modulares indisponiveis:", error.stack || error.message);
    return false;
  }
}

function registerFallbackRoutes() {
  const dataDir = path.join(__dirname, "data");
  const dbPath = path.join(dataDir, "dev-db.json");

  function ensureDb() {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify({
        users: [],
        challenges: [],
        bosses: [],
        history: []
      }, null, 2));
    }
  }

  function readDb() {
    ensureDb();
    return JSON.parse(fs.readFileSync(dbPath, "utf8"));
  }

  function writeDb(db) {
    ensureDb();
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  }

  function now() {
    return new Date().toISOString();
  }

  function publicUser(user) {
    if (!user) return null;
    const { senha, ...safeUser } = user;
    return safeUser;
  }

  function registerHistory(db, userId, action, description, xpEarned = 0) {
    db.history.push({
      id: crypto.randomUUID(),
      user_id: userId,
      action,
      description,
      xp_earned: xpEarned,
      created_at: now(),
      updated_at: now()
    });
  }

  function xpForNextLevel(level) {
    return ({ 1: 100, 2: 250, 3: 500, 4: 1000 })[level] || level * 500;
  }

  function calculateRank(level, xp) {
    if (level >= 20 || xp >= 10000) return "S";
    if (level >= 15 || xp >= 5000) return "A";
    if (level >= 10 || xp >= 2500) return "B";
    if (level >= 6 || xp >= 1000) return "C";
    if (level >= 3 || xp >= 250) return "D";
    return "E";
  }

  function normalizeText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function extractNumberBefore(text, unitPattern) {
    const regex = new RegExp(`(\\d+(?:[,.]\\d+)?)\\s*${unitPattern}`, "i");
    const match = text.match(regex);
    return match ? Number(match[1].replace(",", ".")) : 0;
  }

  function calculateMissionXp(payload) {
    const text = normalizeText(`${payload.title || ""} ${payload.description || ""}`);
    const difficulty = payload.difficulty || "normal";
    let xp = 10;

    const categories = [
      { words: ["correr", "corrida", "run"], base: 12 },
      { words: ["flexao", "flexoes", "push"], base: 12 },
      { words: ["estudar", "estudo", "curso", "ler", "leitura"], base: 8 },
      { words: ["treinar", "academia", "musculacao", "exercicio"], base: 16 },
      { words: ["limpar", "arrumar", "organizar"], base: 10 },
      { words: ["trabalhar", "projeto", "programar", "codigo"], base: 16 },
      { words: ["meditar", "alongar", "respirar"], base: 8 }
    ];

    for (const rule of categories) {
      if (rule.words.some((word) => text.includes(word))) {
        xp = Math.max(xp, rule.base);
      }
    }

    xp += Math.min(extractNumberBefore(text, "km|quilometros?") * 4, 40);
    xp += Math.min(extractNumberBefore(text, "min|mins|minutos?") * 0.22, 30);
    xp += Math.min(extractNumberBefore(text, "h|hora|horas") * 18, 45);
    xp += Math.min(extractNumberBefore(text, "flexoes?|abdominais?|agachamentos?|repeticoes?|reps?") * 0.25, 35);

    if (text.includes("dificil") || text.includes("intenso") || text.includes("pesado")) xp += 8;

    const multipliers = { facil: 0.85, normal: 1, dificil: 1.25 };
    const calculated = Math.round((xp * (multipliers[difficulty] || 1)) / 5) * 5;
    return Math.min(Math.max(calculated, 5), 120);
  }

  function auth(req, res, next) {
    try {
      const [, token] = String(req.headers.authorization || "").split(" ");
      if (!token) return res.status(401).json({ message: "Token nao informado." });

      const payload = jwt.verify(token, jwtSecret);
      const db = readDb();
      const user = db.users.find((item) => item.id === payload.userId);
      if (!user) return res.status(401).json({ message: "Usuario invalido." });

      req.user = user;
      req.db = db;
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Token invalido ou expirado." });
    }
  }

  function addXp(db, user, amount, reason) {
    user.xp = Math.max((user.xp || 0) + Math.max(Number(amount) || 0, 0), 0);
    while (user.xp >= xpForNextLevel(user.level)) {
      user.level += 1;
      registerHistory(db, user.id, "level_up", `LEVEL UP - Hunter alcancou o nivel ${user.level}.`, 0);
    }
    user.rank = calculateRank(user.level, user.xp);
    user.updated_at = now();
    registerHistory(db, user.id, "xp_ganho", reason, amount);
  }

  function defaultBoss(level) {
    if (level >= 3) return ["Igris da Penalidade", 3, "dificil", 120, "150 flexoes e 8 km de corrida"];
    if (level >= 2) return ["Cavaleiro da Falha", 2, "medio", 80, "100 flexoes e 5 km de corrida"];
    return ["Lobo Sombrio da Disciplina", 1, "facil", 50, "50 flexoes e 3 km de corrida"];
  }

  app.post("/register", async (req, res, next) => {
    try {
      const { nome, email, senha } = req.body;
      if (!nome || !email || !senha) return res.status(400).json({ message: "Nome, email e senha sao obrigatorios." });

      const db = readDb();
      const normalizedEmail = email.toLowerCase().trim();
      const existingUser = db.users.find((user) => user.email === normalizedEmail);
      if (existingUser) {
        existingUser.nome = nome.trim() || existingUser.nome;
        existingUser.senha = await bcrypt.hash(senha, 10);
        existingUser.updated_at = now();
        registerHistory(db, existingUser.id, "conta_recuperada", "Senha da conta atualizada pela tela de cadastro. Progresso preservado.", 0);
        writeDb(db);

        return res.status(200).json({
          user: publicUser(existingUser),
          token: null,
          account_recovered: true,
          message: "Conta encontrada. Senha atualizada. Agora faca login com essa senha."
        });
      }

      const user = {
        id: crypto.randomUUID(),
        nome: nome.trim(),
        email: normalizedEmail,
        senha: await bcrypt.hash(senha, 10),
        level: 1,
        xp: 0,
        rank: "E",
        created_at: now(),
        updated_at: now()
      };

      db.users.push(user);
      registerHistory(db, user.id, "cadastro", "Hunter registrado no sistema. Nivel 1, XP 0, Rank E.", 0);
      writeDb(db);

      return res.status(201).json({
        user: publicUser(user),
        token: jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "7d" })
      });
    } catch (error) {
      return next(error);
    }
  });

  app.post("/login", async (req, res, next) => {
    try {
      const db = readDb();
      const user = db.users.find((item) => item.email === String(req.body.email || "").toLowerCase().trim());

      if (!user || !(await bcrypt.compare(req.body.senha || "", user.senha))) {
        return res.status(401).json({ message: "Credenciais invalidas." });
      }

      return res.json({
        user: publicUser(user),
        token: jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "7d" })
      });
    } catch (error) {
      return next(error);
    }
  });

  app.get("/profile", auth, (req, res) => res.json(publicUser(req.user)));

  app.get("/player/status", auth, (req, res) => {
    const xpNext = xpForNextLevel(req.user.level);
    res.json({
      ...publicUser(req.user),
      _count: {
        challenges: req.db.challenges.filter((item) => item.user_id === req.user.id).length,
        bosses: req.db.bosses.filter((item) => item.user_id === req.user.id).length,
        history: req.db.history.filter((item) => item.user_id === req.user.id).length
      },
      xp_next_level: xpNext,
      progress_percent: Math.min(Math.round((req.user.xp / xpNext) * 100), 100)
    });
  });

  app.post("/player/level-up", auth, (req, res) => res.json({ user: publicUser(req.user), message: "Status verificado." }));

  app.get("/challenges", auth, (req, res) => {
    const list = req.db.challenges
      .filter((item) => item.user_id === req.user.id && (!req.query.status || item.status === req.query.status))
      .sort((a, b) => String(a.due_date).localeCompare(String(b.due_date)));
    res.json(list);
  });

  app.post("/challenges", auth, (req, res) => {
    if (!req.body.title || !req.body.title.trim()) return res.status(400).json({ message: "Titulo do desafio e obrigatorio." });
    const challenge = {
      id: crypto.randomUUID(),
      user_id: req.user.id,
      title: req.body.title.trim(),
      description: req.body.description || "",
      difficulty: req.body.difficulty || "normal",
      xp_reward: calculateMissionXp(req.body),
      status: "pendente",
      due_date: parseMissionDueDate(req.body.due_date).toISOString(),
      created_at: now(),
      updated_at: now()
    };
    req.db.challenges.push(challenge);
    registerHistory(req.db, req.user.id, "desafio_criado", `Desafio criado: ${challenge.title}.`, 0);
    writeDb(req.db);
    res.status(201).json(challenge);
  });

  app.put("/challenges/:id", auth, (req, res) => {
    const challenge = req.db.challenges.find((item) => item.id === req.params.id && item.user_id === req.user.id);
    if (!challenge) return res.status(404).json({ message: "Desafio nao encontrado." });
    if (req.body.title !== undefined && !req.body.title.trim()) return res.status(400).json({ message: "Titulo do desafio e obrigatorio." });

    Object.assign(challenge, {
      title: req.body.title !== undefined ? req.body.title.trim() : challenge.title,
      description: req.body.description !== undefined ? req.body.description : challenge.description,
      difficulty: req.body.difficulty !== undefined ? req.body.difficulty : challenge.difficulty,
      due_date: req.body.due_date !== undefined ? parseMissionDueDate(req.body.due_date).toISOString() : challenge.due_date,
      updated_at: now()
    });
    challenge.xp_reward = calculateMissionXp(challenge);
    registerHistory(req.db, req.user.id, "desafio_editado", `Desafio editado: ${challenge.title}.`, 0);
    writeDb(req.db);
    res.json(challenge);
  });

  app.delete("/challenges/:id", auth, (req, res) => {
    const index = req.db.challenges.findIndex((item) => item.id === req.params.id && item.user_id === req.user.id);
    if (index === -1) return res.status(404).json({ message: "Desafio nao encontrado." });
    const [challenge] = req.db.challenges.splice(index, 1);
    registerHistory(req.db, req.user.id, "desafio_excluido", `Desafio excluido: ${challenge.title}.`, 0);
    writeDb(req.db);
    res.json({ message: "Desafio excluido." });
  });

  app.patch("/challenges/:id/complete", auth, (req, res) => {
    const challenge = req.db.challenges.find((item) => item.id === req.params.id && item.user_id === req.user.id);
    if (!challenge) return res.status(404).json({ message: "Desafio nao encontrado." });
    if (challenge.status === "concluido") return res.status(400).json({ message: "Desafio ja foi concluido." });
    challenge.status = "concluido";
    challenge.updated_at = now();
    addXp(req.db, req.user, challenge.xp_reward, `Desafio concluido: ${challenge.title}.`);
    registerHistory(req.db, req.user.id, "desafio_concluido", `Desafio concluido: ${challenge.title}.`, challenge.xp_reward);
    writeDb(req.db);
    res.json({ challenge, player: publicUser(req.user), message: "XP atualizado" });
  });

  app.patch("/challenges/:id/fail", auth, (req, res) => {
    res.status(400).json({
      message: "A missao nao pode falhar por clique. Ela so falha automaticamente quando passar do vencimento."
    });
  });

  app.get("/boss", auth, (req, res) => {
    res.json(req.db.bosses.filter((item) => item.user_id === req.user.id));
  });

  app.post("/boss", auth, (req, res) => {
    const [name, levelRequired, difficulty, rewardXp, penalty] = defaultBoss(req.user.level);
    const boss = {
      id: crypto.randomUUID(),
      user_id: req.user.id,
      name: req.body.name || name,
      level_required: Number(req.body.level_required) || levelRequired,
      difficulty: req.body.difficulty || difficulty,
      reward_xp: Number(req.body.reward_xp) || rewardXp,
      penalty: req.body.penalty || penalty,
      status: "ativo",
      time_limit: req.body.time_limit || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      created_at: now(),
      updated_at: now()
    };
    req.db.bosses.push(boss);
    registerHistory(req.db, req.user.id, "boss_spawnado", `Boss Spawnado: ${boss.name}.`, 0);
    writeDb(req.db);
    res.status(201).json(boss);
  });

  app.patch("/boss/:id/defeat", auth, (req, res) => {
    const boss = req.db.bosses.find((item) => item.id === req.params.id && item.user_id === req.user.id);
    if (!boss) return res.status(404).json({ message: "Boss nao encontrado." });
    boss.status = "derrotado";
    boss.updated_at = now();
    addXp(req.db, req.user, boss.reward_xp, `Boss derrotado: ${boss.name}.`);
    registerHistory(req.db, req.user.id, "boss_derrotado", `Boss derrotado: ${boss.name}.`, boss.reward_xp);
    writeDb(req.db);
    res.json({ boss, player: publicUser(req.user), message: "Boss derrotado" });
  });

  app.patch("/boss/:id/fail", auth, (req, res) => {
    const boss = req.db.bosses.find((item) => item.id === req.params.id && item.user_id === req.user.id);
    if (!boss) return res.status(404).json({ message: "Boss nao encontrado." });
    boss.status = "falhou";
    boss.updated_at = now();
    req.user.xp = Math.max(req.user.xp - Math.ceil(boss.reward_xp / 2), 0);
    req.user.rank = calculateRank(req.user.level, req.user.xp);
    registerHistory(req.db, req.user.id, "boss_falhou", `Boss falhou: ${boss.name}.`, 0);
    writeDb(req.db);
    res.json({ boss, player: publicUser(req.user), message: "Boss falhou" });
  });

  app.delete("/boss/:id", auth, (req, res) => {
    const index = req.db.bosses.findIndex((item) => item.id === req.params.id && item.user_id === req.user.id);
    if (index === -1) return res.status(404).json({ message: "Boss nao encontrado." });
    const [boss] = req.db.bosses.splice(index, 1);
    registerHistory(req.db, req.user.id, "boss_excluido", `Boss excluido: ${boss.name}.`, 0);
    writeDb(req.db);
    res.json({ message: "Boss excluido.", boss });
  });

  app.get("/history", auth, (req, res) => {
    res.json(req.db.history.filter((item) => item.user_id === req.user.id).sort((a, b) => String(b.created_at).localeCompare(String(a.created_at))));
  });

  app.get("/ranking", auth, (req, res) => {
    const ranking = req.db.users.map((user) => ({
      id: user.id,
      nome: user.nome,
      level: user.level,
      xp: user.xp,
      rank: user.rank,
      completed_challenges: req.db.challenges.filter((item) => item.user_id === user.id && item.status === "concluido").length,
      defeated_bosses: req.db.bosses.filter((item) => item.user_id === user.id && item.status === "derrotado").length
    })).sort((a, b) => b.level - a.level || b.xp - a.xp || b.completed_challenges - a.completed_challenges || b.defeated_bosses - a.defeated_bosses);

    res.json(ranking);
  });

  console.log("Rotas fallback carregadas.");
}

if (!registerModularRoutes()) {
  if (!shouldUseLocalDatabase()) {
    throw new Error(
      "Rotas modulares/Prisma falharam e USE_LOCAL_DB=false. Corrija DATABASE_URL/Prisma em vez de usar JSON local, para nao perder contas em deploys."
    );
  }

  registerFallbackRoutes();
}

app.use((req, res) => {
  res.status(404).json({ message: "Rota nao encontrada." });
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    message: error.message || "Erro interno do servidor.",
    ...(error.locked ? { locked: true } : {})
  });
});

async function startServer() {
  if (!shouldUseLocalDatabase() && hasUsableDatabaseUrl()) {
    const migrateJsonToPrisma = require("./scripts/migrate-json-to-prisma");
    await migrateJsonToPrisma();
  }

  app.listen(port, () => {
    console.log(`Daily Hunter API online na porta ${port}`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Falha ao iniciar o Daily Hunter API:", error);
    process.exit(1);
  });
}

module.exports = app;
