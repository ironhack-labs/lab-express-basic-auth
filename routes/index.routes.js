const router = require("express").Router()

//Route for index
router.get("/", (req, res, next) => {
  res.render("index")
})

module.exports = router
