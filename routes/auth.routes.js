// require('dotenv').config();

// const bodyParser    = require('body-parser');
// const cookieParser  = require('cookie-parser');
// const favicon       = require('serve-favicon');
// const hbs           = require('hbs');
// const mongoose      = require('mongoose');
// const logger        = require('morgan');
// const path          = require('path');
// const dotenv        = require ("dotenv");

// const session       = require ("express-session");
// const MongoStore    = require ("connect-mongo")(session);

// const app_name = require('./package.json').name;
// const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

//VARIABLES

const express   = require('express');
const router    = express.Router();
const User      = require('../models/User.model')
const bcrypt    = require ("bcryptjs");

//ROUTES

router.get('/sign-up', (req, res, next)=>{
    res.render('signUp')
})

router.post('/sign-up', (req, res, next)=>{
    const {username, password} = req.body
    User.findOne({username: username})
    .then((result)=>{
      if(!result){
        bcrypt.genSalt(10)
        .then((salt)=>{
          bcrypt.hash(password, salt)
          .then((hashedPassword)=>{
            const hashedUser = {username: username, password: hashedPassword}
            User.create(hashedUser)
            .then((result)=>{
              res.redirect('/')
            })
          })
        })
        .catch((err)=>{
          res.send(err)
        })
      } else {
        res.render('login', {errorMessage: 'This user already exists. Do you want to Log In?'})
      }
    })
  })

router.get('/log-in', (req, res, next)=>{
    res.render('login')
})

router.post('/log-in', (req, res, next)=>{
  
    const username = req.body.username
    const password = req.body.password

    User.findOne({"username": username})
    .then((result)=>{
        if(!result){
            res.redirect('/log-in', {errorMessage: 'User does not exist'})
        } else {
            bcrypt.compare(password, result.password)
            .then((resultFromBcrypt)=>{
                if(resultFromBcrypt){
                    req.session.currentUser = username
                    res.redirect('/')
                } else {
                    res.render('login', {errorMessage:'Password incorrect.'})
                }
            })
        }
    })
})

//MIDDLEWAR

router.use((req, res, next) => {
  if (req.session.currentUser) { 
    next()
  } else {                         
    res.redirect("/log-in")     
  }                                 
})

// PRIVATE ROUTES

router.get('/main', (req, res, next)=>{
  res.render('main')
})

router.get('/private', (req, res, next)=>{
  res.render('private')
})

module.exports = router