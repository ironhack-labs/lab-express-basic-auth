const router = require("express").Router()
const User = require("../models/User.model")
const bcrypt = require("bcryptjs")
const {isLoggedIn, isLoggedOut} = require("../middleware/auth.middleware")


router.get("/Login",isLoggedOut,(req,res)=>{
    res.render("Login")
})


router.post("/Login",(req,res)=>{
    const {username,password} = req.body
    User.findOne({username})
    .then(user=>{
        if(user && bcrypt.compareSync(password,user.password)){
            
            req.session.currentUser = user 
            console.log("Sesion iniciada")
            res.redirect("/main")
        } else {
            res.render("Login",{errorMessage:"email is not registered"})
        }
    })
    .catch(console.log())

})

module.exports = router
