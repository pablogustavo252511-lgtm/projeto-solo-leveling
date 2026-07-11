const prisma = require("./database");
const HistoryService = require("./HistoryService");
const SystemLockService = require("./SystemLockService");

const XP_THRESHOLDS = {
  1: 100,
  2: 250,
  3: 500,
  4: 1000
};

function getXpForNextLevel(level) {
  return XP_THRESHOLDS[level] || level * 500;
}

function calculateRank(level, xp) {
  if (level >= 20 || xp >= 10000) return "S";
  if (level >= 15 || xp >= 5000) return "A";
  if (level >= 10 || xp >= 2500) return "B";
  if (level >= 6 || xp >= 1000) return "C";
  if (level >= 3 || xp >= 250) return "D";
  return "E";
}

class PlayerService {
  static getXpForNextLevel(level) {
    return getXpForNextLevel(level);
  }

  static calculateRank(level, xp) {
    return calculateRank(level, xp);
  }

  static async addXp(userId, amount, reason) {
    const safeAmount = Math.max(Number(amount) || 0, 0);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      const error = new Error("Usuario nao encontrado.");
      error.statusCode = 404;
      throw error;
    }

    let nextXp = Math.max(user.xp + safeAmount, 0);
    let nextLevel = user.level;
    let leveledUp = false;

    while (nextXp >= getXpForNextLevel(nextLevel)) {
      nextLevel += 1;
      leveledUp = true;
    }

    const nextRank = calculateRank(nextLevel, nextXp);
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { xp: nextXp, level: nextLevel, rank: nextRank }
    });

    if (safeAmount > 0) {
      await HistoryService.register(userId, "xp_ganho", reason, safeAmount);
    }

    if (leveledUp) {
      await HistoryService.register(
        userId,
        "level_up",
        `LEVEL UP - Hunter alcancou o nivel ${nextLevel}.`,
        0
      );
    }

    return {
      user: updated,
      leveledUp,
      message: leveledUp ? "LEVEL UP" : "XP atualizado"
    };
  }

  static async applyPenalty(userId, amount, reason) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      const error = new Error("Usuario nao encontrado.");
      error.statusCode = 404;
      throw error;
    }

    const penalty = Math.max(Number(amount) || 0, 0);
    const nextXp = Math.max(user.xp - penalty, 0);
    const nextRank = calculateRank(user.level, nextXp);

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { xp: nextXp, rank: nextRank }
    });

    await HistoryService.register(userId, "penalidade", reason, -penalty);
    return updated;
  }

  static async status(userId) {
    const lockState = await SystemLockService.syncPenaltyState(userId);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nome: true,
        email: true,
        level: true,
        xp: true,
        rank: true,
        created_at: true,
        updated_at: true,
        _count: {
          select: {
            challenges: true,
            bosses: true,
            history: true
          }
        }
      }
    });

    if (!user) {
      const error = new Error("Usuario nao encontrado.");
      error.statusCode = 404;
      throw error;
    }

    return {
      ...user,
      xp_next_level: getXpForNextLevel(user.level),
      progress_percent: Math.min(Math.round((user.xp / getXpForNextLevel(user.level)) * 100), 100),
      locked: lockState.locked,
      lock_message: lockState.lock_message,
      lock_bosses: lockState.lock_bosses
    };
  }

  static async levelUp(userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      const error = new Error("Usuario nao encontrado.");
      error.statusCode = 404;
      throw error;
    }

    if (user.xp < getXpForNextLevel(user.level)) {
      return {
        user,
        leveledUp: false,
        message: "XP insuficiente para evoluir."
      };
    }

    return this.addXp(userId, 0, "Verificacao manual de level up.");
  }
}

module.exports = PlayerService;
