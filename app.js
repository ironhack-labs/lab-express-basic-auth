require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');
const path = require('path');
const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);
const session = require('./configs/session.config');
const app = express();
const User = require('./models/User.model')

// require database configuration
require('./configs/db.config');

// Middleware Setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session);

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
/*app.locals.title = 'Express - Generated with IronGenerator';*/
app.locals.title = 'Express -- Basic Auth';

app.use((req, res, next) => {
    if(req.session.currentUserId) {
        User.findById(req.session.currentUserId)
            .then((user) => {
                if(user){
                    req.currentUser = user
                    res.locals.currentUser = user

                    next()
                }
            })
            .catch(e => next(e))
    }else{
        next()
    }
})

const index = require('./routes/index.routes');
const auth = require('./routes/auth.routes')
app.use('/', index);
app.use('/', auth)

module.exports = app;
