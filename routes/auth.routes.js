
// importar modulos (express, bcryptjs, model y mongoose)

const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/User.model")
const mongoose = require("mongoose")


// crear ruta para signup

// GET para enviar formulario 
router.get("/auth/signup", (req,res,next) => {
    res.render("auth/signup")
})


// POST para recibir informacion del form
router.post("/auth/signup", (req,res,next) => {
    
    // deconstruir lo del body y guardarlos en las variables password, email y username
    const {password, email, username} =  req.body

    // VALIDACION DE DATOS

    // Valida que se llenen todos los campos en el formulario
    // si el campo username o email o password no esta llenado....
    if (!username || !email || !password) {
        // Reenvía de nuevo a la pantalla de registro con mensaje de error
        res.render("auth/signup", {errorMessage: "All fields must be filled"})
        // En caso de qie sí, continúa
        return
    }

    // Verifica que el email tenga una estructura válida
    // se crea una variable RegEx con la formula de validación
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

    // Si el password no cumple con la prueba de validacion del regex...
    if(!regex.test(password)) {
        // Envía el error 500 y la pagina del registro con mensaje de error
        res
            .status(500)
            .render("auth/signup", { errorMessage: "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter" })
        return
    }


    // crear cuantas veces hara el salt rounds
    const saltRounds = 12

    const salt = bcryptjs.genSaltSync(saltRounds)

    // metodo para convertir el password normal a encriptado
    const newPassword = bcryptjs.hashSync(password, salt)

    // email en minusculas
    const emailLowerCase = email.toLowerCase()

    // guardar el password encriptado en la variable newPassword
    req.body.passwordHash = newPassword

    // borrar el password normal (el que se escribe en el form)
    delete req.body.password
    console.log(req.body)

    // guardar la informacion del body en la DB
    User.create(req.body)
    .then(() => {
        // Reenvía a la página del perfil del nuevo usuario con sus datos
        res.redirect("/userProfile")
    })
    .catch((error) => {
        if (error instanceof mongoose.Error.ValidatorError) {
            res.status(500).render("auth/signup", {errorMesage: error.message})
        }
        else if (error.code === 11000) {
            res.status(500).render("auth/signup", {
                errorMessage: "Username and email need to be unique. Either username or email is already used"
            })
        } else {
            next(error)
        }
    })
})


// Crear ruta para Login

// GET para enviar el formulario de login
router.get("/auth/login", (req,res,next) => {
    res.render("auth/login")
})

// POST para recibir la info que envia en usuario desde el formulario (se guarda en el body)
router.post("/auth/login", (req,res,next) => {
    // Verificacion de emal y password sean validos
    // destructurar email y password del body
    const { email, password } = req.body
    console.log(req.body)
    console.log(email, password)

    // Buscar en la DB el email para ver si esta registrado
    User.findOne({ email })
        .then(emailFound => {
            console.log(emailFound)
            // Si es correo no se encuentra....
            if (!emailFound) {
                // redireccionar a la pagina del Login con mensaje de error
                res.render("auth/login", { errorMessage: "Email not found" })
                // en caso de si encuentre el email, pasa al siguiente If
                return
              // verifica que la contraseña escrita/proporcionada sea igual a la contraseña encriptada (HASH), el compareSync regresa un true o false
            } else if (bcryptjs.compareSync(password, emailFound.passwordHash)) {
                // en caso de el password sea correcto (true), envia a la pagina de perfil del usuario y muestra la info
                res.render('users/user-profile', { emailFound });
              // de lo contrario envia de nuevo a la pagina de login con mensaje de error
            } else {
                res.render("auth/login", { errorMessage: "Incorrect password" })
            }
        })
        .catch(error => console.log("Error", error))
})


// exportar ruta

module.exports = router;