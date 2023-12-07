const router = require("express").Router();
const usersController = require("../controllers/users.controller");
const authMiddleware = require("../middlewares/auth.middlewares");


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/register", authMiddleware.isNotAuthenticated, usersController.register);
router.post("/register", authMiddleware.isNotAuthenticated, usersController.doRegister);
router.get("/login", authMiddleware.isNotAuthenticated, usersController.login);
router.post("/login", authMiddleware.isNotAuthenticated, usersController.doLogin);
router.get("/logout", authMiddleware.isAuthenticated, usersController.logout);
router.get("/listPlayer", authMiddleware.isAuthenticated, usersController.player);


router.get("/profile", authMiddleware.isAuthenticated, usersController.profile);


module.exports = router;
