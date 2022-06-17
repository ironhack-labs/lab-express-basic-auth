const router = require("express").Router()
const User = require ("../models/User.model")
const bcryptjs = require ("bcryptjs")


//Registrarse 
router.get("/signup",(req,res,next)=>{

res.render("singn-up")

})

router.post("/signup",(req,res,next)=>{
const {role, ...restUser} = req.body;
const salt= bcryptjs.genSaltSync(12)
const newPassword = bcryptjs.hashSync(restUser.password,salt)

User.create({...restUser,password:newPassword})
.then(user=>{
    res.redirect(`/auth/profile/${user._id}`)

})
.catch(error=>{
    console.log("Cual es mi error",error)
})

})

router.get ("/profile/:id",(req,res,next)=>{
const {id} = req.params

User.findById(id)
.then(user=>{
    res.render("profile",user)
})
.catch(error=>{
    console.log("Cual es mi error",error)
})

})

//login
router.get("/login",(req,res,next)=>{
    res.render("login")
})

router.post("/login",(req,res,next)=>{
const {username,password}= req.body

User.findOne({username})
.then(user=>{
    if(bcryptjs.compareSync(password,user.password)){
        res.redirect(`/auth/profile/${user._id}`)
    }
    else{
        res.send("No es la contraseña o el usuario")
    }
})  
.catch(error=>{
    console.log("Cual es mi error",error)
})

})






module.exports= router