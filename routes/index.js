const router = require("express").Router();
const { create } = require("hbs");
//ruta para requerir el usuario
const User =require("../models/User.model")
const bcrypt= require("bcryptjs")


/* GET home page */
router.get("/", (req, res, next) => {
  console.log("req", res)
  res.render("index", {
    user: req.session.usuario, 
    rol: req.session.rol
  });
});
//RUTA : quiero que el usuario acceda al usuario/registro

router.get("/usuario/registro", (req, res) => {
  res.render("registro")
})
router.get("/usuario/nuevo", (req, res) => {
  res.render("login")
})
//ruta para recibir los datos del formulario
//POST = REQ.BODY
router.post("/usuario/nuevo", (req, res) => {
  const {usuario, contraseña} = req.body

  //Candado de seguridad:
  if (usuario.length < 4) {
    console.log("Menor de 4)")
    res.render("registro", {errorDatos: true})
    //No se ejecuta lo demás
    return
  }


  //generador de las contraseñas encriptadas

bcrypt.genSalt(10)
  .then(result => {
    console.log(result)
    bcrypt.hash(contraseña, result)
    .then(hash => {
      console.log("HASH:", hash)
      User.create({usuario, contraseña: hash})
    .then((nuevoUsuario) => {
      console.log(req.body)
      res.send("<h2>Usuario creado...</h2>")
    }).catch(console.log)
   })
  }).catch(console.log)  
})

//Ruta para mostrar el form de login 

router.post("/usuario/login", (req, res) => {
  const {usuario, contraseña} = req.body
  User.findOne({usuario}) .then((resultado) => {
    console.log("Contraseña form:", contraseña)
    console.log("Contraseña DB:", resultado.contraseña)
    
    // if (contraseña === resultado.contraseña) {
    //   console.log("Estas autenticado")
    // }else {
    //   console.log("tus datos estan mal")
    // }
    bcrypt.compare(contraseña, resultado.contraseña)
    .then(verificacion => {
      //agregar datos al response
      req.session.usuario = resultado.usuario
      req.session.yaCasiNosVamos = true;
      console.log(verificacion)
      res.redirect("/usuario/privado")
    })
    .catch(console.log)
    
  })
  .catch(console.log)
})


function verificarSession(req, res, next) {
  console.log(verificarSession)
  console.log(req.session)
  if(req.session.usuario) { 
  next()
  } else {
    res.redirect("/usuario/nuevo")
  }
}
//Ruta para obtener los datos del form

router.get("/usuario/privado", verificarSession, (req, res) => {

  res.render("privado", {
    user: req.session.usuario, 
    rol: req.session.rol
  })
})
router.get("/usuario/cerrar-sesion", (req, res) => {
  req.session.destroy()
  res.redirect("/")
})
module.exports = router;
