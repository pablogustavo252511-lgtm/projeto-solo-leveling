const prisma = require("../config/database");
const HistoryService = require("./HistoryService");
const PlayerService = require("./PlayerService");
const BossService = require("./BossService");
const MissionXpService = require("./MissionXpService");
const SystemLockService = require("./SystemLockService");

class ChallengeService {
  static async list(userId, status) {
    await SystemLockService.assertUnlocked(userId);
    return prisma.challenge.findMany({
      where: {
        user_id: userId,
        ...(status ? { status } : {})
      },
      orderBy: [{ due_date: "asc" }, { created_at: "desc" }]
    });
  }

  static async create(userId, payload) {
    await SystemLockService.assertUnlocked(userId);
    if (!payload.title || !payload.title.trim()) {
      const error = new Error("Titulo do desafio e obrigatorio.");
      error.statusCode = 400;
      throw error;
    }

    const challenge = await prisma.challenge.create({
      data: {
        user_id: userId,
        title: payload.title.trim(),
        description: payload.description || "",
        difficulty: payload.difficulty || "normal",
        xp_reward: MissionXpService.calculate(payload),
        status: "pendente",
        due_date: payload.due_date ? new Date(payload.due_date) : new Date()
      }
    });

    await HistoryService.register(userId, "desafio_criado", `Desafio criado: ${challenge.title}.`, 0);
    return challenge;
  }

  static async update(userId, challengeId, payload) {
    await SystemLockService.assertUnlocked(userId);
    const challenge = await this.findOwned(userId, challengeId);
    if (payload.title !== undefined && !payload.title.trim()) {
      const error = new Error("Titulo do desafio e obrigatorio.");
      error.statusCode = 400;
      throw error;
    }

    const nextTitle = payload.title !== undefined ? payload.title.trim() : challenge.title;
    const nextDescription = payload.description !== undefined ? payload.description : challenge.description;
    const nextDifficulty = payload.difficulty !== undefined ? payload.difficulty : challenge.difficulty;
    const shouldRecalculateXp = payload.title !== undefined
      || payload.description !== undefined
      || payload.difficulty !== undefined;

    const updated = await prisma.challenge.update({
      where: { id: challenge.id },
      data: {
        ...(payload.title !== undefined ? { title: nextTitle } : {}),
        ...(payload.description !== undefined ? { description: nextDescription } : {}),
        ...(payload.difficulty !== undefined ? { difficulty: nextDifficulty } : {}),
        ...(shouldRecalculateXp ? {
          xp_reward: MissionXpService.calculate({
            title: nextTitle,
            description: nextDescription,
            difficulty: nextDifficulty
          })
        } : {}),
        ...(payload.status !== undefined ? { status: payload.status } : {}),
        ...(payload.due_date !== undefined ? { due_date: new Date(payload.due_date) } : {})
      }
    });

    await HistoryService.register(userId, "desafio_editado", `Desafio editado: ${updated.title}.`, 0);
    return updated;
  }

  static async remove(userId, challengeId) {
    await SystemLockService.assertUnlocked(userId);
    const challenge = await this.findOwned(userId, challengeId);
    await prisma.challenge.delete({ where: { id: challenge.id } });
    await HistoryService.register(userId, "desafio_excluido", `Desafio excluido: ${challenge.title}.`, 0);
    return { message: "Desafio excluido." };
  }

  static async complete(userId, challengeId) {
    await SystemLockService.assertUnlocked(userId);
    const challenge = await this.findOwned(userId, challengeId);
    if (challenge.status === "concluido") {
      const error = new Error("Desafio ja foi concluido.");
      error.statusCode = 400;
      throw error;
    }

    const updated = await prisma.challenge.update({
      where: { id: challenge.id },
      data: { status: "concluido" }
    });

    const playerResult = await PlayerService.addXp(
      userId,
      updated.xp_reward,
      `Desafio concluido: ${updated.title}.`
    );

    await HistoryService.register(userId, "desafio_concluido", `Desafio concluido: ${updated.title}.`, updated.xp_reward);
    return { challenge: updated, player: playerResult.user, message: playerResult.message };
  }

  static async fail(userId, challengeId) {
    await SystemLockService.assertUnlocked(userId);
    const challenge = await this.findOwned(userId, challengeId);
    if (challenge.status === "falhou") {
      const error = new Error("Desafio ja esta marcado como falhou.");
      error.statusCode = 400;
      throw error;
    }

    const updated = await prisma.challenge.update({
      where: { id: challenge.id },
      data: { status: "falhou" }
    });

    const penaltyValue = Math.max(Math.ceil(updated.xp_reward / 2), 5);
    const player = await PlayerService.applyPenalty(
      userId,
      penaltyValue,
      `Missao Falhou: ${updated.title}.`
    );
    const boss = await BossService.create(userId);

    await HistoryService.register(userId, "missao_falhou", `Missao Falhou: ${updated.title}.`, -penaltyValue);
    return { challenge: updated, player, boss, message: "Missao Falhou" };
  }

  static async findOwned(userId, challengeId) {
    const challenge = await prisma.challenge.findFirst({
      where: { id: challengeId, user_id: userId }
    });

    if (!challenge) {
      const error = new Error("Desafio nao encontrado.");
      error.statusCode = 404;
      throw error;
    }

    return challenge;
  }
}

module.exports = ChallengeService;
