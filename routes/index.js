const router = require("express").Router();

const bcryptjs = require("bcryptjs")
const saltRounds = 10;

const User = require("../models/User.model.js")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});



/* Signup Page */
router.get("/signup", (req, res, next) => {
  res.render("signup");
})

router.post("/signup", (req, res, next) => {
  const {username, password} = req.body;

  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      User.create({username:username, password : hashedPassword})
    })
    .catch(error => next(error))
  res.redirect("/profile");
})


router.get("/profile", (req, res, next) => {
  res.render("profile");
})


module.exports = router;
