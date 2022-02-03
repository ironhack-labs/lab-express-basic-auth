const User = require("../models/User.model");
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res, next) => {
res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const {username, email, password} = req.body;

  bcryptjs
  .genSalt(saltRounds)
  .then(salt => bcryptjs.hash(password, salt))
  .then(hashedPassword => {
  return User.create({username, email, passwordHash: hashedPassword});
  })
  .then(newUser => console.log("Check out this newly created user!", newUser))
  .catch(err => next(err));

  });

module.exports = router;
