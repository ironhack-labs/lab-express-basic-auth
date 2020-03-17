const express = require('express');
const router  = express.Router();
const User = require('../models/User')

router.get('/', (req,res)=>{
    res.render('login')
})

router.post('/', (req,res)=>{
    User.findOne({username:req.body.username})
    .then(user=>{
        if (!user) res.send('something went wong')
        else if (user.password !== req.body.password) res.send('somting went wrong')
        else {
            req.session.currentUser = user //UnhandledPromiseRejectionWarning: TypeError: Cannot set property 'currentUser' of undefined
            res.redirect('/main')
        }
    })
})

module.exports = router;