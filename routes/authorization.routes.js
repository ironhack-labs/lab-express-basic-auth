const router = require("express").Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

//SIGNUP\\
router.get("/signup", (req, res, next) => res.render("authorization/signup"));

router.post("/signup", async (req, res, next) => {
  try {
    let { username, password } = req.body;

    if (!username || !password) {
      res.render("authorization/signup", {
        errorMessage: "Fill up all fields",
      });
    }

    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    if (!regex.test(password)) {
      res.render("authorization/signup", {
        errorMessage:
          "Password invalid: It needs to be 8 characters long and include both lower and uppercase characters",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({ username, password: hashedPassword });

    res.redirect("/");
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.render("auth/signup", {
        errorMessage: error.message,
      });
    } else if (error.code === 11000) {
      res.render("auth/signup", {
        errorMessage: "Email already registered",
      });
    }
    console.log(error);
    next(error);
  }
});

//END SIGNUP\\
//LOGIN\\

router.get("/login", isLoggedOut, (req, res, next) =>
  res.render("authorization/login")
);

router.post("/login", async (req, res, next) => {
  try {
    let { username, password } = req.body;

    if (!username || !password) {
      res.render("authorization/login", {
        errorMessage: "Please input all the fields",
      });
    }

    let user = await User.findOne({ username });

    if (!user) {
      res.render("authorization/login", {
        errorMessage: "Username doesn't exist",
      });
    } else if (bcrypt.compareSync(password, user.password)) {
      req.session.user = user;
      res.redirect("/profile");
    } else {
      res.render("authorization/login", {
        errorMessage: "Wrong Credentials",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//PROFILE\\

router.get("/profile", isLoggedIn, (req, res, next) => {
  let user = req.session.user;
  res.render("profile", user);
});

//END PROFILE\\

//LOGOUT\\

router.post("/logout", (req, res, next) => {
  req.session.destroy((error) => {
    if (error) next(error);
    else res.redirect("/");
  });
});

//END LOGOUT\\

//MAIN\\

router.get("/main", isLoggedIn, (req, res, next) => {
  let user = req.session.user;
  if (user) res.render("main", user);
  else res.render("/");
});

//END MAIN\\

//PRIVATE\\

router.get("/private", isLoggedIn, (req, res, next) => {
  let user = req.session.user;
  res.render("private", user);
});

//END PRIVATE\\

module.exports = router;
