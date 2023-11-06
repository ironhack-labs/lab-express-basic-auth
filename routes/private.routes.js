const express = require('express')
const router = express.Router()
const { isLoggedIn } = require('./../middleware/route-guard')

const User = require('./../models/User.model')

router.get('/', (req, res) => {
    res.render('spirit-animal')
})


module.exports = router;