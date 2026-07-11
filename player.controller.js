const PlayerService = require("./PlayerService");

class PlayerController {
  static async status(req, res, next) {
    try {
      const status = await PlayerService.status(req.user.id);
      return res.json(status);
    } catch (error) {
      return next(error);
    }
  }

  static async levelUp(req, res, next) {
    try {
      const result = await PlayerService.levelUp(req.user.id);
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = PlayerController;
