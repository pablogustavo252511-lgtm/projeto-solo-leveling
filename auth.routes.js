const express = require("express");
const AuthController = require("./auth.controller");
const authMiddleware = require("./authMiddleware");

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/profile", authMiddleware, AuthController.profile);

module.exports = router;
