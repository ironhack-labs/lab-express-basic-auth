const express      = require('express');
const router       = express.Router();
const bcrypt       = require("bcryptjs");
const bcryptSalt   = 10;
const User         = require('../models/user');
const passport     = require('passport');
bcrypt
/* GET home page */
router.get('/login', (req, res, next) => {
  res.render('login', {message: req.flash('error')});
});

router.get('/signup', (req, res, next) => {
  res.render('signup', {message: req.flash('error')});
});

router.post('/signup', (req,res,next)=>{
  const theUsername = req.body.newUsername;
  const thePassword = req.body.newPassword;
  
  if(theUsername === "" || thePassword === ""){
    req.flash('error', 'please specify a username and password to sign up')
    res.render('signup', {errorMessage: req.flash('error')});
    return;
  }
  
  User.findOne({"username": theUsername})
  .then((user)=>{
    if(user !== null){
      res.render('signup', {errorMessage: "this user already exists"})
      return;
    }
    
    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(thePassword, salt);
   
    User.create({
      username : theUsername,
      password : hashPass
    })
    .then((response)=>{
      console.log("=-=-==-=-=-=-= PROFILE CREATED -=-=-=-=-=-=-=-=-=--")
      res.render('index')
    })
    .catch((err)=>{
      next(err)
    })
    
  })

  .catch((err)=>{
    next(err);
  })
  
});
  
// router.post('/login', (req,res,next)=>{
  
//   const un = req.body.theUsername;
//   const ps = req.body.thePassword;
//   console.log(un, ps, "0o0o0o0o0o0o0o0o0o0o0o")

//   if(un === "" || ps === ""){
//     res.render('login', {errorMessage: "invalid"})
//     return;
//   }
//   User.findOne({"username": un})
//   .then((theUser)=>{
//     if(!theUser){
//       // console.log("-=-=-=-=--=-=-=-=-=-=-=- NO USEr")
//       res.render('login', {errorMessage:"this username doesn't exist"})
//       return;
//     }
//     if (bcrypt.compareSync(ps, theUser.password)) {
//       req.session.currentUser = theUser;
//       res.render("secret");
//       console.log('=-=-=-=-=-==- Session Started')
//     } else {
//       res.render("login", {
//         errorMessage: "Incorrect password"
//       });
//     }
//   })
// })


router.post("/login", passport.authenticate('local', {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  successFlash: true,
  passReqToCallback: true
}));

router.get('/logout', (req, res, next)=>{
  req.logout()
res.redirect('/')
})

module.exports = router;
