const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const authController = require("../controllers/AuthController");

const router = express.Router();

router.post("/login", authMiddleware, authController.Login);
router.post("/signup", authMiddleware, authController.Signup);

module.exports = router;
