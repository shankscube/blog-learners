const express = require("express");

const userMiddleware = require("../middleware/userMiddleware");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/allusers", userMiddleware, userController.getAllUsers);
router.get("/getuserdetails/:id", userMiddleware, userController.getUserDetails);

module.exports = router;
