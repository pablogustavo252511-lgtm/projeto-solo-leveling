const PLACEHOLDERS = [
  "USER:PASSWORD",
  "HOST:3306",
  "HOST:5432",
  "DATABASE",
  "cole_a_internal_database_url",
  "sua_url_real_do_banco"
];

function normalizeDatabaseUrlCandidate(value) {
  let url = String(value || "").trim();

  if (url.startsWith("DATABASE_URL=")) {
    url = url.slice("DATABASE_URL=".length).trim();
  }

  if ((url.startsWith('"') && url.endsWith('"')) || (url.startsWith("'") && url.endsWith("'"))) {
    url = url.slice(1, -1).trim();
  }

  if (url.startsWith("mysql2://")) {
    url = `mysql://${url.slice("mysql2://".length)}`;
  }

  return url;
}

function hasPlaceholder(value) {
  return PLACEHOLDERS.some((placeholder) => String(value || "").includes(placeholder));
}

function getDatabaseUrl() {
  const candidates = [
    process.env.DATABASE_URL,
    process.env.MYSQL_ADDON_URI,
    process.env.MYSQL_URL,
    process.env.CLEARDB_DATABASE_URL,
    process.env.JAWSDB_URL,
    process.env.DATABASE_PUBLIC_URL,
    process.env.EXTERNAL_DATABASE_URL
  ];

  let url = candidates
    .map((candidate) => normalizeDatabaseUrlCandidate(candidate))
    .find((candidate) => candidate && !hasPlaceholder(candidate)) || "";

  if (!url && process.env.MYSQL_ADDON_HOST && process.env.MYSQL_ADDON_DB) {
    const user = encodeURIComponent(process.env.MYSQL_ADDON_USER || "");
    const password = encodeURIComponent(process.env.MYSQL_ADDON_PASSWORD || "");
    const host = process.env.MYSQL_ADDON_HOST;
    const port = process.env.MYSQL_ADDON_PORT || "3306";
    const database = process.env.MYSQL_ADDON_DB;
    url = `mysql://${user}:${password}@${host}:${port}/${database}`;
  }

  return normalizeDatabaseUrlCandidate(url);
}

function isMysqlDatabaseUrl(url) {
  return /^mysql:\/\//i.test(String(url || ""));
}

function hasUsableDatabaseUrl() {
  const url = getDatabaseUrl();
  return Boolean(url) && isMysqlDatabaseUrl(url) && !hasPlaceholder(url);
}

function shouldUseLocalDatabase() {
  if (process.env.NODE_ENV === "production" || process.env.RENDER) {
    return false;
  }

  if (process.env.USE_LOCAL_DB !== undefined) {
    return process.env.USE_LOCAL_DB === "true";
  }

  return !hasUsableDatabaseUrl();
}

function assertDatabaseReadyForPrisma() {
  const url = getDatabaseUrl();

  if (!url || hasPlaceholder(url)) {
    throw new Error(
      "Configure DATABASE_URL no Render Environment Variables. Use a URL MySQL do Clever Cloud no formato mysql://USER:PASSWORD@HOST:PORT/DATABASE e USE_LOCAL_DB=false."
    );
  }

  if (!isMysqlDatabaseUrl(url)) {
    throw new Error(
      "DATABASE_URL invalida para este backend. O Prisma esta configurado para MySQL, entao use uma URL mysql:// do Clever Cloud, nao postgresql://."
    );
  }
}

const normalizedDatabaseUrl = getDatabaseUrl();
if (normalizedDatabaseUrl) {
  process.env.DATABASE_URL = normalizedDatabaseUrl;
}

module.exports = {
  getDatabaseUrl,
  hasUsableDatabaseUrl,
  shouldUseLocalDatabase,
  assertDatabaseReadyForPrisma
};
