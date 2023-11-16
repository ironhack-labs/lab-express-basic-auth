const router = require("express").Router();

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const User = require("../models/User.model");

router.get("/signup", (req, res) => res.render("auth/signup"));

router.post("/signup", (req, res, next) => {
  // console.log("The form data: ", req.body);

  const { username, password } = req.body;

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      //console.log(`Password hash: ${hashedPassword}`);
      return User.create({
        username,
        password: hashedPassword,
      });
    })
    .then((userFromDB) => {
      console.log("Newly created user is: ", userFromDB);
    })
    .catch((error) => next(error));
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.render("/auth/login", { error: "All fields are required" });
    return;
  }

  const foundUser = await User.findOne({ username });
  if (!foundUser) {
    res.render("/auth/login", { error: "User does not exist" });
    return;
  }

  const { password: hashedPassword } = foundUser;
  const isPasswordMatch = await bcryptjs.compare(password, hashedPassword);

  if (!isPasswordMatch) {
    res.render("/auth/login", { error: "Wrong Password" });
    return;
  }

  req.session.currentUser = foundUser;
  res.redirect("/user/dashboard");
  console.log(foundUser)
});

module.exports = router;
