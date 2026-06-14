require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 3000;
const frontendOrigin = process.env.FRONTEND_ORIGIN || "*";
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
const jwtSecret = process.env.JWT_SECRET || "daily-hunter-dev-secret";

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
    status: "online"
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
    console.warn(`Rotas modulares indisponiveis: ${error.message}`);
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
      if (db.users.some((user) => user.email === normalizedEmail)) {
        return res.status(409).json({ message: "Email ja cadastrado." });
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
      due_date: req.body.due_date || now(),
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
      due_date: req.body.due_date !== undefined ? req.body.due_date : challenge.due_date,
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
    const challenge = req.db.challenges.find((item) => item.id === req.params.id && item.user_id === req.user.id);
    if (!challenge) return res.status(404).json({ message: "Desafio nao encontrado." });
    challenge.status = "falhou";
    req.user.xp = Math.max(req.user.xp - Math.max(Math.ceil(challenge.xp_reward / 2), 5), 0);
    req.user.rank = calculateRank(req.user.level, req.user.xp);
    const [name, levelRequired, difficulty, rewardXp, penalty] = defaultBoss(req.user.level);
    const boss = {
      id: crypto.randomUUID(),
      user_id: req.user.id,
      name,
      level_required: levelRequired,
      difficulty,
      reward_xp: rewardXp,
      penalty,
      status: "ativo",
      time_limit: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      created_at: now(),
      updated_at: now()
    };
    req.db.bosses.push(boss);
    registerHistory(req.db, req.user.id, "missao_falhou", `Missao Falhou: ${challenge.title}.`, 0);
    writeDb(req.db);
    res.json({ challenge, boss, player: publicUser(req.user), message: "Missao Falhou" });
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
  registerFallbackRoutes();
}

app.use((req, res) => {
  res.status(404).json({ message: "Rota nao encontrada." });
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    message: error.message || "Erro interno do servidor."
  });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Daily Hunter API online na porta ${port}`);
  });
}

module.exports = app;
