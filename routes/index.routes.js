const express     = require('express');
const User        = require('../models/User.model');
const router      = express.Router();
const bcrypt      = require('bcrypt')
const session     = require('express-session')
const MongoStore  = require('connect-mongo')(session)
const mongoose    = require('mongoose')

//----CONFIG SESSION----//
router.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 60000 },
  saveUninitialized: true,
  resave: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

//----RUTAS SIGN UP----//
router.get('/sign-up', (req,res,next)=>{
  res.render('singUp')
})

router.post('/sign-up',(req,res,next)=>{
  const {email, password} = req.body
  User.findOne({email: email})
    .then((result)=>{
      if(!result){
        bcrypt.genSalt(10)
          .then((salt)=>{
            bcrypt.hash(password, salt)
              .then((hashedPassword)=>{
                const hashedUser = {email, password: hashedPassword}
                User.create(hashedUser)
                  .then((result)=>{
                  res.redirect('/')
                  })
              })
          })
      }else{
        res.render('/log-in', {errorMessage: 'El usuario ya existe. Haga Log In por favor'})
      }
    })
    .catch((err)=>{
      console.log(err)
    })
})

//----RUTAS LOG IN----//
router.get('/log-in', (req,res,next)=>{
  res.render('logIn')
})

router.post('/log-in', (req,res,send)=>{
  const {email, password} = req.body

  User.findOne({email: email})
  .then((result)=>{
    if(result){
      bcrypt.compare(password, result.password)
      .then((resultFromBcrypt)=>{
        if(resultFromBcrypt){
          req.session.currentUser = email
          console.log(req.session)
          res.redirect('/')
        }else {
          res.render('logIn', {errorMessage: 'Email or password incorrect. Try again.'})
        }
      })
    }else {
      res.render('logIn', {errorMessage: 'Email or password incorrect. Try again.'})
    }
  })
  .catch((err)=>{
    console.log(err)
  })
})

module.exports = router;