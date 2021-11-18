const router = require('express').Router()

const { isLoggedOut } = require('../middleware/route-guard')


//ROUTES
router.get('/main', isLoggedOut, (req, res) => { //Prevent logged out user from accessing this page
    res.render('./main.hbs')
})

router.get('/private', isLoggedOut, (req, res) => {
    res.render('./private.hbs')
})

module.exports = router