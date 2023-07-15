const router = require("express").Router();
const authController = require('../controllers/auth.controller')
const userController = require('../controllers/user.controller')
const miscController = require('../controllers/misc.controller')
const authMiddleware = require('../middlewares/auth.middleware')

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// GET signup form page

router.get('/signup', authMiddleware.isNotAuthenticated, authController.signup)

// POST data from the form

router.post('/signup', authMiddleware.isNotAuthenticated, authController.doSignup)

// GET log in form page

router.get('/login', authMiddleware.isNotAuthenticated, authController.login)

// POST log in data

router.post('/login', authMiddleware.isNotAuthenticated, authController.doLogin)

// GET user profile page

router.get('/user/profile', authMiddleware.isAuthenticated, userController.profile)

// LOG OUT

router.get('/logout', authMiddleware.isAuthenticated, authController.logout)

// GET main page

router.get('/main', authMiddleware.isNotAuthenticated, miscController.main)

// GET private page

router.get('/user/private', authMiddleware.isAuthenticated, userController.private)

module.exports = router;
