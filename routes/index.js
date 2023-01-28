const router = require("express").Router();

const userController = require("../controllers/user.controller")
const authMiddleware = require("../middlewares/auth.middlewares")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", authMiddleware.isNotAuthenticated, userController.signup)
router.post("/signup", userController.doSignup)

router.get("/login", authMiddleware.isNotAuthenticated, userController.login)
router.post("/login", userController.doLogin)

router.get("/profile", authMiddleware.isAuthenticated, userController.profile)

router.get("/logout", authMiddleware.isAuthenticated, userController.logout)

module.exports = router;
