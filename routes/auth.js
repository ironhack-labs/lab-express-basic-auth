const express = require("express");
const router = express.Router();

const authController = require("../Controllers/authController");

router.get("/signup", authController.createUser);

router.post("/signup", authController.createUserForm);

router.get("/login", authController.loginUser);

router.post("/login", authController.loginUserForm);

module.exports = router;
