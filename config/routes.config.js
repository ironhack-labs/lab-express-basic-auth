const router = require("express").Router();
const miscController = require("../controllers/misc.controller");
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const authMiddlewares = require("../middlewares/authMiddleware");

router.get("/", miscController.index);

//AUTHENTICATION
router.get("/register", authController.register);
router.post("/register", authController.doRegister);

router.get("/login", authMiddlewares.isNotAuthenticated, authController.login);
router.post("/login", authController.doLogin);

router.get("/logout", authController.logout);

//USER
router.get("/profile", authMiddlewares.isAuthenticated, userController.profile);

module.exports = router;
