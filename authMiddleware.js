const jwt = require("jsonwebtoken");

module.exports = function authMiddleware(req, res, next) {
  const authorization = String(req.headers.authorization || "");
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice(7).trim()
    : "";

  if (!token) {
    return res.status(401).json({ message: "Token nao informado." });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalido ou expirado." });
  }
};
