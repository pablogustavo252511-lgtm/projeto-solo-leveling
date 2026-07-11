const prisma = require("./database");

class HistoryService {
  static async register(userId, action, description, xpEarned = 0) {
    return prisma.history.create({
      data: {
        user_id: userId,
        action,
        description,
        xp_earned: xpEarned
      }
    });
  }

  static async listByUser(userId) {
    return prisma.history.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" }
    });
  }
}

module.exports = HistoryService;
