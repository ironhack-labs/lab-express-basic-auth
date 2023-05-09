const express = require('express')
const router = express.Router()
const { isLoggedIn } = require('../middlewares/route-guard')

router.get('/', isLoggedIn, (req, res, next)=>{
    res.render('content/cat')
})

router.get('/gif', isLoggedIn, (req, res, next) => {
    res.render('content/gif')
})

module.exports = router