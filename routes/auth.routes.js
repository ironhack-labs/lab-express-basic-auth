
// importar modulos (express, bcryptjs, model)

const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require('../models/User.model')


// crear ruta para signup

// GET para enviar formulario 
router.get("/auth/signup", (req,res,next) => {
    res.render("auth/signup")
})


// POST para recibir informacion del form
router.post("/auth/signup", (req,res,next) => {
    
    // deconstruir lo del body y guardarlos en las variables password y email
    const {password, email} =  req.body

    // crear cuantas veces hara el salt rounds
    const saltRounds = 12

    const salt = bcrypt.genSaltSync(saltRounds)

    // metodo para convertir el password normal a encriptado
    const newPassword = bcrypt.hashSync(password, salt)

    // email en minusculas
    const emailLowerCase = email.toLowerCase()

    // guardar el password encriptado en la variable newPassword
    req.body.passwordHash = newPassword

    // borrar el password normal (el que se escribe en el form)
    delete req.body.password

    // guardar la informacion del body en la DB
    User.create(req.body)
    .then(() => {
        res.redirect("/")
    })
    .catch(error => console.log("Error al crear usuario", error))
})


// exportar ruta

module.exports = router;