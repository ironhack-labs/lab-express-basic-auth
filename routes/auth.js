const router = require("express").Router();
const bcrypt = require('bcryptjs');

// Model
const User = require("../models/User.model")

/* GET sign up */
router.get("/signup", (req, res, next) => {
  res.render("users/signup.hbs");
});


/* POST sign up */
router.post("/signup", async (req, res, next) => {
  const {username, password} = req.body;
  try {
      //Encrypt password
      var hashedPassword = await bcrypt.hash(password, 10);
      const createdUser = await User.create({username, password: hashedPassword})
      res.render("users/signup.hbs", {justCreatedUser: createdUser.username})
  } catch (err){
      console.log(err)
  }
});

module.exports = router;
