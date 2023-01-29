const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const userController = require ("../controllers/user.controller");
const authMiddleware = require('../middlewares/auth.middleware');


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
// Auth

router.get("/signup", authMiddleware.isNotAuthenticated, authController.signup); 
router.post("/signup" , authController.doSignup);

router.get("/login", authMiddleware.isNotAuthenticated, authController.login);
router.post("/login" , authMiddleware.isAuthenticated, authController.doLogin);

router.get("/logout", authController.logout);

// user
router.get("/profile", authMiddleware.isAuthenticated, userController.profile);

module.exports = router;