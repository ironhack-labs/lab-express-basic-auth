const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");
const res = require("express/lib/response");
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
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username, email and password.",
    });
    return;
  } else {
    bcryptjs
      .genSalt(saltRounds)
      .then((salt) => bcryptjs.hash(password, salt))
      .then((hashedPassword) => {
        return User.create({ username, email, passwordHash: hashedPassword });
      })
      .then((newUser) => {
        console.log("Check out this newly created user!", newUser);
        res.render("auth/register-confirmation", { user: newUser });
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          res
            .status(500)
            .render("auth/signup", { errorMessage: error.message });
        } else if (error.code === 11000) {
          res.status(500).render("auth/signup", {
            errorMessage:
              "Username and email need to be unique. Either username or email is already used.",
          });
        } else {
          next(error);
        }
      });
  }
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});


router.post("/login", (req, res, next) => {
  const {email, password} = req.body;

  if (email === "" || password ==="") {
    res.render("auth/login", {errorMessage: "Please enter both the e-mail and the password to login."});
    return;
  }

  User.findOne( {email})
.then(user => {
  if (!user) {
    res.render("auth/login", {errorMessage: "This e-mail address is not registed, please try again."});
    return;
  } else if (bcryptjs.compareSync(password, user.passwordHash)) {
    req.session.currentUser = user;
    res.locals.userIsConnected = true;
    res.redirect(`/${user.username}`);
  } else {
    res.render('auth/login', { errorMessage: 'Incorrect password.' });
  }
})
.catch(error => next(error));

});

router.get("/:username", (req, res, next) => {
   
  res.render("users/user-profile", {theUser: req.session.currentUser } );
  
});





module.exports = router;
