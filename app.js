require('dotenv').config();

const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');
const express       = require('express');
const favicon       = require('serve-favicon');
const hbs           = require('hbs');
const mongoose      = require('mongoose');
const logger        = require('morgan');
const path          = require('path');
const bcrypt        = require ("bcryptjs");
const dotenv        = require ("dotenv");
const session       = require ("express-session");
const MongoStore    = require ("connect-mongo")(session);

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

const User = require('./models/User.model.js')

// require database configuration
require('./configs/db.config');

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Basic Auth - Ironhack Lab';

const index = require('./routes/index.routes');
app.use('/', index);

//ROUTES

app.get('/sign-up', (req, res, next)=>{
    res.render('signUp')
})

app.post('/sign-up', (req, res, next)=>{
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
        res.render('logIn', {errorMessage: 'This user already exists. Do you want to Log In?'})
      }
    })
  })

app.get('/log-in', (req, res, next)=>{
    res.render('login')
})

app.post('/log-in', (req, res, next)=>{
  
    const {username, password} = req.body

    User.findOne({username: username})
    .then((result)=>{
        if(!result){
            res.redirect('/logIn', {errorMessage: 'User does not exist'})
        } else {
            bcrypt.compare(password, result.password)
            .then((resultFromBcrypt)=>{
                if(resultFromBcrypt){
                    req.session.currentUser = username
                    res.redirect('/')
                    // req.session.destroy
                } else {
                    res.render('logIn', {errorMessage:'Password incorrect.'})
                }
            })
        }
    })
})

module.exports = app;