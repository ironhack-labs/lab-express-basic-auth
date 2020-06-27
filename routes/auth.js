const express = require("express");
const router = express.Router();

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});
router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.get("/main", (req, res, next) => {
  res.render("protected/main");
});
router.get("/private", (req, res, next) => {
  res.render("protected/private");
});

// User model
const User = require("../models/User.model");

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username.length === 0 || password.length === 0) {
    res.render("auth/signup", { errorMsg: "Rellena los campos" });
    return;
  }

  if (password.length < 2) {
    res.render("auth/signup", { errorMsg: "La contraseña es corta" });
    return;
  }

  User.create({ username, password: hashPass })

    .then(() => {
      res.redirect("/login");
    })
    .catch((error) => {
      console.log(error);
    });

  User.findOne({
    username: theUsername,
  })
    .then((theUser) => {
      if (!theUser) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist.",
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, theUser.password)) {
        req.session.currentUser = theUser;
        console.log('El usuario con sesión inciada es:', req.session.currentUser)
        res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password",
        })
        return
      }
    })
    
    .catch((error) => {
      next(error);
    });
});
router.post("/login", (req, res, next) => {
const theUsername=req.body.username 
const thePassword=req.body.password

if(theUsername ==="" || thePassword ===""){
res.render('auth/login',{errorMessage:'Fuck'})
return

}
User.findOne({'username':theUsername})
.then(user =>{
    if(!user){
        res.render('auth/login',{errorMessage:'El usuario no existe'})
        return
    }

if(bcrypt.compareSync(thePassword,user.password)){
    req.session.currentUser=user
    res.redirect('/')
    
 } else{
        res.render('auth/login',{errorMessage:'Incorrect Password'})
    }
    
})
.catch(error=> (next(error)))
})
module.exports = router;
