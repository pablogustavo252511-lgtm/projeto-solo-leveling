const express = require("express");
const RankingController = require("./ranking.controller");
const authMiddleware = require("./authMiddleware");

const router = express.Router();

router.get("/ranking", authMiddleware, RankingController.index);

module.exports = router;
