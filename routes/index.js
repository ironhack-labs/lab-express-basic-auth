const router = require("express").Router()
const bcrypt = require("bcrypt")
const User = require("../models/User.model")




/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


router.get("/registrarse", (req, res, next) => {
  res.render("signup")
});

router.post("/registrarse", (req, res)=>{
  const { username, pwd } = req.body

  if (pwd.length === 0) {       // Si la contraseña está vacía
    res.render('signup', { errorMsg: 'La contraseña es obligatoria' })
    return
  }

  User
  .findOne({username})
  .then(user => {

    if (user) {                   // Si el nombre de usuario ya existe
      res.render('signup', { errorMsg: 'Usuario ya registrado' })
      return
    }

    const bcryptSalt = 10
    const salt = bcrypt.genSaltSync( bcryptSalt )
    const hashPass = bcrypt.hashSync( pwd, salt )     // Contraseña hasheada

    User
      .create({ username, password: hashPass })         // <== !!!
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))

  })
  .catch(err => console.log(err))

});

router.get('/inicio', (req,res)=> {
  res.render("loginup")
})


router.post('/inicio', (req,res)=>{

  const { username, pwd } = req.body

  if (pwd.length === 0 || username.length === 0){
    res.render("loginup" ,{errorMsg:'rellena los campos'})
    return
  }

  User
  .findOne({username})
  .then(user => {

    if (!user) {
      res.render('loginup', { errorMsg: 'Usuario no reconocido' })
      return
    }

    if (bcrypt.compareSync(pwd, user.password) === false) {
      res.render('loginup', { errorMsg: 'Contraseña incorrecta' })
      return
    }

    req.session.currentUser = user
    
    res.redirect('/perfil')

  })
  .catch(err => console.log(err))

})

//mmiddlewares
router.use((req, res, next) => {
  req.session.currentUser ? next() : res.render('loginup', { errorMsg: 'Desautorizado' })
})

router.get("/perfil", (req, res) => {

  res.render("userdata", {user: req.session.currentUser})

});

router.get('/gato', (req,res)=> {
  res.render("main")
})

router.get('/gifgato', (req,res)=> {
  res.render("private")
})




module.exports = router;

