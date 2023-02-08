const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// render signup page
router.get("/signup", (req, res, next) => {
  res.render("signup");
});

// submit new User signup
router.post("/signup", async (req, res) => {
  try {
    // deconstruct req.body
    const { username, password } = req.body;

    // validation: check if username or password is empty
    if (!username || !password) {
      res.render("signup", {
        message: "username and password cannot be empty",
      });
    }

    // validation: check if username is already taken
    const user = await User.findOne({ username });
    if (user !== null) {
      res.render("signup", { message: "username is already taken" });
    } else {
      // username is available

      // hash the password
      const hash = await bcrypt.hash(password, 12);

      // create new user
      const newUser = await User.create({ username: username, password: hash });
      // res.send(`new user ${username} created`);
      res.redirect("/profile");
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// render login page
router.get("/login", (req, res, next) => {
  res.render("login");
});

// submit login
router.post("/login", async (req, res, next) => {
  // deconstruct req.body
  const { username, password } = req.body;

  // find user in database
  const user = await User.findOne({ username });

  // compare password
  const result = await bcrypt.compareSync(password, user.password);
  if (result) {
    console.log("CONGRATS SUCCESSFUL LOGIN");
    res.redirect("/profile");
  } else {
    console.log("INCORRECT PASSWORD. TRY AGAIN.");
    res.render("login", { message: "incorrect username or password!" });
  }
});

// render profile page
router.get("/profile", (req, res, next) => {
  res.render("profile");
});

module.exports = router;
