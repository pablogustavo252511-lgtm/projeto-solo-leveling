function createInlineStorageMode() {
  const NODE_ENV = process.env.NODE_ENV || "development";
  const isProduction = NODE_ENV === "production" || Boolean(process.env.RENDER);
  const placeholders = [
    "USER:PASSWORD",
    "HOST:3306",
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
    if (keyValueMatch) url = keyValueMatch[1].trim();

    if (
      (url.startsWith('"') && url.endsWith('"'))
      || (url.startsWith("'") && url.endsWith("'"))
      || (url.startsWith("`") && url.endsWith("`"))
    ) {
      url = url.slice(1, -1).trim();
    }

    const mysqlMatch = url.match(/mysql2?:\/\/[^\s"'`]+/i);
    if (mysqlMatch) url = mysqlMatch[0];

    if (url.startsWith("mysql2://")) {
      url = `mysql://${url.slice("mysql2://".length)}`;
    }

    return url.replace(/[;,]+$/, "");
  }

  function hasPlaceholder(value) {
    return placeholders.some((placeholder) => String(value || "").includes(placeholder));
  }

  function getDatabaseUrl() {
    const DATABASE_URL = process.env.DATABASE_URL;
    const candidates = [
      DATABASE_URL,
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

  function hasUsableDatabaseUrl() {
    const url = getDatabaseUrl();
    return Boolean(url) && /^mysql:\/\//i.test(url) && !hasPlaceholder(url);
  }

  function shouldUseLocalDatabase() {
    if (isProduction) return false;
    if (process.env.USE_LOCAL_DB !== undefined) return process.env.USE_LOCAL_DB === "true";
    return !hasUsableDatabaseUrl();
  }

  function assertDatabaseReadyForPrisma() {
    const url = getDatabaseUrl();
    if (!url || hasPlaceholder(url)) {
      throw new Error("DATABASE_URL nao configurada corretamente. Va no Render > Environment e adicione a URL MySQL do Clever Cloud.");
    }
    if (!/^mysql:\/\//i.test(url)) {
      throw new Error("DATABASE_URL nao configurada corretamente. Va no Render > Environment e adicione a URL MySQL do Clever Cloud.");
    }
  }

  return {
    getDatabaseUrl,
    shouldUseLocalDatabase,
    assertDatabaseReadyForPrisma
  };
}

function loadStorageMode() {
  try {
    return require("./storageMode");
  } catch (error) {
    const isMissingStorageMode = error.code === "MODULE_NOT_FOUND"
      && String(error.message || "").includes("./storageMode");

    if (!isMissingStorageMode) throw error;

    console.warn("config/storageMode.js nao foi encontrado no deploy. Usando configuracao interna de Prisma/MySQL.");
    return createInlineStorageMode();
  }
}

const {
  getDatabaseUrl,
  shouldUseLocalDatabase,
  assertDatabaseReadyForPrisma
} = loadStorageMode();

const useLocalDatabase = shouldUseLocalDatabase();
const normalizedDatabaseUrl = getDatabaseUrl();

if (normalizedDatabaseUrl) {
  process.env.DATABASE_URL = normalizedDatabaseUrl;
}

let database;

if (useLocalDatabase) {
  console.warn("Banco local JSON ativo. Use apenas em desenvolvimento; em deploy os dados podem ser perdidos.");
  database = require("./localDatabase");
} else {
  assertDatabaseReadyForPrisma();
  const { PrismaClient } = require("@prisma/client");
  database = new PrismaClient();
}

module.exports = database;
