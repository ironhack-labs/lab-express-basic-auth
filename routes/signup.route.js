const router = require("express").Router()
const userSchema = require("../models/User.model")
const bcryptjs = require("bcryptjs")

router.get("/Singin",(req,res)=>{
    res.render("User-register")
})
router.post("/Signin",(req,res)=>{
    const{username} =  req.body
    userSchema.findOne({username})
    .then(user=>{
        if(!user){
            bcryptjs
            .genSalt(10)
            .then(salt=>bcryptjs.hash(req.body.password, salt))
            .then(hashedPassword=>{
                req.body.password = hashedPassword
                console.log(`Password , ${req.body.password}`)
                console.log(req.body)
            })
            
            .then(()=>{
                
                userSchema.create(req.body)
                .then(usuario =>{
                    console.log(usuario)
                    res.redirect("/Login")
                })
                .catch(console.log())
            })
        } else{
            res.render("User-register",{Message:"User Registered"})
        }
    })
    .catch(console.log())
    

})
module.exports = router