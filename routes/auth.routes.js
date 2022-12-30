const { Router } = require("express");
const router = new Router();
const User = require("../models/User.model");

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

//////////// S I G N U P ///////////

// GET route ==> to display the signup form to users
router.get("/signup", (req, res) => res.render("auth/signup"));

// POST route ==> to process form data
router.post("/signup", (req, res, next) => {
  //   console.log("The form data: ", req.body);

  const { username, email, password } = req.body;

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      console.log(`Password hash: ${hashedPassword}`);
      return User.create({
        username,
        email,
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDB) => {
      //   console.log("Newly created user is: ", userFromDB);
      res.redirect("/userProfile");
    })
    .catch((error) => next(error));
});

//////////// L O G I N ///////////

// GET route ==> to display the login form to users
router.get("/login", (req, res) => res.render("auth/login"));

router.post("/login", (req, res, next) => {
  console.log("SESSION =====> ", req.session);
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, email and password to login.",
    });
    return;
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "Email is not registered. Try with other email.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        // res.render("users/user-profile", { user });

        req.session.currentUser = user;
        res.redirect("/userProfile");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});

// Profile page route
router.get("/userProfile", (req, res) => {
  res.render("users/user-profile", { userInSession: req.session.currentUser });
});

//////////// L O G O U T ///////////
router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});
module.exports = router;
