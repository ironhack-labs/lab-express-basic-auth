const router = require("express").Router()

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index")
})


// Auth routes
router.use('/', require('./auth.routes.js'))

// User limited routes
router.use('/', require('./user.routes.js'))

module.exports = router

