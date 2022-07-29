const router = require("express").Router();
const miscController = require("../controllers/misc.controller");
const authController = require("../controllers/auth.controller");

// MISC
router.get("/", miscController.home);

// AUTH
router.get("/register", authController.register);
router.post("/register", authController.doRegister);

module.exports = router; 