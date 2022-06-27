const router = require("express").Router()
const User = require("./../models/User.model")

const bcryptjs = require("bcryptjs")
const salRounds = 10

router.get("/registro", (req, res) => {
   res.render("auth/signup")
})

router.post("/registro", (req, res) => {
   const { username, password: plainPassword } = req.body

   if (username.length === 0 || plainPassword.length === 0) {
      res.render('auth/signup', { errorMessage: 'Estos campos son obligatorios' })
      return
   }

   User
      .findOne({ username: username })
      .then(eachusername => {
         if (eachusername) {
            res.render('auth/signup', { errorMessage: 'Usuario ya existente' })
         }
      })

   bcryptjs
      .genSalt(salRounds)
      .then(salt => bcryptjs.hash(plainPassword, salt))
      .then(hashedPasword => User.create({ username, password: hashedPasword }))
      .then(() => res.redirect("/"))
      .catch(err => console.log(err))

})

router.get('/inicio-sesion', (req, res) => {

   res.render('auth/login')
})

router.post('/inicio-sesion', (req, res) => {
   const { username, password: plainPassword } = req.body

   if (username.length === 0 || plainPassword.length === 0) {
      res.render('auth/login', { errorMessage: 'Estos campos son obligatorios' })
      return
   }

   User
      .findOne({ username })
      .then(user => {
         if (!user) {
            res.render('auth/login', { errorMessage: 'Usuario no reconocido' })
            return
         }

         if (bcryptjs.compareSync(plainPassword, user.password) === false) {
            res.render('auth/login', { errorMessage: 'Contraseña no válida' })
            return
         }
         req.session.currentUser = user
         res.redirect('/private')
      })
      .catch(err => console.log(err))
})

router.post('/cerrar-sesion', (req, res) => {
   req.session.destroy()
   res.redirect('/inicio-sesion')
})

module.exports = router