require("dotenv").config();

const fs = require("fs");
const path = require("path");

function loadStorageMode() {
  try {
    return require("../config/storageMode");
  } catch (error) {
    const isMissingStorageMode = error.code === "MODULE_NOT_FOUND"
      && String(error.message || "").includes("../config/storageMode");

    if (!isMissingStorageMode) throw error;

    const normalizeDatabaseUrl = (value) => {
      let url = String(value || "").trim();
      const keyValueMatch = url.match(/^[A-Z0-9_]+\s*=\s*(.+)$/i);
      if (keyValueMatch) url = keyValueMatch[1].trim();
      const mysqlMatch = url.match(/mysql2?:\/\/[^\s"'`]+/i);
      if (mysqlMatch) url = mysqlMatch[0];
      return url.startsWith("mysql2://") ? `mysql://${url.slice("mysql2://".length)}` : url;
    };

    return {
      getDatabaseUrl: () => normalizeDatabaseUrl(process.env.DATABASE_URL),
      hasUsableDatabaseUrl: () => /^mysql:\/\//i.test(normalizeDatabaseUrl(process.env.DATABASE_URL)),
      shouldUseLocalDatabase: () => process.env.NODE_ENV !== "production" && process.env.USE_LOCAL_DB === "true"
    };
  }
}

const {
  getDatabaseUrl,
  hasUsableDatabaseUrl,
  shouldUseLocalDatabase
} = loadStorageMode();

const normalizedDatabaseUrl = getDatabaseUrl();
if (normalizedDatabaseUrl) {
  process.env.DATABASE_URL = normalizedDatabaseUrl;
}

function shouldSkipMigration() {
  return shouldUseLocalDatabase() || !hasUsableDatabaseUrl();
}

function readLocalJson() {
  const filePath = path.join(__dirname, "..", "data", "dev-db.json");
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function parseDate(value, fallback = new Date()) {
  const parsed = value ? new Date(value) : fallback;
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

function sanitizeChallengeStatus(status) {
  return ["pendente", "concluido", "falhou"].includes(status) ? status : "pendente";
}

function sanitizeBossStatus(status) {
  return ["ativo", "derrotado", "falhou"].includes(status) ? status : "ativo";
}

async function migrate() {
  if (shouldSkipMigration()) {
    console.log("Migracao JSON ignorada: banco persistente nao configurado ou USE_LOCAL_DB=true.");
    return;
  }

  const data = readLocalJson();
  if (!data) {
    console.log("Migracao JSON ignorada: backend/data/dev-db.json nao encontrado.");
    return;
  }

  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();
  const counts = { users: 0, challenges: 0, bosses: 0, history: 0 };

  try {
    for (const user of data.users || []) {
      if (!user.id || !user.email || !user.senha) continue;

      await prisma.user.upsert({
        where: { email: String(user.email).toLowerCase().trim() },
        create: {
          id: user.id,
          nome: user.nome || "Hunter",
          email: String(user.email).toLowerCase().trim(),
          senha: user.senha,
          level: Math.max(Number(user.level) || 1, 1),
          xp: Math.max(Number(user.xp) || 0, 0),
          rank: user.rank || "E",
          created_at: parseDate(user.created_at),
          updated_at: parseDate(user.updated_at)
        },
        update: {
          nome: user.nome || "Hunter"
        }
      });

      counts.users += 1;
    }

    for (const challenge of data.challenges || []) {
      if (!challenge.id || !challenge.user_id || !challenge.title) continue;

      await prisma.challenge.upsert({
        where: { id: challenge.id },
        create: {
          id: challenge.id,
          user_id: challenge.user_id,
          title: challenge.title,
          description: challenge.description || "",
          difficulty: challenge.difficulty || "normal",
          xp_reward: Math.max(Number(challenge.xp_reward) || 0, 0),
          status: sanitizeChallengeStatus(challenge.status),
          due_date: parseDate(challenge.due_date),
          created_at: parseDate(challenge.created_at),
          updated_at: parseDate(challenge.updated_at)
        },
        update: {
          title: challenge.title,
          description: challenge.description || "",
          difficulty: challenge.difficulty || "normal",
          xp_reward: Math.max(Number(challenge.xp_reward) || 0, 0),
          status: sanitizeChallengeStatus(challenge.status),
          due_date: parseDate(challenge.due_date)
        }
      });

      counts.challenges += 1;
    }

    for (const boss of data.bosses || []) {
      if (!boss.id || !boss.user_id || !boss.name) continue;

      await prisma.boss.upsert({
        where: { id: boss.id },
        create: {
          id: boss.id,
          user_id: boss.user_id,
          challenge_id: boss.challenge_id || null,
          source: boss.source || "manual",
          name: boss.name,
          level_required: Math.max(Number(boss.level_required) || 1, 1),
          difficulty: boss.difficulty || "normal",
          reward_xp: Math.max(Number(boss.reward_xp) || 0, 0),
          penalty: boss.penalty || "Penalidade pendente",
          lock_reason: boss.lock_reason || null,
          status: sanitizeBossStatus(boss.status),
          time_limit: parseDate(boss.time_limit),
          created_at: parseDate(boss.created_at),
          updated_at: parseDate(boss.updated_at)
        },
        update: {
          challenge_id: boss.challenge_id || null,
          source: boss.source || "manual",
          name: boss.name,
          level_required: Math.max(Number(boss.level_required) || 1, 1),
          difficulty: boss.difficulty || "normal",
          reward_xp: Math.max(Number(boss.reward_xp) || 0, 0),
          penalty: boss.penalty || "Penalidade pendente",
          lock_reason: boss.lock_reason || null,
          status: sanitizeBossStatus(boss.status),
          time_limit: parseDate(boss.time_limit)
        }
      });

      counts.bosses += 1;
    }

    for (const item of data.history || []) {
      if (!item.id || !item.user_id || !item.action) continue;

      await prisma.history.upsert({
        where: { id: item.id },
        create: {
          id: item.id,
          user_id: item.user_id,
          action: item.action,
          description: item.description || item.action,
          xp_earned: Number(item.xp_earned) || 0,
          created_at: parseDate(item.created_at)
        },
        update: {
          action: item.action,
          description: item.description || item.action,
          xp_earned: Number(item.xp_earned) || 0
        }
      });

      counts.history += 1;
    }

    console.log(
      `Migracao JSON concluida: ${counts.users} usuarios, ${counts.challenges} desafios, ${counts.bosses} bosses, ${counts.history} historicos.`
    );
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  migrate().catch((error) => {
    console.error("Erro ao migrar JSON para Prisma:", error);
    process.exit(1);
  });
}

module.exports = migrate;
