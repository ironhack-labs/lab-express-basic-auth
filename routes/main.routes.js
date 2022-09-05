const router = require('express').Router()

router.get('/', (req, res) => {
    res.render('main')
})

router.get('/main', (req, res) => {
    const user = req.session.user
    res.render('main', user)
})

module.exports = router