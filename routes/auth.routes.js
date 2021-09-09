// REQUIRES
const { Router } = require("express");
const router = new Router();
// CODE SKIPED
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
// MODEL IMPORT
const User = require("../models/User.model");


/* FORM HOME */
// GET route ==> to display the signup form
router.get("/signup", (req, res) => res.render("auth/signup"));

// POST route ==> to process form data
router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  // Start BONUS
  if (!username || !password) {
    res.render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username and password.",
    });
    return;
  }
  // End BONUS

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username: username,
        password: hashedPassword,
      });
    })
    .then((userFromDB) => {
      res.redirect("/userProfile");
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('auth/signup', { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render('auth/signup', {
           errorMessage: 'Username need to be unique. Either username is already used.'
        });
      } else {
        next(error);
      }
    }); 
})


/**********************************************************************/
/* USER-PROFILE */
router.get("/userProfile", (req, res) => {
  res.render("user-profile.hbs");
});

/**********************************************************************/
//////////// L O G I N ///////////

// GET route ==> to display the login form to users
router.get("/login", (req, res) => res.render("auth/login"));

// POST login route ==> to process form data
router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, user and password to login.",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth/login", { errorMessage: "El usuario no existe" });
        return;
      } else if (bcryptjs.compareSync(password, user.password) === false) {
        res.render("auth/login", { errorMsg: "Contraseña incorrecta" });
      } else {
        res.redirect("/userProfile");
      }
    })
    .catch((error) => next(error));
});

/********************************************************/
/* L O G O U T  */
router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

/********************************************************/
/* R A N D O M  */
router.get("/main", (req, res) => {
  res.render("main");
});

router.get("/private", (req, res) => {
  res.render("private");
});

module.exports = router;
