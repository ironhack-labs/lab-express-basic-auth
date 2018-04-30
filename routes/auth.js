const express = require('express');
const router  = express.Router();
const bcrypt = require("bcrypt");
const User = require ('../models/user');
const bcryptSalt = 10;
/* GET home page */
router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req,res,next)=>{
  const salt = bcrypt.genSaltSync(bcryptSalt);
  req.body.password = bcrypt.hashSync(req.body.password, salt);

  User.create(req.body)
  .then(()=>res.redirect("/login"))

})
router.get("/login",(req, res, next)=>{
  if (req.session.currentUser) return res.send("Logueado logueado")
  res.render ("login")
})

router.post ("/login", (req, res, next)=>{
  User.findOne({name: req.body.name})
  .then(user =>{
   if (bcrypt.compareSync(req.body.password, user.password)){
    req.session.currentUser = user;
    return  res.send(`Bienvenido ${req.body.name}`)
   }
   res.send("Tu contraseña es incorrecta")
  })
 .catch(e=>{console.log (e)})
})
router.get("/main",(req, res, next)=>{
  if (req.session.currentUser) {
  return res.render ("main")
  }else{
    return res.redirect ("login")
  }
})
router.get("/private", (req, res, next)=>{
  if (req.session.currentUser) {
    return res.render ("private")
    }else{
      return res.redirect ("login")
    }  
})

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});




module.exports = router;
