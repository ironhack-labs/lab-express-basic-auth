const router = require('express').Router()

router.get('/', (req, res, next) => {
    res.render('main/index')
})

module.exports = router