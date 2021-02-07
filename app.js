require('dotenv').config();


const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const session = require('./configs/session.config')

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// require database configuration
require('./configs/db.config');

// Middleware Setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session)

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + "/views/partials");
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Ironhack lab';

//Middleware to use my user information on profile page

app.use((req,res,next) => {
    if(req.session.currentUserId){
        User.findById(req.session.currentUserId)
            .then((user) => {
                if(user){
                    //req.currentUser = user
                    res.locals.currentUser = user //To access the content on any view
                    next()
                }
                else{
                    next()
                }
            })
            .catch(e => next(e))
    }
})
const index = require('./routes/routes');
const User = require('./models/user.model');
app.use('/', index);

module.exports = app;
