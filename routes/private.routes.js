const router = require('express').Router()

router.get('/', (req, res, next) => {
    res.render('private/index')
})

module.exports = router