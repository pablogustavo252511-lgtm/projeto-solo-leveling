function getDatabaseUrl() {
  const placeholders = [
    "USER:PASSWORD",
    "HOST:5432",
    "DATABASE",
    "cole_a_internal_database_url",
    "sua_url_real_do_banco"
  ];

  const candidates = [
    process.env.DATABASE_URL,
    process.env.POSTGRESQL_ADDON_URI,
    process.env.POSTGRES_URL,
    process.env.DATABASE_PUBLIC_URL,
    process.env.EXTERNAL_DATABASE_URL
  ];

  let url = candidates
    .map((candidate) => normalizeDatabaseUrlCandidate(candidate))
    .find((candidate) => candidate && !placeholders.some((placeholder) => candidate.includes(placeholder))) || "";

  if (!url && process.env.POSTGRESQL_ADDON_HOST && process.env.POSTGRESQL_ADDON_DB) {
    const user = encodeURIComponent(process.env.POSTGRESQL_ADDON_USER || "");
    const password = encodeURIComponent(process.env.POSTGRESQL_ADDON_PASSWORD || "");
    const host = process.env.POSTGRESQL_ADDON_HOST;
    const port = process.env.POSTGRESQL_ADDON_PORT || "5432";
    const database = process.env.POSTGRESQL_ADDON_DB;
    url = `postgresql://${user}:${password}@${host}:${port}/${database}`;
  }
  url = normalizeDatabaseUrlCandidate(url);

  return url;
}

function normalizeDatabaseUrlCandidate(value) {
  let url = String(value || "").trim();
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

function assertDatabaseReadyForPrisma() {
  if (hasUsableDatabaseUrl()) return;

  throw new Error(
    "DATABASE_URL nao configurada corretamente. No Render, coloque a Internal Database URL real do seu Postgres ou use USE_LOCAL_DB=true apenas para desenvolvimento local."
  );
}

const useLocalDatabase = shouldUseLocalDatabase();
const normalizedDatabaseUrl = getDatabaseUrl();
if (normalizedDatabaseUrl) {
  process.env.DATABASE_URL = normalizedDatabaseUrl;
}

let database;

if (useLocalDatabase) {
  console.warn("Banco local JSON ativo. Dados podem ser perdidos em deploys. Use apenas em desenvolvimento.");
  database = require("./localDatabase");
} else {
  assertDatabaseReadyForPrisma();
  const { PrismaClient } = require("@prisma/client");
  database = new PrismaClient();
}

module.exports = database;
