const {
  shouldUseLocalDatabase,
  assertDatabaseReadyForPrisma
} = require("./storageMode");

const useLocalDatabase = shouldUseLocalDatabase();

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
