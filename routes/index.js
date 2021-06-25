const router = require("express").Router();
const app = require('../app')
const User = require('../models/User.model.js')
const bcrypt = require('bcrypt')





/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//SIGNUP

//a través del enlace signup del navbar de la index view, renderizamos la view de signup con el formulario para registrarse.

router.get('/signup', (req, res) => res.render('signup'));

router.post('/signup', (req, res) => {


  const { username, pwd } = req.body

  // si el username que escribe el cliente ya está cogido, salta error. Sino, regístra el ususario.
  User
    .findOne({ username })
    .then(user => {

      if (user) {
        res.render('/signup', { errorMessage: 'Usuario ya registrado' })
        return
      }

      //registro de ususario con password encriptada

      const bcryptSalt = 10
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(pwd, salt)//ponemos pwd para no confundirlo con la password real
      // pwd es el hash que encripta la password real y es la que queda registrada en la BBDD
      User
        .create({ username, password: hashPass })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))

    })
    .catch(err => console.log(err))
})

//por otro lado, hacemos q el enlace del navbar de login nos lleve a la view login, renderizando

router.get('/login', (req, res) => res.render('login'))

//ahora vamos a obtener los datos de login, los comprobaremos para ver si son ciertos y daremos de alta una sesión para este usuario en concreto.

router.post('/login', (req, res) => {

  const { username, pwd } = req.body

  User //BBDD, dime si hay un usuario con este.
    .findOne({ username })
    // o user === false, es decir, si no está en la BBDD, mensaje de error.
    .then(user => {

      
      if (!user) {
        res.render('login', { errorMessage: 'Usuario no reconocido' })
        return
      }
      //si la password es incorrecta mediante uso de bcrypt, que nos verifica si nuestra password es la verdadera
      //mediante comparación con el hash que crea el sistema de encriptación para esa password en  concreto.
      //si la comparación entre ambos elementos no coincide, logea un error de password 'errormessage'
      if (bcrypt.compareSync(pwd, user.password) === false) {
        res.render('login', { errorMessage: 'Contraseña incorrecta' })
        return
      }

      //en caso de que todo lo anterior no se haya ejecutado, username y password son correctas.
      //usuario entra en la SESIÓN!!!! y nos redirige a la view 'profile' que tenemos que crear.

      req.session.currentUser = user      // Iniciar sesión = almacenar el usuario logueado en req.session.currentUser
      res.redirect('/main')
    })
    .catch(err => console.log(err))

}
)
//si el usuario clicka en disconnecta en navbar le redirigimos al inicio
router.get('/disconnect', (req, res) => {
  req.session.destroy(() => res.redirect('/'))
})

// MIDDLEWARE DETECTOR DE SESIÓN
// if req.session.currentuser === true , puede entrar en la ruta protegida, donde está profile.
//sino, error de autentificación.
router.use((req, res, next) => req.session.currentUser ? next() : res.render('login', { errorMessage: 'Desautorizado' }))


// RUTAS PROTEGIDAS
//añadimos la(s) ruta(s) en el enlace de navbar de profile a la view profile, solo se puede acceder aqui una vez hecho el login
router.get('/main', (req, res) => {
  const loggedUser = req.session.currentUser
  res.render('main', loggedUser)
})

router.get('/private', (req, res) => {
  const loggedUser = req.session.currentUser
  res.render('private', loggedUser)
})




module.exports = router;
