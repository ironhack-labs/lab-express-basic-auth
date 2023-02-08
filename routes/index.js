const router = require("express").Router();
const User = require("../models/User.model")
const bcrypt = require("bcryptjs")
const { isLoggedIn } = require("../middleware/route-guard")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//accion del formulario me dirige a "signup" page
router.get("/auth/signup", (req, res, next) => {
  res.render("signup")
})

//tomo los datos del formulario y los almaceno en variables
router.post("/auth/signup", (req, res, next) => {
  const { username, password } = req.body

  if (username === "") {
    res.render("signup", { message: "Username cannot be empty" })
    return
  }
      
      //comparo si el user existe actualmente en la base de datos 
        User.findOne({ username })
          .then(userFromDB => {
            console.log(userFromDB)

            if (userFromDB !== null) {
              res.render("signup", { message: "Username is already taken" })
            } else {
              // si el user está disponible paso a crear la contraseña
              
                const salt = bcrypt.genSaltSync()
                const hash = bcrypt.hashSync(password, salt) //password es variable creada anteriormente
                console.log(hash)
      
               // Create user
                User.create({ username: username, password: hash })
                  .then(createdUser => {
                    console.log(createdUser)
                    res.redirect("/auth/login")
                  })
                  .catch(err => {
                    next(err)
                  })
                }
      })
})

//accion crea ruta a login
router.get("/auth/login", (req, res, next) => {
  res.render("login")
})


router.post("/auth/login", (req, res, next) => {
  const { username, password } = req.body

  // busca si matchea en la database
  User.findOne({ username })
    .then(userFromDB => {
      if (userFromDB === null) {
        // si no matchea, te manda a loguear de nuevo, y la corta con return
        res.render("login", { message: "Wrong credentials" })
        return
      }

      //si matchea, compara las passguarddd
      if (bcrypt.compareSync(password, userFromDB.password)) {
        // si la pass es correacta, loguea
        // ahora le tengo que crear una sesión
        req.session.user = userFromDB
        res.redirect("/main")
      } else {
        res.render("login", { message: "Wrong credentials" })
        return
      }
    })
})



//ruta
router.get("/main", isLoggedIn, (req, res, next) => {
  
  const user = req.session.user
  res.render("main", { user: user })

})


router.get("/private", isLoggedIn, (req, res, next) => {
  
  const user = req.session.user
  res.render("private", { user: user })

})

router.get("/auth/logout", (req, res, next) => {
  // Logout user
  req.session.destroy()
  res.redirect("/")
})


module.exports = router;
