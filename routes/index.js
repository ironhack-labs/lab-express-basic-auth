const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//AUTH
router.get('/signup', authMiddleware.isNotAuthenticated, authController.signup);
router.post('/signup', authController.doSignup);

router.get('/login', authMiddleware.isNotAuthenticated, authController.login);
router.post('/login', authController.doLogin);

router.get('/logout', authController.logout);

router.get('/profile', authMiddleware.isAuthenticated, authController.profile);

module.exports = router;
