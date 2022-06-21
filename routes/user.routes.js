//todo importamos y ejecutamos Express
const router = require("express").Router();

//todo importamos el modelo
const User = require("../models/User.model")

//todo importamos el Bcryptjs
const bcryptjs = require("bcryptjs");
const { Router } = require("express");


/* GET user page */
//WWW.PAGINAWEB.COM/USER
router.get("/", (req, res, next) => {
  res.send("root del user");
});



//todo CREANDO USUARIO (CRUD)

//todo SIGN UP
// esto solo sirve para traer la vista del formulario
router.get("/signup",(rqe,res,next)=>{
    res.render("auth/authForm",{isSignUp:true})
})

    //? -------------------------- VALIDACIONES --------------------------

// esto manda todo lo que le mandamos del formulario (BODY) de manera "oculta"
router.post("/signup",(req,res,next)=>{
    //destructuramos 
    const {username,password} = req.body
    
    

    //validamos que se ingrese datos
    //si no manda se manda un username o password mandara ERROR
    if(!password || !password.length || !username || !username.length){
        const errorMessage = ["Debes de llenar todos los campos"]
        return res.render("auth/authForm", {errorMessage,isSignUp:true})
    }

    //validamos que la contraseña cumpla con los parametros indicados .
    /*
    /^(?=.*\d) // should contain at least one digit
    (?=.*[a-z])// should contain at least one lower case
    (?=.*[A-Z]) // should contain at least one upper case
    [a-zA-Z0-9]{8,}// should contain at least 8 from the mentioned characters$
    */
    if( !password.match(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{8,})$/) ){
        const errorMessage = ["La contraseña debe cumplir con los parametros"]
        return res.render("auth/authForm", {errorMessage,isSignUp:true})
    }


    //? -------------------------- CREANDO USUARIO --------------------------

    //? 1) Se encripta

    const salt = bcryptjs.genSaltSync(12)
    const passHashed = bcryptjs.hashSync(password,salt)

    //? 2) Guardamos en la BD
    User.create({username,password:passHashed})
    .then(user =>{
        res.redirect(`/user/profile/${user._id}`)
    })
    .catch((error) => {
        console.log("Error", error);
        next();
      });
});





//todo LOGIN
router.get("/login",(req,res,next)=>{
    res.render("auth/authForm")
})







module.exports = router;
