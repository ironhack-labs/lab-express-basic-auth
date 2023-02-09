const express = require('express')
const router = express.Router()
const { isLoggedIn } = require('./../middlewares/route-guard.middleware')

router.get('/main', isLoggedIn, (req, res, next) => {

    try {

        res.render('main/main.hbs')


    } catch (error) {
        next(error)
    }
})
router.get('/private', isLoggedIn, (req, res, next) => {

    try {

        res.render('main/private.hbs')


    } catch (error) {
        next(error)
    }
})

module.exports = router