const router = require("express").Router();
const User = require("../models/User.model")
const bcrypt = require("bcrypt")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res, next) => res.render("signup"));

router.post("/signup", (req, res) => {

  const { username, password } = req.body

  //Comprobamos si existe el usuario
  User.find({ username })
    .then(user => {
      //Si ya existe devolvemos error
      if (user.length) {
        res.render("signup", { errorMessage: "Usuario ya existente." })
      } else {

        //Si no generamos el salt...
        const bcryptSalt = 10
        const salt = bcrypt.genSaltSync(bcryptSalt)
        //Y encriptamos la contraseña
        const hashPass = bcrypt.hashSync(password, salt)


        User.create({ username, password: hashPass })
        .then(createdUser => res.redirect("login"))
        .catch(err => console.log(err))
      }

    })

})
router.get("/login", (req, res, next) => res.render("login"));

router.post("/login", (req, res) => {

  const { username, password } = req.body

  //Buscamos si existe el usuario
  User.findOne({ username })
    .then(user => {

      //Si el usuario no existe enviamos error
      if (!user) {
        res.render('login', { errorMessage: 'Usuario no reconocido' })
        return
      }

      //Si la contraseña no coincide con el hash enviamos error
      if (bcrypt.compareSync(password, user.password) === false) {
        res.render('login', { errorMessage: 'Contraseña incorrecta' })
        return
      }

      //5. Enganchar el objeto de usuario al req.session
      req.session.currentUser = user
      res.redirect("/profile")
    })
    .catch(err => console.log(err))
})

// MIDDLEWARE DETECTOR DE SESIÓN
router.use((req, res ) => {
  console.log(req.session)
  req.session.currentUser ? next() : res.render('login', { errorMessage: 'Necesitas estar logeado para ver esta página' })
})

//RUTAS PROTEGIDAS
router.get("/profile", (req, res) => {
  res.render("profile", req.session.currentUser)
})

module.exports = router;
