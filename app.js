require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const session = require("express-session");

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

hbs.registerPartials(__dirname + "/views/partials");

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

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
app.locals.title = 'Express - Generated with IronGenerator';


const index = require('./routes/index.routes');
app.use('/', index);
app.use("/", require("./routes/users/signup"));
app.use("/", require("./routes/users/login"));
app.use("/", require("./routes/users/logout"));

// Middleware to access only secured routes when logged in: all the routes after that are secured
app.use((req, res, next)=>{
    if(req.session.user){
        next();
    } else {
        res.redirect("/login");
    }
})

app.use("/", require("./routes/main"));
app.use("/", require("./routes/private"));

module.exports = app;


app.listen(3000, ()=> {
    console.log("Webserver is listening", 3000);
})