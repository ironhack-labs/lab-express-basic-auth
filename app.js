require('dotenv').config();

const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const User = require('./models/User.model');
const bcrypt = require('bcrypt');

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Require Database Configuration
require('./configs/db.config');


// Session Configuration
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Middleware Setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use (
    session ({
        secret: process.env.SESSION_SECRET,
        cookie: {maxAge: 1000 * 60 * 60 * 24},
        saveUninitialized: false,
        resave: true,
        store: MongoStore.create({
            mongoUrl: mongoose.connection
        })
    })
);

const loginCheck = () => {
    return (req, res, next) => {
        if(req.session.user) {
            next();
        } else {
            res.redirect("/login")
        }
    }
}

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// Default Value for Title Local
app.locals.title = 'Express - Generated with IronGenerator';

const index = require('./routes/index.routes');
const router = require('./routes/index.routes');
const { route } = require('./routes/index.routes');
const { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } = require('constants');
app.use('/', index);


// Routes

// Get Sign Up Page
router.get("/signup", (req, res, next) => {
    res.render("signup");
});

// Get Log In Page
router.get("/login", (req, res, next) => {
    res.render("login");
});

router.post("/login", (req, res, next) => {
    const {username, password} = req.body;
    User.findOne({username: username})
    .then(userFromDB => {
        if(userFromDB === null) {
            res.render("login", {message: "Invalid Credentials"});
            return;
        }
        if(bcrypt.compareSync(password, userFromDB.password)) {
            req.session.user = userFromDB;
            res.redirect("/profile");
            return;
        }
    })
})

router.get("/profile", loginCheck(), (req, res, next) => {
    res.render("profile");
})

// Where Sign Up Info Gets Posted
router.post("/signup", (req, res, next) => {
    const {username, password} = req.body;
    console.log({username, password});

    if(password.length < 8) {
        res.render("signup", {message: "Password must be at least 8 characters"});
        return;
    }

    if(username === "") {
        res.render("signup", {message: "Username field cannot be empty"})
        return;
    }

    User.findOne({username: username})
    .then(userFromDB => {
        if(userFromDB !== null) {
            res.render("signup", {message: "Username is not available"})
        } else {
            const salt = bcrypt.genSaltSync();
            const hash = bcrypt.hashSync(password, salt);
            console.log(hash);
            User.create({username: username, password: hash})
            .then(createdUser =>{
                console.log(createdUser);
                req.session.user = createdUser;
            })
        }
    })
})

router.get("/logout", (req, res, next) => {
    req.session.destroy(error => {
        if(error){
            next(error);
        } else {
            res.redirect("/");
        }
    })
})

module.exports = mongoose;
module.exports = app;
