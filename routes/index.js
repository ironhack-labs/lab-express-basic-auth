const router = require("express").Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

authMiddleware.isNotAuthenticated;

authMiddleware.isAuthenticated;

/* GET home page */
router.get("/", userController.home);

router.get("/new", authMiddleware.isNotAuthenticated, userController.new);
router.post("/new", authMiddleware.isNotAuthenticated, userController.create);

router.get("/login", authMiddleware.isNotAuthenticated, userController.login);
router.post(
  "/login",
  authMiddleware.isNotAuthenticated,
  userController.doLogin
);

router.get("/profile", authMiddleware.isAuthenticated, userController.profile);

router.get(
  "/profile/edit",
  authMiddleware.isAuthenticated,
  userController.edit
);
router.post(
  "/profile/edit",
  authMiddleware.isAuthenticated,
  userController.update
);

router.post("/logout", authMiddleware.isAuthenticated, userController.logout);

module.exports = router;
