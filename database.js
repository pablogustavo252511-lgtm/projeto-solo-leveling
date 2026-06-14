const useLocalDatabase = process.env.USE_LOCAL_DB !== "false";

let database;

if (useLocalDatabase) {
  database = require("./localDatabase");
} else {
  const { PrismaClient } = require("@prisma/client");
  database = new PrismaClient();
}

module.exports = database;
