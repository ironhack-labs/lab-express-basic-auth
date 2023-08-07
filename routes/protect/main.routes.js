const express = require('express')
const { isloggedIn } = require('../../middlewares/route-guard')
const router = express.Router()


router.get('/user/main', isloggedIn, (req, res) => {

    console.log('User logged', req.session.currentUser)
    // res.render('protect/main', { loggedUser: req.session.currentUser })
})

module.exports = router