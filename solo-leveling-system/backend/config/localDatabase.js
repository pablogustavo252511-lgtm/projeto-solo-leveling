const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const dataDir = path.join(__dirname, "..", "data");
const dbPath = path.join(dataDir, "dev-db.json");

const initialState = {
  users: [],
  challenges: [],
  bosses: [],
  history: []
};

function now() {
  return new Date().toISOString();
}

function ensureDatabase() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(initialState, null, 2));
  }
}

function readDatabase() {
  ensureDatabase();
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

function writeDatabase(db) {
  ensureDatabase();
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

function matchesWhere(item, where = {}) {
  return Object.entries(where).every(([key, value]) => {
    if (value === undefined) return true;
    return item[key] === value;
  });
}

function applyOrder(items, orderBy) {
  if (!orderBy) return items;
  const rules = Array.isArray(orderBy) ? orderBy : [orderBy];

  return [...items].sort((a, b) => {
    for (const rule of rules) {
      const [field, direction] = Object.entries(rule)[0];
      if (a[field] === b[field]) continue;
      const result = a[field] > b[field] ? 1 : -1;
      return direction === "desc" ? -result : result;
    }
    return 0;
  });
}

function countForUser(db, userId, relation, where = {}) {
  const table = relation === "challenges" ? db.challenges : db.bosses;
  if (relation === "history") {
    return db.history.filter((item) => item.user_id === userId).length;
  }

  return table.filter((item) => item.user_id === userId && matchesWhere(item, where)).length;
}

function applySelect(db, tableName, item, select) {
  if (!item || !select) return item;

  const selected = {};
  for (const [key, value] of Object.entries(select)) {
    if (key === "_count") {
      selected._count = {};
      for (const [relation, countOptions] of Object.entries(value.select || {})) {
        selected._count[relation] = countForUser(
          db,
          item.id,
          relation,
          countOptions.where || {}
        );
      }
      continue;
    }

    if (value === true) {
      selected[key] = item[key];
    }
  }

  return selected;
}

function createModel(tableName, defaults = {}) {
  return {
    async findUnique({ where, select } = {}) {
      const db = readDatabase();
      const item = db[tableName].find((entry) => matchesWhere(entry, where));
      return applySelect(db, tableName, item || null, select);
    },

    async findFirst({ where, select } = {}) {
      const db = readDatabase();
      const item = db[tableName].find((entry) => matchesWhere(entry, where));
      return applySelect(db, tableName, item || null, select);
    },

    async findMany({ where, select, orderBy } = {}) {
      const db = readDatabase();
      const filtered = db[tableName].filter((entry) => matchesWhere(entry, where));
      const ordered = applyOrder(filtered, orderBy);
      return ordered.map((item) => applySelect(db, tableName, item, select));
    },

    async create({ data }) {
      const db = readDatabase();
      const item = {
        id: crypto.randomUUID(),
        ...defaults,
        ...data,
        created_at: data.created_at || now(),
        updated_at: data.updated_at || now()
      };

      db[tableName].push(item);
      writeDatabase(db);
      return item;
    },

    async update({ where, data }) {
      const db = readDatabase();
      const index = db[tableName].findIndex((entry) => matchesWhere(entry, where));

      if (index === -1) {
        throw new Error(`Registro nao encontrado em ${tableName}.`);
      }

      db[tableName][index] = {
        ...db[tableName][index],
        ...data,
        updated_at: now()
      };
      writeDatabase(db);
      return db[tableName][index];
    },

    async delete({ where }) {
      const db = readDatabase();
      const index = db[tableName].findIndex((entry) => matchesWhere(entry, where));

      if (index === -1) {
        throw new Error(`Registro nao encontrado em ${tableName}.`);
      }

      const [removed] = db[tableName].splice(index, 1);
      writeDatabase(db);
      return removed;
    }
  };
}

module.exports = {
  user: createModel("users", { level: 1, xp: 0, rank: "E" }),
  challenge: createModel("challenges", { status: "pendente" }),
  boss: createModel("bosses", { status: "ativo" }),
  history: createModel("history", { xp_earned: 0 })
};
