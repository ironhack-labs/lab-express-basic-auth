const router = require("express").Router();
const User = require("../models/User.model")
const bcrypt = require("bcrypt")


router.get("/signup", (req, res) => res.render("auth/signup"))

router.post("/signup", (req, res) => {

  const { username, password } = req.body
  //console.log(username, password)

  //Comprobamos si existe el usuario
  User.find({ username })
    .then(user => {

      //Si ya existe devolvemos error
      if (user.length) {
        res.render("auth/signup", { errorMessage: "Usuario ya existente." })
      } else {

        //Si no generamos el salt...
        const bcryptSalt = 10
        const salt = bcrypt.genSaltSync(bcryptSalt)
        //Y encriptamos la contraseña
        const hashPass = bcrypt.hashSync(password, salt)


        User.create({ username, password: hashPass })
          .then(() => res.redirect("/auth/login"))
          .catch(err => console.log(err))
      }

    })

})

router.get("/login", (req,res) => {
  res.render("auth/login")
  
})

router.post("/login", (req,res) => {
  const {username, password} = req.body

  User.findOne({username})
    .then(username => {
      if(!username){
        res.render("auth/login", { errorMessage: 'Usuario sin crear'})
        return
      }

      if (bcrypt.compareSync(password, username.password) === false) {
        res.render("auth/login", {errorMessage:'Contraseña de mierda'})
        return
      }
      req.session.currentUser = username
      res.redirect("/private")
    })

.catch(err =>console.log(err) )

})

router.get('/logout', (req,res) => {
  req.session.destroy(()=> res.redirect("/"))
})

module.exports = router;