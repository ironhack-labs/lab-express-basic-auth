
const router = require('express').Router()

const {isLoggedIn} = require('../middleware/route-guard')

router.get('/inicio-sesion', isLoggedIn, (req, res, next) => {
    res.render('private', {user: req.session.currentUser})
})

module.exports = router;

