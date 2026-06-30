const prisma = require("../config/database");
const HistoryService = require("./HistoryService");
const PlayerService = require("./PlayerService");
const BossService = require("./BossService");
const MissionXpService = require("./MissionXpService");
const SystemLockService = require("./SystemLockService");

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function parseMissionDueDate(value) {
  const fallbackDate = new Date().toISOString().slice(0, 10);
  const dateText = value ? String(value).trim() : fallbackDate;

  if (DATE_ONLY_PATTERN.test(dateText)) {
    return new Date(`${dateText}T23:59:59.999-03:00`);
  }

  const parsed = new Date(dateText);
  if (!Number.isFinite(parsed.getTime())) {
    return new Date(`${fallbackDate}T23:59:59.999-03:00`);
  }

  const isLegacyMidnightUtc = parsed.getUTCHours() === 0
    && parsed.getUTCMinutes() === 0
    && parsed.getUTCSeconds() === 0
    && parsed.getUTCMilliseconds() === 0;

  return isLegacyMidnightUtc
    ? new Date(`${parsed.toISOString().slice(0, 10)}T23:59:59.999-03:00`)
    : parsed;
}

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
        due_date: parseMissionDueDate(payload.due_date)
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
        ...(payload.due_date !== undefined ? { due_date: parseMissionDueDate(payload.due_date) } : {})
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
    const error = new Error("A missao nao pode falhar por clique. Ela so falha automaticamente quando passar do vencimento.");
    error.statusCode = 400;
    throw error;
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
