const router = require("express").Router();
const miscController = require("../controllers/misc.controller");
const authController = require("../controllers/auth.controller");
const usersController = require("../controllers/users.controller");

// MISC
router.get("/", miscController.home);

// AUTH
router.get("/register", authController.register);
router.post("/register", authController.doRegister);

// USERS
router.get("/profile", usersController.profile);

module.exports = router; 