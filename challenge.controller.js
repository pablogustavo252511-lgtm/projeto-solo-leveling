const ChallengeService = require("../services/ChallengeService");

class ChallengeController {
  static async index(req, res, next) {
    try {
      const challenges = await ChallengeService.list(req.user.id, req.query.status);
      return res.json(challenges);
    } catch (error) {
      return next(error);
    }
  }

  static async store(req, res, next) {
    try {
      const challenge = await ChallengeService.create(req.user.id, req.body);
      return res.status(201).json(challenge);
    } catch (error) {
      return next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const challenge = await ChallengeService.update(req.user.id, req.params.id, req.body);
      return res.json(challenge);
    } catch (error) {
      return next(error);
    }
  }

  static async destroy(req, res, next) {
    try {
      const result = await ChallengeService.remove(req.user.id, req.params.id);
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }

  static async complete(req, res, next) {
    try {
      const result = await ChallengeService.complete(req.user.id, req.params.id);
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }

  static async fail(req, res, next) {
    try {
      const result = await ChallengeService.fail(req.user.id, req.params.id);
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = ChallengeController;

