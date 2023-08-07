const express = require('express')
const { isloggedIn } = require('../../middlewares/route-guard')
const router = express.Router()


router.get('/', isloggedIn, (req, res) => {

    console.log('User logged', req.session.currentUser)
    // res.render('user/main', { loggedUser: req.session.currentUser })
})

module.exports = router