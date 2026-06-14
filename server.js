require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/auth.routes");
const challengeRoutes = require("./routes/challenge.routes");
const playerRoutes = require("./routes/player.routes");
const bossRoutes = require("./routes/boss.routes");
const historyRoutes = require("./routes/history.routes");
const rankingRoutes = require("./routes/ranking.routes");

const app = express();
const port = process.env.PORT || 3000;
const frontendOrigin = process.env.FRONTEND_ORIGIN || "*";
const frontendPath = path.join(__dirname, "..", "frontend");

app.use(cors({
  origin: frontendOrigin === "*" ? true : frontendOrigin,
  credentials: frontendOrigin !== "*"
}));
app.use(express.json());
app.use(express.static(frontendPath, { index: false }));

app.get("/api/health", (req, res) => {
  res.json({
    name: "Solo Leveling - Daily Hunter System API",
    status: "online"
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "page.html"));
});

app.use(authRoutes);
app.use(challengeRoutes);
app.use(playerRoutes);
app.use(bossRoutes);
app.use(historyRoutes);
app.use(rankingRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Rota nao encontrada." });
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    message: error.message || "Erro interno do servidor."
  });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Daily Hunter API online na porta ${port}`);
  });
}

module.exports = app;
