const User = require("../../models/User.model");

const bcryptjs = require("bcryptjs");
const router = require("express").Router();
const isLoggedOut = require("../../middlewares/isLoggedOut");

//signup router -- get and post
router.get("/signup", isLoggedOut, (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  const salt = await bcryptjs.genSalt(12);
  const hash = await bcryptjs.hash(req.body.password, salt);

  const user = new User({ username: req.body.username, password: hash });
  await user.save();
  res.send("done");
});

//login route -- get and post
router.get("/login", isLoggedOut, (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res, next) => {
  try {
    console.log(req.body.username);
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.render("login", { error: "User doesn't exist" });
    }
    const passwordMatch = await bcryptjs.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatch) {
      return res.render("login", {
        error: "Sorry the password is incorrect!",
      });
    }

    req.session.username = {
      username: user.username,
    };
    console.log(req.session.username);

    res.redirect("/user-profile");
  } catch (err) {
    console.log(err);
  }
});

//logout route

router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect("/");
  });
});

//protected routes

module.exports = router;
