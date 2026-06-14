const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/database");
const HistoryService = require("./HistoryService");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const TOKEN_EXPIRES_IN = "7d";

function sanitizeUser(user) {
  const { senha, ...safeUser } = user;
  return safeUser;
}

class AuthService {
  static async register({ nome, email, senha }) {
    if (!nome || !email || !senha) {
      const error = new Error("Nome, email e senha sao obrigatorios.");
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const exists = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (exists) {
      const error = new Error("Email ja cadastrado.");
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    const user = await prisma.user.create({
      data: {
        nome: nome.trim(),
        email: normalizedEmail,
        senha: hashedPassword,
        level: 1,
        xp: 0,
        rank: "E"
      }
    });

    await HistoryService.register(
      user.id,
      "cadastro",
      "Hunter registrado no sistema. Nivel 1, XP 0, Rank E.",
      0
    );

    return {
      user: sanitizeUser(user),
      token: this.signToken(user.id)
    };
  }

  static async login({ email, senha }) {
    if (!email || !senha) {
      const error = new Error("Email e senha sao obrigatorios.");
      error.statusCode = 400;
      throw error;
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user || !(await bcrypt.compare(senha, user.senha))) {
      const error = new Error("Credenciais invalidas.");
      error.statusCode = 401;
      throw error;
    }

    return {
      user: sanitizeUser(user),
      token: this.signToken(user.id)
    };
  }

  static signToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
  }

  static verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
  }

  static async profile(userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      const error = new Error("Usuario nao encontrado.");
      error.statusCode = 404;
      throw error;
    }

    return sanitizeUser(user);
  }
}

module.exports = AuthService;

