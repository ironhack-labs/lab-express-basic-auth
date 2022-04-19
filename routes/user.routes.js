const router = require('express').Router()

const { isLoggedIn } = require('./../middleware/route-guard')

router.get('/user', isLoggedIn, (req, res) => {
    res.render('user', { user: req.session.currentUser })
})

module.exports = router;
