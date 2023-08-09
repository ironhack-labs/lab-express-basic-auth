const {Router} = require('express');
const router = new Router();

const User = require('../models/User.model');

const bcrypt = require('bcryptjs');
const saltRounds = 10;

//const {isLoggedIn, isLoggedOut} = require('../middleware/route-guard.js');

/* SIGNUP */
router.get('/signup', (req, res, next) =>{
    res.render('signup');
})

router.post('/signup', async (req, res, next) =>{
    try {
        const {username, password} = req.body;
        let salt = await bcrypt.genSalt(saltRounds);
        let hashedPassword = await bcrypt.hash(password, salt);
        await User.create({username, password: hashedPassword})
        res.redirect('/')
    }
    catch(error){
        console.log('Error during Sign Up: ', error);
    }
})
/* LOGIN */
router.get('/', (req, res) => {
    res.render('/')
})

router.post('/', async (req, res, next) => {
    try {
        const {username, password} = req.body;
        let thisUser = await User.findOne({username});
        if (!thisUser){
            res.render('/')
            console.log('User not found')
        } else if (bcrypt.compareSync(password, thisUser.password)) {
            // req.session.currentUser = thisUser;
            res.redirect('/profile')
        } else {
            res.render('/')
            console.log('Incorrect password');
        }
    }
    catch(error){
        console.log('Error during Login: ', error);
    }
})

/* LOGOUT */
router.post('/logout', (req,res,next)=>{
    req.session.destroy(err=>{
        if(err){
            next(err);
        }
        res.redirect('/');
    })
});

/* USER PROFILE */
router.get('/profile', (req, res) =>{
    res.render('user-profile');
})

module.exports = router; 