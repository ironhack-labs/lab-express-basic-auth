const { Router } = require("express");
const User = require("../../models/User.model");
const router = new Router();
const bcryptjs = require("bcryptjs");
const saltRounds = 10;

router.get("/userProfile", (req, res, next) => {
  res.render("auth/user-profile", { userInSession: req.session.currentUser });
});

// GET route ==> to display the signup form to users
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  console.log("The form data: ", req.body);

  const { username, password } = req.body;

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      console.log(`Password hash: ${hashedPassword}`);
      User.create({
        username,
        passwordHash: hashedPassword,
      });
    })
    .catch((error) => next(error));
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  console.log("The form data LOGIN: ", req.body);

  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, email and password to login.",
    });
    return;
  }

  User.findOne({ username })
    .then((userFromDb) => {
      if (!userFromDb) {
        res.render("auth/login", { errorMessage: "Username is not registered. Try with other username." });
        return;
      } else if (bcryptjs.compareSync(password, userFromDb.passwordHash)) {
        req.session.currentUser = userFromDb;

        res.redirect("/userProfile");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});

module.exports = router;
