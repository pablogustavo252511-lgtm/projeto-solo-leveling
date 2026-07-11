const prisma = require("./database");
const HistoryService = require("./HistoryService");
const PlayerService = require("./PlayerService");
const SystemLockService = require("./SystemLockService");

function defaultBossForLevel(level) {
  if (level >= 3) {
    return {
      name: "Igris da Penalidade",
      level_required: 3,
      difficulty: "dificil",
      reward_xp: 120,
      penalty: "150 flexoes e 8 km de corrida"
    };
  }

  if (level >= 2) {
    return {
      name: "Cavaleiro da Falha",
      level_required: 2,
      difficulty: "medio",
      reward_xp: 80,
      penalty: "100 flexoes e 5 km de corrida"
    };
  }

  return {
    name: "Lobo Sombrio da Disciplina",
    level_required: 1,
    difficulty: "facil",
    reward_xp: 50,
    penalty: "50 flexoes e 3 km de corrida"
  };
}

function hoursFromNow(hours) {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

class BossService {
  static async listActive(userId) {
    await SystemLockService.syncPenaltyState(userId);
    return prisma.boss.findMany({
      where: { user_id: userId },
      orderBy: [{ status: "asc" }, { created_at: "desc" }]
    });
  }

  static async create(userId, payload = {}) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      const error = new Error("Usuario nao encontrado.");
      error.statusCode = 404;
      throw error;
    }

    const base = defaultBossForLevel(user.level);
    const boss = await prisma.boss.create({
      data: {
        user_id: userId,
        challenge_id: payload.challenge_id || null,
        source: payload.source || "manual",
        name: payload.name || base.name,
        level_required: Number(payload.level_required) || base.level_required,
        difficulty: payload.difficulty || base.difficulty,
        reward_xp: Math.max(Number(payload.reward_xp) || base.reward_xp, 0),
        penalty: payload.penalty || base.penalty,
        lock_reason: payload.lock_reason || null,
        status: "ativo",
        time_limit: payload.time_limit ? new Date(payload.time_limit) : hoursFromNow(24)
      }
    });

    await HistoryService.register(userId, "boss_spawnado", `Boss Spawnado: ${boss.name}.`, 0);
    return boss;
  }

  static async defeat(userId, bossId) {
    const boss = await prisma.boss.findFirst({
      where: { id: bossId, user_id: userId }
    });

    if (!boss) {
      const error = new Error("Boss nao encontrado.");
      error.statusCode = 404;
      throw error;
    }

    if (boss.status !== "ativo") {
      const error = new Error("Boss nao esta ativo.");
      error.statusCode = 400;
      throw error;
    }

    const updatedBoss = await prisma.boss.update({
      where: { id: boss.id },
      data: { status: "derrotado" }
    });

    const xpResult = await PlayerService.addXp(
      userId,
      boss.reward_xp,
      `Boss derrotado: ${boss.name}.`
    );

    await HistoryService.register(userId, "boss_derrotado", `Boss derrotado: ${boss.name}.`, boss.reward_xp);
    return { boss: updatedBoss, player: xpResult.user, message: "Boss derrotado" };
  }

  static async fail(userId, bossId) {
    const boss = await prisma.boss.findFirst({
      where: { id: bossId, user_id: userId }
    });

    if (!boss) {
      const error = new Error("Boss nao encontrado.");
      error.statusCode = 404;
      throw error;
    }

    const updatedBoss = await prisma.boss.update({
      where: { id: boss.id },
      data: { status: "falhou" }
    });

    const player = await PlayerService.applyPenalty(
      userId,
      Math.ceil(boss.reward_xp / 2),
      `Falha contra boss: ${boss.name}.`
    );

    await HistoryService.register(userId, "boss_falhou", `Boss falhou: ${boss.name}.`, 0);

    if (boss.source === "overdue") {
      const replacement = await this.create(userId, {
        source: "overdue",
        challenge_id: boss.challenge_id,
        lock_reason: boss.lock_reason || "Derrote o boss para desbloquear o sistema."
      });
      return {
        boss: updatedBoss,
        nextBoss: replacement,
        player,
        message: "Boss falhou. O sistema continua bloqueado ate voce derrotar o novo boss."
      };
    }

    return { boss: updatedBoss, player, message: "Boss falhou" };
  }

  static async remove(userId, bossId) {
    const boss = await prisma.boss.findFirst({
      where: { id: bossId, user_id: userId }
    });

    if (!boss) {
      const error = new Error("Boss nao encontrado.");
      error.statusCode = 404;
      throw error;
    }

    if (boss.status === "ativo" && boss.source === "overdue") {
      const error = new Error("Este boss bloqueia o sistema. Derrote o boss para desbloquear.");
      error.statusCode = 423;
      throw error;
    }

    await prisma.boss.delete({ where: { id: boss.id } });
    await HistoryService.register(userId, "boss_excluido", `Boss excluido: ${boss.name}.`, 0);
    return { message: "Boss excluido.", boss };
  }
}

module.exports = BossService;
