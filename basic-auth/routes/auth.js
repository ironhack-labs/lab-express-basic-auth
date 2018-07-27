var express = require('express');
var router = express.Router();
var User = require('../models/user');

const bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
router.get('/login', function(req, res, next) {
    const data = {
        messages: req.flash('info')
    };
    res.render('auth/login', data);
    // res.render('auth/login', { title: 'Express' });
});
router.post('/login', function(req, res, next) {
    const data = {
        username: req.body.username,
        password: req.body.password
    }
    User.findOne({username: data.username})
    .then(user => {
        if(!user)
        {
            req.flash('info', 'user or password incorrect');
            res.redirect('login');
            // res.render('auth/login', {message: 'user or password incorrect'});
        }
        else
        {
            if(bcrypt.compareSync(data.password, user.password))
            {
                req.flash('info', 'Benvingut!');
                req.session.currentUser = user;
                res.redirect('/');
                // res.render('index', {title: "Benvingut!"});
            }
            else
            {
                req.flash('info', 'User or password incorrect');
                res.redirect('login');
                // res.render('auth/login', {message: 'user or password incorrect'});
            }
        }
    })
    .catch(error => {
        next(error);
    })
});
router.get('/signup', function(req, res, next) {
    res.render('auth/signup', { title: 'Express' });
});
router.post('/signup', function(req, res, next) {
    const data = {
        username: req.body.username, 
        password: bcrypt.hashSync(req.body.password, saltRounds)
    };
    if(!data.username || !data.password)
    {
        res.render('auth/signup', {message: 'fields cannot be empty'});
    }
    else
    {
        User.findOne({username: data.username})
        .then(user => {
            if(user)
            {
                res.render('auth/signup', {message: 'user already in use. Try again'});
            }
            else
            {
                User.create(data)
                .then(user => {
                    // res.render('', {message: 'user correctly created'});
                    res.redirect('/');
                })
                .catch(error => {
                    next(error);
                })
            }
        })
        .catch(error => {
            next(error);
        })
    }
    // res.render('auth/signup', { title: 'Express' });
});

module.exports = router;
