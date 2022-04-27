const router = require("express").Router()
const userSchema = require("../models/User.model")
const bcryptjs = require("bcryptjs")

router.get("/Singin",(req,res)=>{
    res.render("User-register")
})
router.post("/Signin",(req,res)=>{
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
        .then(console.log())
        .catch(console.log())
    })

})
module.exports = router