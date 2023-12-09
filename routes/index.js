const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const usersController = require("../controllers/users.controller");
const ridersController = require("../controllers/riders.controller");
const authMiddleware = require("../middlewares/auth.middlewares");

router.get("/", authMiddleware.isAuthenticated, (req, res, next) => {
  res.render("home");
});

// auth
router.get("/login", authMiddleware.isNotAuthenticated, authController.login);
router.post(
  "/login",
  authMiddleware.isNotAuthenticated,
  authController.doLogin
);
router.get(
  "/register",
  authMiddleware.isNotAuthenticated,
  authController.register
);
router.post(
  "/register",
  authMiddleware.isNotAuthenticated,
  authController.doRegister
);
router.get("/logout", authMiddleware.isAuthenticated, authController.logout);
router.get("/activate/:token", authController.activate);

// users
router.get("/profile", authMiddleware.isAuthenticated, usersController.profile);

// riders
router.get("/riders", authMiddleware.isAuthenticated, ridersController.list);

module.exports = router;
