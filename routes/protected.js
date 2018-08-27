const express = require('express')
const router = express.Router()

function authoriseMiddleWare(req, res, next) {
    if (!req.session.currentUser) res.send('You should not be here')
    else next()
}

router.use(authoriseMiddleWare)

router.get('/main', (req, res) => {
    res.render('protected')
})

router.get('/private', (req, res) => {
    res.render('private')
})

module.exports = router
