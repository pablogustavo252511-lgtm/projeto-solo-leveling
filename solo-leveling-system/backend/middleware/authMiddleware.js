const AuthService = require("../services/AuthService");
const prisma = require("../config/database");

async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [, token] = header.split(" ");

    if (!token) {
      return res.status(401).json({ message: "Token nao informado." });
    }

    const payload = AuthService.verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, nome: true, email: true, level: true, xp: true, rank: true }
    });

    if (!user) {
      return res.status(401).json({ message: "Usuario invalido." });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalido ou expirado." });
  }
}

module.exports = authMiddleware;

