const HistoryService = require("../services/HistoryService");

class HistoryController {
  static async index(req, res, next) {
    try {
      const history = await HistoryService.listByUser(req.user.id);
      return res.json(history);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = HistoryController;

