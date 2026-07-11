const express = require("express");
const HistoryController = require("./history.controller");
const authMiddleware = require("./authMiddleware");

const router = express.Router();

router.get("/history", authMiddleware, HistoryController.index);

module.exports = router;
