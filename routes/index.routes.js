const router = require("express").Router();
const User = require("../models/User.model")

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// registrarse
router.post("/signup", (req, res, next) => {
  const { username,email, password } = req.body;
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
          passwordHash: hashedPassword
        })
      })
      .then((userDb) => res.redirect('/userProfile'))
      .catch((error) => next(error));
  });

  router.get("/userProfile", (req, res) => res.render("user/userProfile"));


module.exports = router;
