const express = require('express');
const User = require('../models/User.model');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const session    = require('express-session');
const MongoStore = require('connect-mongo')(session);

// Session config:
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

router.get('/sign-up', (req, res, next)=>{
    res.render('signUp');
});

router.post('/sign-up', (req, res, next)=>{
    const {email, password} = req.body;
    User.findOne({email: email})
        .then((result)=>{
            if(!result){
                bcrypt.genSalt(10)
                    .then((salt)=>{
                        bcrypt.hash(password, salt)
                            .then((hashedPass)=>{
                                const hashedUser = {email: email, password: hashedPass};
                                User.create(hashedUser)
                                    .then((result)=>{
                                        res.render('index', {successMessage: 'The user has been succesfully created! May the force be with you.'});
                                    });
                            });
                    });
            } else {
                res.render('logIn', {errorMessage: 'El usuario ya existe. Quieres hacer log in?'});
            }
        })
        .catch((err)=>{
            res.send(err);
            console.log(err);
        });
});

router.get('/log-in', (req, res, next)=>{
    res.render('logIn');
});

router.post('/log-in', (req, res, next)=>{
    const {email, password} = req.body;
    User.findOne({email: email})
        .then((result)=>{
            if(result){
                bcrypt.compare(password, result.password)
                    .then((resultCompare)=>{
                        if (resultCompare) {
                            req.session.currentUser = email;
                            res.render('index', {successMessage: 'You are already log in. Enjoy!'})
                        } else {
                            res.render('logIn', {errorMessage: 'Incorrect email or password!'});
                        }
                    })
            } else {
                res.render('logIn', {errorMessage: 'Incorrect email or password!'});
            }
        })
        .catch((err)=>{
            res.send(err);
            console.log(err);
        })
});

module.exports = router;
