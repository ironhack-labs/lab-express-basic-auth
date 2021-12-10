const router = require('express').Router()

const User = require('../models/User.model')

const bcryptjs = require('bcryptjs')

//GET

router.get('/signup',(req,res)=>{
    res.render('auth/signup')
})


//POST
router.post('/signup', async(req,res)=>{
    const {email,username,password} = req.body
    try{
        const salt = bcryptjs.genSaltSync(10)
        const hashedPass = bcryptjs.hashSync(password,salt)
        const user = await User.create({email,username,password:hashedPass})
        res.redirect(`/profile/${user._id}`)
    } catch(error){
        console.log("ERROR EN POST USER",error)
        res.send("ERROR EN POST USER")
    }
})


//GET PROFILE URL
router.get('/profile/:id',(req,res)=>{
    User.findById(req.params.id)
    .then(user=>{
        res.render('auth/profile',{user})
    })
    .catch(error=>{
        console.log("ERROR EN GET PROFILE",error)
        res.render("ERROR")
    })
})

module.exports = router;
