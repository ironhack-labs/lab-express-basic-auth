const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
/* const { isLoggedIn } = require("../middlewares/auth.middlewares"); */

// sign-up form
router.get("/sign-up", (req, res, next) => {
  res.render("auth/sign-up");
});

router.post("/sign-up", async (req, res, next) => {
  // extract username and password from req.body
  const { username, password } = req.body;
  console.log(req.body);
  // check if email or password entered
  if (!username || !password) {
    const errorMessage = `E-Mail or password incorrect`;
    res.render("auth/sign-up", { errorMessage });
    return;
  }

  // check email format with regular expression
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailRegex.test(username)) {
    const errorMessage = `Invalid E-Mail address. Please enter correct!`;
    res.render("auth/sign-up", { errorMessage });
    return;
  }

  // check password strength
  const passwordRegex =
    /(?=^.{6,}$)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9]).*/;

  if (!passwordRegex.test(password)) {
    const errorMessage = `
    Password must be at least 8 characters long, includes one or more uppercase and lowercase letters, has at least one digit,
    has one special character
    `;
    res.render("auth/sign-up", { errorMessage });
    return;
  }

  // check if username/email already exists
  try {
    const userFound = await User.findOne({ username });
    if (userFound) {
      const errorMessage = `E-Mail already exists`;
      res.render("auth/sign-up", { errorMessage });
      return;
    }
    // encrypt password
    const hashedPassword = bcrypt.hashSync(password);
    // create user in db
    const createUser = await User.create({
      username,
      password: hashedPassword,
    });
    res.render("auth/register-successful");
    /* console.log(createUser); */
  } catch (error) {
    next(error);
  }
});

// login
router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    const message = `Missing username or password`;
    res.render("auth/login", { message });
    return;
  }

  try {
    // check if username exists
    const userExists = await User.findOne({ username });
    if (!userExists) {
      const message = `User not found`;
      res.render("auth/login", { message });
    }

    // check if password matches
    const passwordMatch = bcrypt.compareSync(password, userExists.password);
    console.log(passwordMatch);
    if (passwordMatch) {
      // create active session QUESTION
      // change userExists to object, delete pw
      const objectUser = userExists.toObject();
      delete objectUser.password;
      // save current user in session
      req.session.currentUser = objectUser;
      // create global variable
      req.app.locals.currentUser = true;
      res.redirect("/auth/private");
    } else {
      const message = `Wrong password`;
      res.render("auth/login", { message });
      return;
    }
  } catch (error) {
    next(error);
  }
});

// logout
router.get("/logout", (req, res, next) => {
  req.session.destroy();
  req.app.locals.currentUser = false;
  res.redirect("/auth/login");
});

// main
router.get("/main", (req, res, next) => {
  res.render("auth/private");
});

module.exports = router;
