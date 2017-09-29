const express    = require("express");
const siteRoutes = express.Router();

siteRoutes.use( (req, res, next) => {
  if (req.session.currentUser) {
    next()
  } else {
    res.render('index', {
      errorMessage: "You need to be logged in to view this page"
    })
  }
})

siteRoutes.get('/private', (req, res, next) => {
  res.render('private')
})

siteRoutes.get('/main', (req, res, next) => {
  res.render('main')
})

module.exports = siteRoutes