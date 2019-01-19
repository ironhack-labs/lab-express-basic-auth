const express     = require("express");
const router      = express.Router();
const User        = require("../models/user");

const bcrypt      = require("bcrypt");
const bcryptSalt  = 10; 


router.get("/signup",  (req, res, next) =>{
  res.render("auth/signup", { captcha:res.recaptcha })
})

router.post("/signup",  (req, res, next )=>{
  const username = req.body.username;
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);


  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Agrega el nombre y contraseña para poder seguir"
    })
    return
  }

  User.findOne({"username": username})
  .then( user =>{
    if ( user !== null) {
      res.render("auth/signup", {
        errorMessage: "El usuario indicado ya existe...tonto"
      })
      return
    } 
    const newUser = User ({
        username,
        password: hashPass
    });

    newUser.save()
    .then(user => {
      res.redirect("/")
    })
    .catch(err=> {
      next(err)
    });
  }) 
})

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username })
  .then(user => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    next(error)
  })
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});

module.exports = router;