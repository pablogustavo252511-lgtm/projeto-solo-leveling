function getDatabaseUrl() {
  return String(process.env.DATABASE_URL || "").trim();
}

function hasUsableDatabaseUrl() {
  const url = getDatabaseUrl();
  if (!url) return false;

  const placeholders = [
    "USER:PASSWORD",
    "HOST:5432",
    "DATABASE",
    "cole_a_internal_database_url",
    "sua_url_real_do_banco"
  ];

  return !placeholders.some((placeholder) => url.includes(placeholder));
}

function shouldUseLocalDatabase() {
  if (process.env.USE_LOCAL_DB !== undefined) {
    return process.env.USE_LOCAL_DB === "true";
  }

  return !hasUsableDatabaseUrl();
}

function assertDatabaseReadyForPrisma() {
  if (hasUsableDatabaseUrl()) return;

  throw new Error(
    "DATABASE_URL nao configurada corretamente. No Render, coloque a Internal Database URL real do seu Postgres ou use USE_LOCAL_DB=true apenas para desenvolvimento local."
  );
}

module.exports = {
  getDatabaseUrl,
  hasUsableDatabaseUrl,
  shouldUseLocalDatabase,
  assertDatabaseReadyForPrisma
};
