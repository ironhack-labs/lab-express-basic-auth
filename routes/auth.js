const {
  genSaltSync
} = require("bcrypt")
const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const User = require("../models/User.model")

router.get("/signup", (req, res) => {
  res.render("auth/signup")
})

router.post("/signup", async (req, res) => {
  // 1. Tomar la informacion del form
  const {
    name,
    email,
    password
  } = req.body
  // 2. evaluar si nos enviaron campos vacios
  if (name === "" || email === "" || password === "") {
    // 2.1 si es asi, enviar un mensaje de error
    return res.render("auth/signup", {
      error: "Missing fields"
    })
  } else {
    // Buscamos un user cuyo correo sea el que nos proveen desde el form
    const user = await User.findOne({
      email
    })
    console.log("user",user);
    // si la busqueda tiene resultado, mostramos el mensaje de error
    if (user) {
      return res.render("auth/signup", {
        error: "ya hay un usuario con esos datos"
      })
    }
    // 3. hashear la contrase~a
    const salt = bcrypt.genSaltSync(12)
    const hashpwd = bcrypt.hashSync(password, salt)
    // 3.1 Si nos dieron  la informacion correcta, podemos guardar al usuario en la db

    // console.log("NAME",name);
    await User.create({
      name,
      email,
      password: hashpwd
    })
    // 5. responder al usuario de alguna forma (redirect('/profile'))
    res.render("/auth/profile")
  }
})





router.get("/login", (req, res) => {
  res.render("auth/login")
})

router.post("/login", async (req, res) => {
  // res.send(req.body)
  // 1. tomamos la informacion del formulario
  const {
    email,
    password
  } = req.body
  // 2. evaluar si la informacion esta completa
  if (email === "" || password === "") {
    res.render("auth/login", {
      error: "Missing fields"
    })
  }
  // 3. buscamos si hay un usuario con el correo que nos enviaron
  const user = await User.findOne({
    email
  })
  // 3.1 si no hay usuario notificar el error
  if (!user) {
    res.render("auth/login", {
      error: "something went wrong"
    })
  }

  // 4. si existe el usuario en la base de datos, comparamos la contrase~a de ese usuario, con la que llego del form
  if (bcrypt.compareSync(password, user.password)) {
    // 4.1 si coinciden renderizamos profile con el usuario
    // res.render("auth/profile", user)
    delete user.password
    req.session.currentUser = user
    res.redirect("/profile")
  } else {
    // 4.2 si no coinciden, hacemos render del form con el error
    res.render("auth/login", {
      error: "something went wrong"
    })
  }
})

router.get("/profile", (req, res) => {
  res.render("auth/profile", {
    user: req.session.currentUser
  })
})

router.get("/logout", (req, res) => {
  req.session.destroy()
  res.redirect("/")
})

module.exports = router
