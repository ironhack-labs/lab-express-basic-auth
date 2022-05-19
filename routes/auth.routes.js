const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const SALT_FACTOR = 12;
const isLoggedOut = require("../middlewares/isLoggedOut");
const router = require("express").Router();
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res, next) => {
  const { username, email, password } = req.body;
  console.log(req.file);

  // check username and password  are fulfill
  if (!username || !password) {
    return res.render("auth/signup", {
      errorMessage: "Credentials are mondatory!",
    });
  }

  // password 8 characters and with *
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  if (!regex.test(password)) {
    return res.render("auth/signup", {
      errorMessage:
        "Password needs to have 8 char, including lower/upper case and a digit",
    });
  }

  // check if the user already exists
  try {
    const foundUser = await User.findOne({ username });

    if (foundUser) {
      return res.render("auth/signup", {
        errorMessage: "Email already in use",
      });
    }

    // hash the password
    const hashedPassword = bcrypt.hashSync(password, SALT_FACTOR);

    // create user in the database
    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.redirect("auth/login");
  } catch (error) {
    next(error);
  }
});

router.get("/login", isLoggedOut, (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", isLoggedOut, async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !password) {
    return res.render("auth/login", {
      errorMessage: "Credentials are mondatory!",
    });
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  if (!regex.test(password)) {
    return res.render("auth/login", {
      errorMessage:
        "Password needs to have 8 char, including lower/upper case and a digit",
    });
  }

  try {
    const foundUser = await User.findOne({ username });

    if (!foundUser) {
      return res.render("auth/login", {
        errorMessage: "Wrong credentials",
      });
    }

    const checkPassword = bcrypt.compareSync(password, foundUser.password);
    if (!checkPassword) {
      return res.render("auth/login", {
        errorMessage: "Wrong credentials",
      });
    }

    const objectUser = foundUser.toObject();
    delete objectUser.password;
    req.session.currentUser = objectUser;

    return res.redirect("/");
  } catch (error) {}
});

router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
