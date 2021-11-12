const router = require("express").Router();
const User = require("../models/User.model")
const bcrypt = require("bcrypt")

router.get("/signup", (req, res) => res.render("auth/signup"))

router.post("/signup", (req, res) => {
    const {username, password} = req.body
    
    if (username.length === 0 || password.length === 0) {
        res.render('auth/signup', { errorMessage: 'Campo vacio' })
    }

    User.find({username})
    .then(user => {
        if(user.length){
            res.render("auth/signup", { errorMessage: "Usuario ya existente."})
        }
        else {

            const bcryptSalt = 10
            const salt = bcrypt.genSaltSync(bcryptSalt)
      
            const hashPass = bcrypt.hashSync(password, salt)
            User.create({ username, password: hashPass })
            .then(createdUser => res.redirect("/auth/login"))
            .catch(err => console.log(err))   
        }
        }

    )
})

router.get("/login", (req, res) => {
    res.render("auth/login")
})

router.post("/login", (req, res) => {
    const { username, password } = req.body
    
    if (username.length === 0 || password.length === 0) {

        res.render('auth/login', { errorMessage: 'Campo vacio' })
    }
    //Buscamos si existe el usuario
    User.findOne({ username })
      .then(user => {
  
        //Si el usuario no existe enviamos error
        if (!user) {
          res.render('auth/login', { errorMessage: 'Usuario no reconocido' })
          return
        }
  
        //Si la contraseña no coincide con el hash enviamos error
        if (bcrypt.compareSync(password, user.password) === false) {
          res.render('auth/login', { errorMessage: 'Contraseña incorrecta' })
          return
        }
  
        //5. Enganchar el objeto de usuario al req.session
        req.session.currentUser = user
        res.redirect("/")
      })
      .catch(err => console.log(err))
  })


module.exports = router;