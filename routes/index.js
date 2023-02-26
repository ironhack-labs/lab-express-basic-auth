const router = require("express").Router();

const User = require("../models/User.model")
const bcrypt = require('bcryptjs')
const saltRounds = 10

const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//GET signup page
router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
})

//GET user profile
router.get("/users/user-profile", isLoggedIn, (req, res) => {
  res.render('users/user-profile', { userInSession: req.session.currentUser });
});

//POST new user
router.post("/signup", async (req, res, next) => {

    try{
      const { username, password } = req.body;
      let salt = await bcrypt.genSalt(saltRounds);
      let hashedPassword = await bcrypt.hash(password, salt);
      let newUser = await User.create({username, password: hashedPassword})

      console.log(newUser);
      res.redirect("/users/user-profile");
    }
    catch(error) {
      next(error);
    }
})

router.get("/login", isLoggedOut, (req,res) => res.render("auth/login"));

router.get("/main", isLoggedIn, (req,res) => res.render("users/main"));

router.get("/private", isLoggedIn, (req,res) => res.render("users/private"));

router.post("/login", async (req, res, next) => {
  console.log('SESSION =====> ', req.session);
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });

    if (!user) {
      res.render("auth/login", {error: "Username not found"});
      return
    }
    

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      res.render("auth/login", { error: "Invalid password" });
      return;
    }

    //res.render("/users/user-profile", {user});
    req.session.currentUser = user;
    res.redirect(`/users/user-profile?username=${username}`);


  } catch (error) {
    next(error);
  }
});


router.post('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});

module.exports = router;
