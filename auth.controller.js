const AuthService = require("../services/AuthService");

class AuthController {
  static async register(req, res, next) {
    try {
      const result = await AuthService.register(req.body);
      return res.status(result.account_recovered ? 200 : 201).json(result);
    } catch (error) {
      return next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const result = await AuthService.login(req.body);
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }

  static async profile(req, res, next) {
    try {
      const user = await AuthService.profile(req.user.id);
      return res.json(user);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = AuthController;
