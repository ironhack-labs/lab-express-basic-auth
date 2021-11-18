const router = require("express").Router();
const bcrypt = require("bcryptjs");

//Model
const User = require("../models/User.model");

/* GET form to create new user */
router.get("/signup", (req, res) => {
  res.render("signup");
});

module.exports = router;

/* POST create new user */
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await User.create({
      username,
      password: hashedPassword,
    });
    res.render("signup", { justCreatedUser: createdUser.username });
  } catch (err) {
    console.log(err);
  }
});
