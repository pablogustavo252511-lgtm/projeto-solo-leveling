const express = require("express");
const PlayerController = require("../controllers/player.controller");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.get("/player/status", PlayerController.status);
router.post("/player/level-up", PlayerController.levelUp);

module.exports = router;

