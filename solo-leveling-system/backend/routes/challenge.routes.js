const express = require("express");
const ChallengeController = require("../controllers/challenge.controller");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.get("/challenges", ChallengeController.index);
router.post("/challenges", ChallengeController.store);
router.put("/challenges/:id", ChallengeController.update);
router.delete("/challenges/:id", ChallengeController.destroy);
router.patch("/challenges/:id/complete", ChallengeController.complete);
router.patch("/challenges/:id/fail", ChallengeController.fail);

module.exports = router;

