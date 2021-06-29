const router = require("express").Router();
const bcrypt = require("bcryptjs")
const UserModel = require('../../models/User.model')
// const authmids = require('./auth.mids')
//Auth Routes

router.get("/", (req, res, next) => {
  res.render("index");
});

//SIGN IN & SIGN UP GET REQUESTS

router.get('/signup',(req,res,next) => {
    res.render('auth/signup.hbs')
})

router.get('/signin', (req,res,next) => {
    res.render('auth/signin.hbs')
})

//SIGN IN & SIGN UP POST REQUESTS
function hashIt(password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash
}

router.post('/signup',(req,res,next) => {
    const {username, password} = req.body
    UserModel.create({username, password: hashIt(password)})
    .then((result) => {
        res.redirect('/')
    }).catch((err) => {
        next(err)
    });
})

router.post('/signin', (req, res, next) => {
  const {username, password} = req.body
  UserModel.findOne({username})
      .then((user) => {
         if (user) {
            let isValid = bcrypt.compareSync(password, user.password);
            if (isValid) {
                req.session.loggedInUser = user
                req.app.locals.isLoggedIn = true;
                res.redirect('/main')
            }  
            else {
                res.render('auth/signin', {error: 'Invalid password'})
            }  
         } 
         else {
           res.render('auth/signin', {error: 'Email does not exists'})
         }
      })
      .catch((err) => {
          next(err)
      })      
})

function checkLoggedIn(req, res, next){
    if (req.session.loggedInUser) {
        next()
    }
    else {
        res.redirect('/signin')
    }
}
// Protected Routes

router.get('/main', checkLoggedIn,(req,res,next) => {
    res.render('auth/main.hbs')
})

router.get('/private', checkLoggedIn, (req,res,next) => {
    res.render('auth/private.hbs')
    console.log(req.app.locals.isLoggedIn)
})

module.exports = router;
