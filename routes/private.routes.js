const express = require('express')
const router = express.Router()

//Login check

router.use((req, res, next) => {
    if (req.session.currentUser) {
        next()
    } else {
        res.render("restricted", { errorMsg: 'Área restringida! >_<' })
    }
})

router.get('/main', (req, res) => {
    res.render('main', req.session.currentUser)
})

router.get('/private', (req, res) => {
    res.render('private', req.session.currentUser)
})

module.exports = router