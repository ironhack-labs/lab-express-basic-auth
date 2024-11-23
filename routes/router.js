const { signUp, doSignUp, logIn, doLogIn, logOut } = require("../controllers/auth.controller");
const { profile, funnyCat, private } = require("../controllers/user.controller")
const { isAuthenticated, isNotAuthenticated } = require("../middlewares/auth.middleware")
const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/signup', isNotAuthenticated, signUp)
router.post('/signup', isNotAuthenticated, doSignUp)

router.get('/logIn', isNotAuthenticated, logIn)
router.post('/logIn', isNotAuthenticated, doLogIn)

router.get('/profile', isAuthenticated, profile)

router.get('/main', isAuthenticated, funnyCat)
router.get('/private', isAuthenticated, private)

router.get('/logout', logOut)

module.exports = router;
