const RankingService = require("../services/RankingService");

class RankingController {
  static async index(req, res, next) {
    try {
      const ranking = await RankingService.topHunters();
      return res.json(ranking);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = RankingController;

