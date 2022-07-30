const router = require("express").Router();
const miscController = require("../controllers/misc.controller");
const authController = require("../controllers/auth.controller");
const usersController = require("../controllers/users.controller");
const authMiddlewares = require("../../middlewares/authMiddleware");

// MISC
router.get("/", miscController.home);

// AUTH

//register
router.get("/register", authController.register);
router.post("/register", authController.doRegister);

//logins
router.get("/login", authMiddlewares.isNotAuthenticated, authController.login);
router.post("/login", authController.doLogin);
router.get("/logout", authController.logout);

// USERS
router.get("/profile", usersController.profile);

router.get("/profile", authMiddlewares.isAuthenticated,usersController.profile);

module.exports = router; 