const router = require("express").Router();
const User = require("../models/User.model")
const bcrypt = require("bcryptjs");
const app = require("../app");
 
/* GET home page */
router.get("/", (req, res, next) => {
 console.log("req", req.session)
 res.render("index", {
   user: req.session.usuario,
   rol: req.session.rol
 });
});
 
//Ruta --> /usuario/registro
 
router.get("/usuario/registro", (req, res) => {
 res.render("registro") //nombre del archivo hbs
})
 
//Ruta para recibir los datos del formulario
router.post("/usuario/nuevo", (req, res) =>{
 const { usuario, contrasena} = req.body
 
 //Candado de seguridad
 
 if(usuario.length < 4 || contrasena.length < 4 ){
   console.log("Menor de 4")
   res.render("registro", {errorDatos: true})
   return
 }
 
 //Aqui vamos agregar el paso par encriptar la contrasena
 
 bcrypt.genSalt(10)
 .then( result => {
   console.log(result)
   bcrypt.hash("ironhack", result)
   .then( hash => {
     console.log("HASH", hash)
       User.create({usuario, contrasena: hash})
         .then((nuevoUsuario) => {
         console.log(nuevoUsuario)
         res.send('<h2>Usuario creado...</2>')
     }).catch(console.log)
   })
 }).catch(console.log)
})
 
router.get("/usuario/login", (req, res) => {
 res.render("login")
})
 
//Ruta para obtener los datos del form
 
router.post("/usuario/login", (req, res) => {
 const { usuario, contrasena } = req.body
 User.findOne({usuario})
 .then((resultado) => {
   console.log("Contrasena form:")
   console.log("Contrasena DB: ", resultado.contrasena)
 
 //Coparar contrasenas con bcrypt
   bcrypt.compare(contrasena, resultado.contrasena)
   .then( verificacion => {
     //Agregar datos al response
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
   res.redirect("/usuario/login")
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
 
//POST -> re.body siempre para mandar algo al server
 