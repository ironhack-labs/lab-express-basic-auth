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
    // console.log("USER",user);
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
    // console.log("USER",user);
    let newUser = User.create({
          "name": name,
          "email": email,
          "password": hashpwd

        }).then(ele=>{
          console.log(name);
          res.render("auth/profile",{name});
        });
  }
})





router.get("/login", (req, res) => {
  res.render("auth/login")
})




// routes/auth.routes.js
// ... nothing gets changed except addition of the following line
// to the .post('/login') route

// routes/auth.routes.js
// ... imports and both signup routes stay untouched

//////////// L O G I N ///////////

// .get() login route stays unchanged

// .post() login route ==> to process form data
router.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }

  User.findOne({ email })
    .then(user => {
      if (!user) {
        res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
        return;
      } else if (bcrypt.compareSync(password,  user.password)) {
        res.render('auth/profile', { user });
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});


router.get("/profile", (req, res) => {
  res.render("auth/profile", {
    user: req.session.currentUser
  })
})

// router.use((req, res, next) => {
//    if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
//      next(); // ==> go to the next route ---
//    } else {                          //    |
//      res.redirect("/login");         //    |
//    }                                 //    |
//  }); // ------------------------------------
 //     |
 //     V
 router.get("/private", (req, res, next) => {
   res.render("private");
 });

 router.get("/main", (req, res, next) => {
   res.render("main");
 });


 module.exports = router;

module.exports = router
