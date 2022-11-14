const isLoggedIn = require('../middleware/isLoggedIn.middleware')

const router = require('express').Router()

router.get('/', (req, res) => {
    res.render('user/index', req.session.user)
})

router.get('/logut', (req, res) => {
    req.session.destroy(err => {
        if (err) { next(err); return }
        res.redirect('/')
    })
})

module.exports = router