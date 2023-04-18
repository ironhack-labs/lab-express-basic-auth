const User = require("../../models/User.model");

const bcryptjs = require("bcryptjs");
const router = require("express").Router();

//signup router -- get and post
router.get("/signup", (req, res) => {
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
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  await User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "Email is not registered. Try with other email.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        res.render("users/user-profile", { user });
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});

module.exports = router;
