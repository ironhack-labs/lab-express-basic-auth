const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");
const saltRounds = 10;

const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", isLoggedOut, (req, res, next) => {
  console.log("The form data: ", req.body);
  const { username, password } = req.body;
  console.log("username", username, "pwd", password);
  if (!username || !password) {
    throw new Error("Username and password cannot be empty!");
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        password: hashedPassword,
      });
    })
    .then((userFromDB) => {
      console.log("Newly created user is: ", userFromDB);
      res.redirect("/userProfile");
    })
    .catch((error) => next(error));
});

router.get("/userprofile",isLoggedIn, (req, res, next) => {
  res.render('users/user-profile', 
  { userInSession: req.session.currentUser });
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  console.log("SESSION =====> ", req.session);
  const { username, password } = req.body;
  console.log({ username, password });
  if (!username || !password) {
    throw new Error("Username and password cannot be empty!");
  }
  User.findOne({ username: username })
    .then((userFromDB) => {
      if (!userFromDB) {
        throw new Error("User not found");
      } 
      else {
        bcryptjs.compare(password, userFromDB.password, function(err, result) {
          if (err){
            throw new Error("Invalid password");
          }
          if (result) {
            console.log("Login successful");
        req.session.currentUser = userFromDB;
        res.redirect("/userProfile");
          } else {
            // response is OutgoingMessage object that server response http request
            return res.json({success: false, message: 'passwords do not match'});
          }
      }); 
      } 
    })
    .catch((error) => next(error));
});

//might need a review
router.post('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});

router.get("/main", (req, res, next) => {
  res.render("main");
});

router.get("/private",isLoggedIn, (req, res, next) => {
  res.render("private");
});


module.exports = router;
