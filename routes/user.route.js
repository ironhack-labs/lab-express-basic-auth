//require express router
const router = require("express").Router();
let bcryptjs = require("bcryptjs");
var saltRounds = 10;

//require model
let User = require("../models/User.model.js");

router.get("/signup", (req, res) => {
  res.render("user/signup.hbs");
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
      res.render("user/user-profile.hbs");
    })
    .catch((error) => next(error));
});

router.get("/login", (req, res) => {
  res.render("user/login.hbs");
});

module.exports = router;
