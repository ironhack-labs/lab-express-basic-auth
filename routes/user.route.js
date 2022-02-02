//require express router
const router = require("express").Router();
let bcryptjs = require("bcryptjs");
var saltRounds = 10;

//require model
let User = require("../models/User.model.js");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-gard.js");

router.get("/signup", (req, res) => {
  res.render("user/signup.hbs");
});

router.get("/login", (req, res) => {
  res.render("auth/login.hbs");
});

router.post("/signup", (req, res, next) => {
  const { username, email, password } = req.body;
  //console.log(req.body);
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        // username: username
        username,
        email,
        // passwordHash => this is the key from the User model
        //     ^
        //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDB) => {
      console.log("Newly created user is: ", userFromDB);
      res.render("auth/login.hbs");
    })
    .catch((error) => next(error));
});

router.get("/user-profile", isLoggedIn, (req, res) => {
  res.render("user/user-profile", { userInSession: req.session.currentUser });
});

module.exports = router;
