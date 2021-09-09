const router = require("express").Router();
module.exports = router;
const Model = require("../models/User.model")
const bcryptjs = require('bcryptjs');
const User = require("../models/User.model");
const saltRounds = 10;

const {isLoggedIn, isLoggedOut} = require('../middleware/route-guard.js')

router.get('/signup', (req, res, next) => {res.render('user/signup')})

router.post('/signup', (req,res,next)=>{
    const {username, password} = req.body

    bcryptjs
    .genSalt(saltRounds)
    .then(salt=>bcryptjs.hash(password, salt))
    .then(hashP => {
        console.log('hashedPassword is:', hashP)
        return User.create({username, password: hashP})
        
    
    })
    .then(data =>{console.log('A new user has been created:', data)
            res.redirect('/')})
    .catch(error => next(error));

})

router.get('/login',(req,res)=>{res.render('user/login')})

router.post('/user-page',(req,res,next)=>{

    console.log('SESSION =====> ', req.session);
    const {username, password} = req.body

    /* if(username === '' || password === '') {
        res.render('user/login')
    } */
    console.log('the username is:',password)
    User.findOne({username})
        .then(data => {
            if(bcryptjs.compareSync(password, data.password)){
                console.log(data)
                
                req.session.currentUser = data;
                res.render('user/user-page',{data})

            }
        })
        .catch(error => next(error));
})

router.get('/main',(req, res)=>{res.render('user/main')})

router.get('/private', isLoggedIn,(req, res)=>{res.render('user/private')})



