const express = require("express")
const router = express.Router()

router.use("/", (req, res, next) => {
  console.log(req.session.user)
  if (req.session.user) {
    next()
  } else {
    res.redirect("/")
  }
})

module.exports = router;