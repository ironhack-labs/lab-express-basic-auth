const express = require('express')
const { isLoggedIn } = require('../middlewares/route.guard')
const router = express.Router()

router.get('/profile', isLoggedIn, (req, res, next) => {

    res.render('user/profile', { loggedUser: req.session.currentUser })

})

router.get('/private', isLoggedIn, (req, res, next) => {

    res.render('user/private', { loggedUser: req.session.currentUser })
})

router.get('/logout', isLoggedIn, (req, res, next) => {
    req.session.destroy(() => res.render(('index'), { MessageSuccess: 'Succesfully Logged out' }))
})



module.exports = router