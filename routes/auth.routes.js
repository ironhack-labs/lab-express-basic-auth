const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const saltRounds = 10

const User = require("./../models/User.model")


router.get("/sign-up", (req, res)=>{
    res.render("auth/signup-page")
})

router.post("/sign-up", (req, res, next)=>{
    const { email, plainPassword } = req.body

      if(email.length === 0 || plainPassword.length === 0){
        res.render("auth/signup-page", { errorMessage: "ambos campos son obligatorios" })
    }


    //recoges los datos del usuario y encriptas su contraseña para despues insertarlo en la bbdd de users
    bcrypt
    .genSalt(saltRounds)
    .then(salt => bcrypt.hash(plainPassword, salt))
    .then(hashPass => User.create({ email, password: hashPass }))
    .then(()=> res.redirect("/login")) //cuando te registres entras en el login
    .catch(err => next(err))
})



router.get("/login", (req, res, next) => {
    res.render("auth/login-page")
})

router.post("/login", (req, res, next) => {
    const { email, password } = req.body
    console.log("LOGIN EMAIL Y PASS:", email, password)

    if(email.length === 0 || password.length === 0){
        res.render("auth/login-page", { errorMessage: "ambos campos son obligatorios" })
    }


    //comprobar que los datos que introduce el user existen en la bbdd para dejarle entrar

    User
    .findOne({email})
    .then(foundUser => {
        if(!foundUser) {
            res.render("auth/login-page", { errorMessage: "no existe ese usuario" } )
            return
        }

        if(!bcrypt.compareSync(password, foundUser.password)){
            res.render("auth/login-page", { errorMessage: "constraseña incorrecta" } )
            return
        }


        //una vez encontrado el usuario, le abrimos sesion
         req.session.currentUser = foundUser // login!
        res.redirect('/profile')

    })
})


router.get('/desconectar', (req, res, next) => {
  req.session.destroy(() => res.redirect('/'))
})


module.exports = router
