const router = require("express").Router()
const {isLoggedIn}=require('../middleware/middleware')// ahora con el middelware va a comprobar que este iniciada la session
router.get("/perfil",isLoggedIn,(req,res,next)=>{
    res.render("perfil");
})
router.get("/main",(req,res,next)=>{
res.render("main")
}),

router.get("/private",(req,res,next)=>{
    res.render("private")
}),

module.exports = router