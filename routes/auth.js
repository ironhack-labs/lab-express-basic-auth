const {genSaltSync}= require("bcrypt")
const express = require("express")
const router=express.Router()
const bcrypt=require("bcrypt")
const User=require("../models/User.model")


router.get("/signup",(req,res)=>{
    res.render('auth/signup')
})

router.post("/signup", async (req,res)=>{
    //1.Informacion del form
    const {username, password}=req.body
    // 2.evaluar campos
    if (username===""||password==="") {
        // 2.1 mensaje de error
        return res.render('auth/signup',{error:"Missing fields"})
    }else{
        // 3. validar correo existente
        const user=await User.findOne({username})
        if(user){
    // 3.1 mensaje de error si correo ya existe
            return res.render('auth/signup',{error:'something went wrong'})
        }
    // 4. Hashear contraseña
    const salt=bcrypt.genSaltSync(10)
    const hashpwd=bcrypt.hashSync(password, salt)
    await User.create({username,password:hashpwd})
    // 5. respuesta al usuario
    res.redirect('/profile')
    }
})

module.exports=router