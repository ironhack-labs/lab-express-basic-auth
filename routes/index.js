const router = require("express").Router();
const bcryptjs = require('bcryptjs')
const User = require('../models/User.model')


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


// signup router

router.get("/signup", (req,res,next) => {
  res.render("signup")
})

router.post("/signup", (req,res,next) => {
  const {username, password} = req.body
  // hashing the password :0
  async function regUser() {
    // make the salt
    const salt = await bcryptjs.genSalt();
    // salt the pass
    const hashedPass = await bcryptjs.hash(password,salt);
    // call User model to create and save the user
    const newUser = await User.create({username, password:hashedPass});
    // redirect to wherever we want
    res.redirect('/')
  }
  regUser();
})

module.exports = router;
