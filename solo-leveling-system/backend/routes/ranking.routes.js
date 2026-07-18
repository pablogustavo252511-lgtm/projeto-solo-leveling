const express = require("express");
const RankingController = require("../controllers/ranking.controller");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/ranking", authMiddleware, RankingController.index);

module.exports = router;

