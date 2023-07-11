
const {Router} = require ('express');
const router = new Router();

const mongoose = require ('mongoose');
const bcryptjs = require('bcryptjs');
const saltRounds =10;

const User = require ('../models/User.model');
const {isLoggedIn} = require('../middleware/route-guard')

//Signup

router.get('/signup', (req,res) => {
    console.log('req.session', req.session)
    if(req.session.currentUser){
        res.render ('./auth/signup', {loggedIn: true})
    }
    else{
        res.render('./auth/signup')
    }
});

router.post('/signup', (req,res,next) => {

    const {username, email, password} = req.body;

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password,salt))
        .then(hashedPassword => {
            return User.create({
                username,
                email,
                password: hashedPassword
            });
        })
        .then(() => {
            res.redirect ("/profile");
        })
        .catch(error => next(error));
});

//Signup (END)


//Profile

router.get("/profile", isLoggedIn, (req, res) => {
    if(req.session.currentUser){
        res.render("user/profile", { userInSession: req.session.currentUser, loggedIn: true});
    }
    else{
        res.render('user/profile')
    }
  });
  
//Profile (END)


//Login
router.get('/login', (req, res) => {
    if(req.session.currentUser){
        res.render ('./auth/login', {loggedIn: true})
    }
    else{
        res.render('./auth/login')
    }
});

router.post('/login', (req, res, next) => {
    console.log('SESSION =====> ', req.session);
    const {username, password} = req.body;

    if(username === '' || password === '') {
        res.render('./auth/login', {
            errorMessage: 'Please enter both, username and password to login.'
        });
        return;
    }

    User.findOne ({username})
        .then(user => {
        
            if (!user){
                res.render('./auth/login', { errorMessage: 'Username is not registered. Try with other username.' });
                return;
            }
            else if (bcryptjs.compareSync(password, user.password)) {
                req.session.currentUser = user;
                user.loggedIn = true;
                res.redirect('/profile');
              } else {
                res.render('./auth/login', { errorMessage: 'Incorrect password.' });
              }
        })
        .catch(error => next(error));
});

//Login (END)


//Logout 

router.post('/logout', isLoggedIn, (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

//Login (END)


module.exports = router;