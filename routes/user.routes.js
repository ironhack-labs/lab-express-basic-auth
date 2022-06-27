const router = require("express").Router();

const { isLoggedIn } = require('../middleware/session-guard')

//profile route
router.get('/profile', isLoggedIn, (req, res) => {
    res.render('user/profile', { user: req.session.currentUser })
})

module.exports = router