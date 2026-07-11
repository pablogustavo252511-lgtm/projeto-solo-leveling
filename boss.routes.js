const express = require("express");
const BossController = require("./boss.controller");
const authMiddleware = require("./authMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.get("/boss", BossController.index);
router.post("/boss", BossController.store);
router.patch("/boss/:id/defeat", BossController.defeat);
router.patch("/boss/:id/fail", BossController.fail);
router.delete("/boss/:id", BossController.destroy);

module.exports = router;
