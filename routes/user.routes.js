const router = require('express').Router()
const { isLoggedIn } = require('./../middleware/route-guard')

/* START */
router.get('/dashboard', isLoggedIn, (req, res, next) => {
  res.render('user/dashboard', { user: req.session.currentUser })
})
/* START */
router.get('/private', isLoggedIn, (req, res, next) => {
  res.render('user/private', { user: req.session.currentUser })
})

// END

module.exports = router
