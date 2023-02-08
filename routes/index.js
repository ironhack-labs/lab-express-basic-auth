const router = require("express").Router();
const User = require("../models/User.model")
const bcrypt = require("bcryptjs")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res, next)=> {
  res.render("signup");
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body
  if (username === "") {
    res.render("signup", { message: "Username cannot be empty" })
    return
  }

  if (password.length < 4) {
    res.render("signup", { message: "Password has to be minimum 4 characters" })
    return
  }
  
  User.findOne({ username })
  .then(userFromDB => {
    console.log(userFromDB)

    if (userFromDB !== null) {
      res.render("signup", { message: "Username is already taken" })
    } else {
      // Username is available
      // Hash password
      const salt = bcrypt.genSaltSync()
      const hash = bcrypt.hashSync(password, salt)
      console.log(hash)

      // Create user
      User.create({ username: username, password: hash })
        .then(createdUser => {
          console.log(createdUser)

          //what is happening on this next line?

          res.redirect("/auth/login")
        })
        .catch(err => {
          next(err)
        })
    }
  })

});

module.exports = router;
