const router = require("express").Router();

// const bcryptjs = require('bcryptjs');
const { signupGetController, signupPostController,
   loginGetController, loginPostController,
    profileGetController,
  mainGetController, privateGetController, logoutGetController} = require('../controllers/auth.controller');

const {isAnon, isLoggedIn} = require("../middlewares/auth.middlewares");
// const User = require('../models/User.model');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/signup', isAnon, signupGetController);

router.post('/signup', isAnon, signupPostController);


router.get('/login', isAnon, loginGetController);

router.post('/login', isAnon, loginPostController);

router.get('/profile', isLoggedIn,  profileGetController)

router.get('/logout', logoutGetController);

router.get('/main', isLoggedIn, mainGetController);

router.get('/private', isLoggedIn, privateGetController);


module.exports = router;
