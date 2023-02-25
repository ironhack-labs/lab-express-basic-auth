const router = require("express").Router();

const User = require("../models/User.model")
const bcrypt = require('bcryptjs')
const saltRounds = 10

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//GET signup page
router.get("/signup", (req, res) => {
  res.render("signup");
})

//POST new user
router.post("/signup", async (req, res, next) => {

    try{
      const { username, password } = req.body;
      let salt = await bcrypt.genSalt(saltRounds);
      let hashedPassword = await bcrypt.hash(password, salt);
      let newUser = await User.create({username, password: hashedPassword})

      console.log(newUser);
      res.redirect("/user-profile");
    }
    catch(error) {
      next(error);
    }
})

//GET user profile
router.get("/user-profile", (req, res) => res.render("/user-profile"));

module.exports = router;
