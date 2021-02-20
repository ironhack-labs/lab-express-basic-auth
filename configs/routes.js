const router = require("express").Router();
const usersController = require("../controllers/users.controllers");
const miscController = require("../controllers/misc.controller");
const secure = require("../middleware/secure.middleware")

router.get("/", miscController.home);

router.get("/register", secure.isNotAuthenticated, usersController.register);
router.post("/register", secure.isNotAuthenticated, usersController.doRegister);

router.get("/login", secure.isNotAuthenticated, usersController.login);
router.post("/login", secure.isNotAuthenticated, usersController.doLogin);

router.get("/activate/:token", secure.isNotAuthenticated, usersController.activate);

router.post("/logout", secure.isAuthenticated, usersController.logout);

router.get("/profile", secure.isAuthenticated, usersController.getProfile);

router.get("/main", secure.isAuthenticated, usersController.getMain )

router.get("/private", secure.isAuthenticated, usersController.getPrivate);


module.exports = router;
