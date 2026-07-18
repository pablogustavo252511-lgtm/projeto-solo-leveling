const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production" || Boolean(process.env.RENDER);
const USE_LOCAL_DB = !isProduction && process.env.USE_LOCAL_DB === "true";
let loggedDatabaseInfo = false;

const PLACEHOLDERS = [
  "USER:PASSWORD",
  "HOST:5432",
  "DATABASE",
  "cole_a_internal_database_url",
  "sua_url_real_do_banco"
];

function normalizeDatabaseUrlCandidate(value) {
  let url = String(value || "").trim();
  if (!url) return "";

  url = url.replace(/^\uFEFF/, "").trim();

  const keyValueMatch = url.match(/^[A-Z0-9_]+\s*=\s*(.+)$/i);
  if (keyValueMatch) {
    url = keyValueMatch[1].trim();
  }

  if (
    (url.startsWith('"') && url.endsWith('"'))
    || (url.startsWith("'") && url.endsWith("'"))
    || (url.startsWith("`") && url.endsWith("`"))
  ) {
    url = url.slice(1, -1).trim();
  }

  const postgresMatch = url.match(new RegExp("postgres(?:ql)?://[^\\s\"'`]+", "i"));
  if (postgresMatch) {
    url = postgresMatch[0];
  }

  return url.replace(/[;,]+$/, "");
}

function hasPlaceholder(value) {
  return PLACEHOLDERS.some((placeholder) => String(value || "").includes(placeholder));
}

function getDatabaseUrl() {
  const DATABASE_URL = process.env.DATABASE_URL;
  const candidates = [
    DATABASE_URL,
    process.env.POSTGRESQL_ADDON_URI,
    process.env.POSTGRES_ADDON_URI,
    process.env.POSTGRES_URL,
    process.env.JAWSDB_URL,
    process.env.DATABASE_PUBLIC_URL,
    process.env.EXTERNAL_DATABASE_URL
  ];

  let url = candidates
    .map((candidate) => normalizeDatabaseUrlCandidate(candidate))
    .find((candidate) => candidate && !hasPlaceholder(candidate)) || "";

  if (!url) {
    const host = process.env.POSTGRESQL_ADDON_HOST || process.env.POSTGRES_HOST || process.env.PGHOST;
    const database = process.env.POSTGRESQL_ADDON_DB || process.env.POSTGRES_DB || process.env.PGDATABASE;

    if (host && database) {
      const user = encodeURIComponent(
        process.env.POSTGRESQL_ADDON_USER || process.env.POSTGRES_USER || process.env.PGUSER || ""
      );
      const password = encodeURIComponent(
        process.env.POSTGRESQL_ADDON_PASSWORD || process.env.POSTGRES_PASSWORD || process.env.PGPASSWORD || ""
      );
      const port = process.env.POSTGRESQL_ADDON_PORT || process.env.POSTGRES_PORT || process.env.PGPORT || "5432";
      url = `postgresql://${user}:${password}@${host}:${port}/${database}`;
    }
  }

  return normalizeDatabaseUrlCandidate(url);
}

function isPostgresDatabaseUrl(url) {
  return /^(postgresql|postgres):\/\//i.test(String(url || ""));
}

function parseDatabaseUrl(url) {
  try {
    return new URL(url);
  } catch {
    throw new Error("DATABASE_URL possui formato invalido.");
  }
}

function getDatabaseName(parsedUrl) {
  return decodeURIComponent(parsedUrl.pathname.replace(/^\/+/, ""));
}

function validateDatabaseUrl(url) {
  if (!url) {
    throw new Error(
      "DATABASE_URL nao configurada. Adicione a Connection URI do Clever Cloud no Render."
    );
  }

  const parsedUrl = parseDatabaseUrl(url);

  if (parsedUrl.protocol !== "postgresql:" && parsedUrl.protocol !== "postgres:") {
    throw new Error("DATABASE_URL deve utilizar PostgreSQL.");
  }

  const databaseName = getDatabaseName(parsedUrl);
  if (!databaseName || databaseName === "postgres") {
    throw new Error(
      "DATABASE_URL esta apontando para o banco 'postgres'. Use o Database Name especifico fornecido pelo Clever Cloud."
    );
  }

  if (!loggedDatabaseInfo) {
    console.log("Configuracao PostgreSQL carregada:", {
      host: parsedUrl.hostname,
      port: parsedUrl.port,
      database: databaseName
    });
    loggedDatabaseInfo = true;
  }

  return { parsedUrl, databaseName };
}

function hasUsableDatabaseUrl() {
  const url = getDatabaseUrl();
  if (!url || hasPlaceholder(url) || !isPostgresDatabaseUrl(url)) return false;

  try {
    validateDatabaseUrl(url);
    return true;
  } catch {
    return false;
  }
}

function shouldUseLocalDatabase() {
  if (isProduction) {
    return false;
  }

  if (process.env.USE_LOCAL_DB !== undefined) {
    return process.env.USE_LOCAL_DB === "true";
  }

  return !hasUsableDatabaseUrl();
}

function assertDatabaseReadyForPrisma() {
  const url = getDatabaseUrl();

  if (hasPlaceholder(url)) {
    throw new Error(
      "DATABASE_URL invalida. Use a Connection URI PostgreSQL do Clever Cloud."
    );
  }

  validateDatabaseUrl(url);
}

const normalizedDatabaseUrl = getDatabaseUrl();
if (normalizedDatabaseUrl) {
  process.env.DATABASE_URL = normalizedDatabaseUrl;
}

module.exports = {
  USE_LOCAL_DB,
  NODE_ENV,
  isProduction,
  usePrisma: !shouldUseLocalDatabase(),
  getDatabaseUrl,
  hasUsableDatabaseUrl,
  shouldUseLocalDatabase,
  assertDatabaseReadyForPrisma,
  validateDatabaseUrl
};
