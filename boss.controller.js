const BossService = require("./BossService");

class BossController {
  static async index(req, res, next) {
    try {
      const bosses = await BossService.listActive(req.user.id);
      return res.json(bosses);
    } catch (error) {
      return next(error);
    }
  }

  static async store(req, res, next) {
    try {
      const boss = await BossService.create(req.user.id, req.body);
      return res.status(201).json(boss);
    } catch (error) {
      return next(error);
    }
  }

  static async defeat(req, res, next) {
    try {
      const result = await BossService.defeat(req.user.id, req.params.id);
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }

  static async fail(req, res, next) {
    try {
      const result = await BossService.fail(req.user.id, req.params.id);
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }

  static async destroy(req, res, next) {
    try {
      const result = await BossService.remove(req.user.id, req.params.id);
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = BossController;
