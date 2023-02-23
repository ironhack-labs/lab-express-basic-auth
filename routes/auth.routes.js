const { Router } = require("express")
const router = new Router()
const User = require("../models/User.model")

const bcrypt = require("bcryptjs")
const saltRounds = 10

router.get("/signup", (req, res) => res.render("auth/signup"))

router.get("/userProfile", (req, res) => res.render("auth/user-profile"))

// POST
router.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password } = req.body
    let salt = await bcrypt.genSalt(saltRounds)
    let hashedPassword = await bcrypt.hash(password, salt)
    let newUser = await User.create({
      username,
      password: hashedPassword,
    })

    console.log(`New User : `, newUser)

    res.redirect("/userProfile")
  } catch (err) {
    next(err)
  }
})

module.exports = router
