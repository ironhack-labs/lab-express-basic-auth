const router = require('express').Router()

router.get('/', (req, res) => {

    res.render('private')
})

router.get('/private', (req, res) => {
    const user = req.session.user
    res.render('private', user)
})

module.exports = router