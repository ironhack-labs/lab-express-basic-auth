const router = require("express").Router();

const User = require("../models/User.model");

const bcrypt = require("bcryptjs");
const saltRounds = 12;


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


router.post("/auth/signup", (req, res, next) => {
  const { username, password } = req.body

  if (username === "" || password === "") {
    res.render("index", {errorMessage: "Username and Password are required."});
    return;
  }


  User.findOne({ username })
    .then((userObj) => {
      if (userObj) {
        res.render("index", {errorMessage: `Username ${username} is already taken.`});
        return;
      } else {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);

        User.create({ username, password: hashedPassword })
        .then((user) => {
            res.redirect("/home");
          })
          .catch((err) => res.render("index", {errorMessage: `Error during signup`}));
      }
    }).catch((err) => next(err));
})


router.get("/home" , (req, res) => {
  res.render("home")
})

module.exports = router;

