const express = require("express");
const HistoryController = require("../controllers/history.controller");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/history", authMiddleware, HistoryController.index);

module.exports = router;

