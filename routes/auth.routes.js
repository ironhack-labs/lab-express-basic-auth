const router = require("express").Router()
const bcryptjs = require('bcryptjs')

const User = require('./../models/User.model')
const saltRounds = 10



//REGISTRO  
router.get("/registro", (req, res, next) => res.render("auth/signup-form"))


router.post("/registro", (req, res, next) => {

 //info del modelo con la que tambien hago el formulario 
const { username, userPwd } = req.body

    bcryptjs  //   encripta la conreaseña en hash
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(userPwd, salt))
        .then(hashedPassword => {
            console.log('El hash a crear en la base d.d es', hashedPassword)
            return User.create({ username, passwordHash: hashedPassword})
                .then(createUser => res.redirect('/'))
                .catch(error => next(error))
        })
})



//INCIO DE SESION 

router.get("/inicio-sesion", (req, res, next) => res.render("auth/login-form"));

router.post("/inicio-sesion", (req, res, next) => {
  const { username, userPwd } = req.body;

  if (username.length === 0 || userPwd.length === 0) {
    res.render("auth/login-form", {
      errorMessage: "Por favor, rellena todos los campos"});
    return;
  }

    User
        .findOne({ username })
        .then(user => {

            if (!user) {
                res.render('auth/login-form', { errorMessage: 'Usuario no registrado en la Base de Datos' })
                return
            
              } else if (bcryptjs.compareSync(userPwd, user.passwordHash) === false) {
                res.render('auth/login-form', { errorMessage: 'La contraseña es incorrecta' })
                return
              } else {
                req.session.currentUser = user
              
                res.redirect('/perfil')
            }

        })
})


// cerrar sesion
router.post("/cerrar-sesion", (req, res) => {
  req.session.destroy(() => res.redirect("/inicio-sesion"));
});

module.exports = router;