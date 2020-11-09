const express= require ('express');
const router = express.Router();
const bcrypt = require ('bcrypt');
const User = require ('../models/User.model')

router.get('/signup', (req,res) => {
 res.render("auth/signup")
 })

router.post('/signup', async (req,res) => {
    // res.send(req.body)

    const {username, password} = req.body
    if(username === ''|| password === ''){
       res.render ("auth/signup",{error: "Missing fiels"}) 
    }
   const salt = bcrypt.genSaltSync(12)
   const hashpwd = bcrypt.hashSync(password, salt)
   await User.create ({
       username,
       password: hashpwd
   })
   res.redirect ("/profile")
})

router.get('/profile', (req,res)=> {
res.render('auth/profile')
})

router.get("/main", (req, res) => {
res.render("main")
})
        
router.get("/private", (req, res) => {
res.render("private")
})
    


    module.exports = router