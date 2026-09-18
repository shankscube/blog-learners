const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const authController = require("../controllers/AuthController");

const router = express.Router();

router.post("/login", authController.Login);
router.post("/signup", authController.Signup);

module.exports = router;
