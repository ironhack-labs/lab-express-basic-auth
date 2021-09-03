const router = require("express").Router();
const User = require("./../models/User.model");
const bcrypt = require("bcrypt");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/sign-in", (req, res) => {
  res.render("sign-in");
});

router.post("/sign-in", (req, res) => {
  //console.log(req.body)
  const { user, pwd } = req.body;

  if (pwd.length === 0) {
    // Si la contraseña está vacía
    res.render("sign-in", { errorMsg: "La contraseña es obligatoria" });
    return;
  }

  if (user.length === 0) {
    // Si la contraseña está vacía
    res.render("sign-in", { errorMsg: "El campo usuario es obligatoriol" });
    return;
  }

  User.findOne({ user })
    .then((username) => {
      if (username) {
        // Si el nombre de usuario ya existe
        res.render("sign-in", { errorMsg: "Usuario ya registrado" });
        return;
      }

      const bcryptSalt = 10;
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(pwd, salt); // Contraseña hasheada

      User.create({ user, password: hashPass }) // <== !!!
        .then(() => res.redirect("/"))
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

router.get("/log-in", (req, res) => {
  res.render("log-in");
});

router.post("/log-in", (req, res) => {
  const { user, pwd } = req.body;

  if (pwd.length === 0) {
    // Si la contraseña está vacía
    res.render("sign-in", { errorMsg: "La contraseña es obligatoria" });
    return;
  }

  if (user.length === 0) {
    // Si la contraseña está vacía
    res.render("sign-in", { errorMsg: "El campo usuario es obligatoriol" });
    return;
  }

 User.findOne({ user })
      .then((username) => {
        if (!username) {
          res.render("log-in", { errorMsg: "Usuario no reconocido" });
          return;
        }
        if (bcrypt.compareSync(pwd, username.password) === false) {
          res.render("log-in", { errorMsg: "Contraseña incorrecta" });
          return;
        }
        req.session.currentUser = username;
        res.redirect("/perfil");
      })
      .catch((err) => console.log(err));
  
});

router.get('/perfil',(req,res)=>{
  res.render('perfil')

})

// MIDDLEWARE DETECTOR DE SESIÓN
router.use((req, res, next) => {  req.session.currentUser ? next() : res.render('log-in', { errorMsg: 'Desautorizado' })})


router.get('/perfil', (req, res) => {  res.render('perfil', { user: req.session.currentUser })})


module.exports = router;
