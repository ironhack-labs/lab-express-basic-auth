const router = require("express").Router();
const AuthController = require("../controllers/auth.controller");
const userController = require("../controllers/user.contoller");
const authMiddleware = require('../middlewares/auth.middlewares');

// auth
// router.get("/", AuthController.index);

router.get("/signup",authMiddleware.isNotAuthenticated, AuthController.signup);
router.post("/signup", AuthController.doSignup);

router.get("/login",  authMiddleware.isNotAuthenticated, AuthController.login);
router.post("/login", authMiddleware.isNotAuthenticated, AuthController.doLogin);
 
// user
router.get('/profile', authMiddleware.isAuthenticated, userController.profile);

module.exports = router;
