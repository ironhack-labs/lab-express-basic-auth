const router = require("express").Router();
const User = require("../models/User.model")
const bcrypt = require("bcryptjs")
const session = require('express-session') 
const connectMongo = require('connect-mongo') 



router.get("/signup", (req, res) => res.render("auth/signup"))

router.post("/signup", (req, res) => {

  const { username, password } = req.body

  // console.log(username,password);

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
    .catch(err => console.log(err))

})

router.get("/login", (req, res) => {
  res.render("auth/login")
})

router.post("/login", (req, res) => {

  

  const { username, password } = req.body

 console.log(username,password);


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
      //console.log(user);
      //5. Enganchar el objeto de usuario al req.session
      req.session.currentUser = user
      res.redirect("/main")
    })
    .catch(err => console.log(err))
})


router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'))
})


module.exports = router;
