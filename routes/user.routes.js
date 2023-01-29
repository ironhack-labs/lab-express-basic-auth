const router = require("express").Router();
const userController = require ("../controllers/user.controller");
const authMiddleware = require ("../middlewares/auth.middlewares");

router.get("/signup", authMiddleware.isNotAuthenticated, userController.create);
router.post("/signup", userController.doCreate);
router.get("/login",  authMiddleware.isNotAuthenticated, userController.login);
router.post("/login", authMiddleware.isNotAuthenticated, userController.doLogin);
router.get("/profile", authMiddleware.isAuthenticated, userController.profile);
router.get("/logout", authMiddleware.isAuthenticated, userController.logout);

module.exports = router;