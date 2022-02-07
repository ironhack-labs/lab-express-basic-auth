const router = require('express').Router()

const { logged } = require('./../middleware/route-guard')

router.get('/private', logged, (req, res) => res.render('users/private', { user: req.session.currentUser }))

module.exports = router