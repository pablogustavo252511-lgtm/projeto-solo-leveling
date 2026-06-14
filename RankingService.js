const prisma = require("../config/database");

class RankingService {
  static async topHunters() {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        level: true,
        xp: true,
        rank: true,
        _count: {
          select: {
            challenges: { where: { status: "concluido" } },
            bosses: { where: { status: "derrotado" } }
          }
        }
      },
      orderBy: [{ level: "desc" }, { xp: "desc" }]
    });

    return users
      .map((user) => ({
        ...user,
        completed_challenges: user._count.challenges,
        defeated_bosses: user._count.bosses
      }))
      .sort((a, b) => {
        if (b.level !== a.level) return b.level - a.level;
        if (b.xp !== a.xp) return b.xp - a.xp;
        if (b.completed_challenges !== a.completed_challenges) {
          return b.completed_challenges - a.completed_challenges;
        }
        return b.defeated_bosses - a.defeated_bosses;
      });
  }
}

module.exports = RankingService;

