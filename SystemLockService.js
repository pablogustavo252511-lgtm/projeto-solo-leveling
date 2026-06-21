const prisma = require("../config/database");
const HistoryService = require("./HistoryService");

function calculateRank(level, xp) {
  if (level >= 20 || xp >= 10000) return "S";
  if (level >= 15 || xp >= 5000) return "A";
  if (level >= 10 || xp >= 2500) return "B";
  if (level >= 6 || xp >= 1000) return "C";
  if (level >= 3 || xp >= 250) return "D";
  return "E";
}

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

function isExpired(dateValue) {
  if (!dateValue) return false;
  const dueDate = new Date(dateValue);
  return Number.isFinite(dueDate.getTime()) && dueDate.getTime() < Date.now();
}

function getXpForNextLevel(level) {
  return ({ 1: 100, 2: 250, 3: 500, 4: 1000 })[level] || level * 500;
}

async function restorePrematureFailures(userId) {
  const failedChallenges = await prisma.challenge.findMany({
    where: { user_id: userId, status: "falhou" }
  });

  for (const challenge of failedChallenges) {
    if (isExpired(challenge.due_date)) continue;

    await prisma.challenge.update({
      where: { id: challenge.id },
      data: { status: "pendente" }
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      const restoredXp = Math.max(Math.ceil(Number(challenge.xp_reward || 0) / 2), 5);
      let nextXp = Math.max(Number(user.xp || 0) + restoredXp, 0);
      let nextLevel = Number(user.level || 1);

      while (nextXp >= getXpForNextLevel(nextLevel)) {
        nextLevel += 1;
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          xp: nextXp,
          level: nextLevel,
          rank: calculateRank(nextLevel, nextXp)
        }
      });
    }

    await HistoryService.register(
      userId,
      "falha_corrigida",
      `Falha manual corrigida: ${challenge.title} voltou para pendente porque ainda nao venceu.`,
      0
    );
  }
}

async function createPenaltyBoss(user, challenge) {
  const existing = await prisma.boss.findFirst({
    where: {
      user_id: user.id,
      challenge_id: challenge.id,
      source: "overdue",
      status: "ativo"
    }
  });

  if (existing) return existing;

  const base = defaultBossForLevel(user.level);
  const reason = `Missao vencida: ${challenge.title}. Enfrente o boss para desbloquear o sistema.`;

  const boss = await prisma.boss.create({
    data: {
      user_id: user.id,
      challenge_id: challenge.id,
      source: "overdue",
      name: base.name,
      level_required: base.level_required,
      difficulty: base.difficulty,
      reward_xp: base.reward_xp,
      penalty: base.penalty,
      lock_reason: reason,
      status: "ativo",
      time_limit: hoursFromNow(24)
    }
  });

  await HistoryService.register(user.id, "boss_bloqueio", reason, 0);
  return boss;
}

class SystemLockService {
  static async syncPenaltyState(userId) {
    await restorePrematureFailures(userId);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      const error = new Error("Usuario nao encontrado.");
      error.statusCode = 404;
      throw error;
    }

    const pendingChallenges = await prisma.challenge.findMany({
      where: { user_id: userId, status: "pendente" }
    });

    const overdueChallenges = pendingChallenges.filter((challenge) => isExpired(challenge.due_date));
    let currentUser = user;

    for (const challenge of overdueChallenges) {
      await prisma.challenge.update({
        where: { id: challenge.id },
        data: { status: "falhou" }
      });

      const penalty = Math.max(Math.ceil(Number(challenge.xp_reward || 0) / 2), 5);
      const nextXp = Math.max(Number(currentUser.xp || 0) - penalty, 0);
      const nextRank = calculateRank(currentUser.level, nextXp);

      currentUser = await prisma.user.update({
        where: { id: userId },
        data: { xp: nextXp, rank: nextRank }
      });

      await HistoryService.register(userId, "missao_vencida", `Missao Falhou por vencimento: ${challenge.title}.`, -penalty);
      await createPenaltyBoss(currentUser, challenge);
    }

    const activeLockBosses = await prisma.boss.findMany({
      where: {
        user_id: userId,
        source: "overdue",
        status: "ativo"
      },
      orderBy: { created_at: "asc" }
    });

    return {
      locked: activeLockBosses.length > 0,
      lock_message: activeLockBosses.length
        ? "Sistema bloqueado. Voce falhou uma missao no prazo. Va para a aba Boss e derrote o boss para liberar o sistema."
        : "",
      lock_bosses: activeLockBosses
    };
  }

  static async assertUnlocked(userId) {
    const lockState = await this.syncPenaltyState(userId);
    if (lockState.locked) {
      const error = new Error(lockState.lock_message);
      error.statusCode = 423;
      error.locked = true;
      throw error;
    }
    return lockState;
  }
}

module.exports = SystemLockService;
