const express = require('express')
const router = express.Router()
const User = require('../models/User.model')
const bcrypt = require('bcrypt')
const { genSaltSync } = require('bcrypt')

router.post("/signup", async (req, res) => {
  // 1. Tomar la informacion del form
  const {username, password} = req.body
  // 2. evaluar si nos enviaron campos vacios
  if (username === "" || password === ""){
    // 2.1 si es asi, enviar un mensaje de error
    return res.render("index", {alert: 'Missing fields'})
  } else {
    // 2.2 Buscamos un user cuyo username sea igual al que nos proveen desde el form
    const user = await User.findOne({ username })

    // 2.3 Si retorna un usuario enviamos un mensaje de error
    if (user) {
      return res.render("index", {alert: 'Repeated Username'})
    }

    // 3. Si pasa los test hasheamos la contrase~a
    const salt = bcrypt.genSaltSync(12) // 10-14
    const hashpwd = bcrypt.hashSync(password, salt)

    // 4 guardamos al usuario en la db
    const newUser = await User.create({
      username,
      password: hashpwd
    })

    // 5. responder al usuario de alguna forma (redirect('/profile'))
    // 5.2 guardar al usuario en la cookie
    delete newUser.password //removemos el password del cookie
    req.session.currentUser = newUser //agregamos el user al cookie en una nueva llave (currentUser)
    res.redirect("/profile")
  }
})

router.post('/signin', async (req, res) => {
  // 1. tomamos la informacion del formulario
  const {username, password} = req.body
  // 2. Evaluamos is la informacion esta completa
  if (username === "" || password === "") {
    res.render('index', {alert: 'Missing fields'})
  } else {
    // 2.2 Verificamos que el usuario exista
    const user = await User.findOne({username})

    if (!user) {
      return res.render('index', {alert: "User Not Exists"})
    }

    // 4. si existe el usuario en la base de datos, comparamos la contrase~a de ese usuario, con la que llego del form
    if (bcrypt.compareSync(password, user.password)) {
      // 4.1 si coinciden renderizamos profile con el usuario y lo agregamos a la cookie
      delete user.password //removemos el password del cookie
      req.session.currentUser = user //agregamos el user al cookie en una nueva llave (currentUser)
      res.redirect('/profile')
    } else {
      // 4.2 Si no coinciden, enviamos el error
      res.render('index', {alert: 'Wrong Password'})
    }
  }
})

router.get('/profile', (req, res) => {
  //only if a user have a session can login
  if (req.session.currentUser) {
    res.render('profile', { user: req.session.currentUser })
  } else {
    res.redirect('/')
  }
})

router.get('/logout', (req, res) => {
  //destroy de cookie
  req.session.destroy
  res.redirect('/')
})

module.exports = router
