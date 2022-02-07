const router = require('express').Router()

const { logged } = require('./../middleware/route-guard')

router.get('/profile', logged, (req, res) => res.render('users/profile', { user: req.session.currentUser }))

module.exports = router