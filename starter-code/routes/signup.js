const express = require('express');
const router  = express.Router();
const User = require('../models/User')

router.get('/', (req,res)=>{
    res.render('signup')
})

router.post('/', (req,res)=>{
    console.log(req.body)
    User.create({
        username:req.body.username,
        password:req.body.password
    })
    .then(()=>{
        res.redirect('/login')

    })
    .catch(err=>res.send(err))
})

module.exports = router;