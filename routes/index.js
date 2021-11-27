const router = require("express").Router();
const User = require("../models/User.model")
const bcryptjs = require("bcryptjs")


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
router.get("/login", (req, res, next) => {
  res.render("login")
})
router.get("/signup", (req, res, next) => {
  res.render("signup")
})
router.get("/private", (req, res, next) => {
  res.render("private")
})

router.post("/signup", async (req, res, next) => {
  const {username , password} = req.body
  const saltRounds = 10
  try {
    const salt = await bcryptjs.genSalt(saltRounds)
    hashedPassword = await bcryptjs.hash(password, salt)
  }
  catch(err) {
    console.log(err)
  }
  try {
    await User.create({"username": username, "password": hashedPassword})
    res.render("login")
  }
  catch(err) {
    res.redirect("/signup")
  }
})

router.post("/login", async (req, res, next) => {
  const {username, password} = req.body
  try {
    const foundUser = await User.findOne({"username": username})
    const correctPassword = await bcryptjs.compare(password, foundUser.password)

    if(correctPassword) {
      res.redirect("/private")
    }
    else{
      res.render("/login")
    }
  }
  catch(err) {
    console.log(err)
    res.redirect("/login")
  }
})

module.exports = router;
