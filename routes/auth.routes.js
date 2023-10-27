const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});
module.exports = router;

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    console.log(user);
    const isMatch = bcryptjs.compareSync(password, user.password);
    if (isMatch) {
      console.log("match");
      res.send("match");
    } else {
      res.send("no match");
    }
  } catch (error) {console.log ('log in error',error)}
});

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const salt = bcryptjs.genSaltSync(12);
    const hashedPassword = bcryptjs.hashSync(password, salt);

    const user = await User.findOne({ email });
    if (user) {
      res.redirect("/auth/signup");
    } else {
      await User.create({
        email,
        password: hashedPassword,
      });

      console.log(`Password hash: ${hashedPassword}`);
      res.redirect("/auth/login");
    }
  } catch (error) {
    console.log(error);
  }
});
