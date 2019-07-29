const express = require('express');
const router  = express.Router();


const bcrypt = require('bcrypt')
const bcryptSalt = 10
const User = require('../models/user.model')


/* GET home page */
router.get('/', (req, res, next) => {
    res.render('signin');
});

router.post('/',(req, res, next) =>{
    const{user,password} = req.body
    // console.log("rellena datos")

    if (user === "" || password === "") {
        // console.log("vacio")
        res.render("signin", { errorMessage: "Rellena todo" })
        return  // En caso de no pasar la validación, abandona la función sin crear el usuario ni el hash
      }

    //comprobar si está repetido el user
    User.findOne({ user })  
    .then(user=>{
        if(user){
            res.render('signin',{errorMessage : "el user ya existe"})
            return
        }
    })
    .catch(err => console.log(err))

    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)
        User.create({ user, password: hashPass })
        .then(() => {
            res.redirect('/')})
        .catch(err => console.log('ERRORR:', err))
        


})

router.get("/", (req, res, next) => res.render("index"))
router.post("/", (req, res, next) => {
 const { user, password } = req.body
 if (user === "" || password === "") {
   res.render("index", { errorMessage: "Rellena todo." });
   return;
 }
 User.findOne({ user })
   .then(elem => {
     if (!elem) {
       res.render("index", { errorMessage: "El usuario no existe." })
       return
     }
     if (bcrypt.compareSync(password, elem.password)) {
       req.session.currentUser = elem    // Guarda el usuario en la sesión actual
       res.redirect("/private-area")
     } else {
       res.render("index", { errorMessage: "Contraseña incorrecta" })
     }
   })
   .catch(error => next(error))
})
module.exports = router;
