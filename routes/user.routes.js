const { modelName } = require('../models/User.model')

const router = require('express').Router()

router.get('/accountCreated', (req, res)=>{
    res.render('users/accountCreated')
})

module.exports = router