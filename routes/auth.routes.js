const express= require('express')
const router= express.Router()
const bcryptjs= require('bcryptjs')
const mongoose = require('mongoose')
const saltRounds= 10;
const UserSchema= require('../models/User.model')


//GET DEL SIGNUP (nos lleva al formulario de registro )
router.get('/signup', (req, res, next) => {
    res.render("auth/signup")
})

//POST DEL SIGNUP (nos regresa la info del formulario de registro)
router.post('/signup', (req, res, next) => { 
//console.log(req.body)
const {username, password} = req.body

if( !username || !password){
    res.render('auth/signup', {errorMessage: "All fields are mandatory!"})
    return 
}

const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }

bcryptjs.genSalt(saltRounds)
.then((salt)=>{
    bcryptjs.hash(password, salt)
    .then((hashedPassword) => {
        //console.log(`Password hash: ${hashedPassword}`)
        return UserSchema.create({username, passwordHash: hashedPassword})
    })
    .then((userFromDB) => {
        console.log("Newly created user is:", userFromDB)
        res.redirect('/userProfile')
    })
    .catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
          res.status(500).render('auth/signup', { errorMessage: error.message });
        } else if (error.code === 11000) {
          res.status(500).render('auth/signup', {
             errorMessage: 'Username and email need to be unique. Either username or email is already used.'
          });
        } else {
          next(error);
        }
})
})
})

//GET del login (nos lleva al formulario para identificarse)
router.get('/login', (req, res, next)=> {
    res.render('auth/login')
})

//POST del login (nos da la info del formulario login. Manejamos esta info para saber si darle acceso o no a su perfil)
router.post('/login', (req, res, next) => {
    const { username, password } = req.body;
    //console.log('SESSION =====> ', req.session);
   
    if (username === '' || password === '') {
      res.render('auth/login', {
        errorMessage: 'Please enter both, username and password to login.'
      });
      return;
    }
   
    UserSchema.findOne({ username })
      .then(userFound => {
        if (!userFound) {
          res.render('auth/login', { errorMessage: 'This username is not registered.'});
          return;
        } else if (bcryptjs.compareSync(password, userFound.passwordHash)) {
            req.session.currentUser = userFound; 
            res.redirect('/userProfile');
        } else {
          res.render('auth/login', { errorMessage: 'Incorrect password.' });
        }
      })
      .catch(error => next(error));
  });

//RUTA GET DE PROFILE (nos lleva la perfil de cada usuario)
 router.get('/userProfile', (req, res) => {
   res.render('users/user-profile', { 
       userInSessionCookie: req.session.currentUser });
 });


//RUTA POST DE LOGOUT, (nos saca de sesión y nos lleva a index, responde a la forma (que parece botón) de logout)
router.post('/logout', (req, res, next) => {
    req.session.destroy()
    res.redirect('/')
  })


module.exports= router;