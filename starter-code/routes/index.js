var express = require('express');
var router = express.Router();

const User = require('../models/user');
const bcrypt = require('bcrypt');

router.get('/', (req,res,next) => {

  res.render('index', {
    header: 'Register a new secure user',
    action: '/',
    buttonText: 'Register',
    error: false})
})

router.post('/', function(req, res, next) {
    const username = req.body.username
    const password = req.body.password
    const saltRounds = 10


    User.findOne( {username: username}, function(err, userExists) {
      if (err) {return next(err)}

      if(!userExists) {
        bcrypt.hash(password, saltRounds, function(err, hash) {
          if (err) {
            return next(err)
          } else {
            const user = new User({username, hash})
            user.save(function(err, doc) {
                if (err) return next(err)
                res.render('index',{
                  header: 'Welcome '+username,
                  action: '/',
                  buttonText: 'Log Out',
                  error: false
                })
            });
          }
        });
      } else {
        res.render('index', {
          header: 'This username is already registered! '+username,
          action: '/',
          buttonText: 'Log Out',
          error: false
        })
      }
  })
})

/*      const isRegistered = User.findOne({'username': username})
      console.log(isRegistered);

        if (!isRegistered){

          bcrypt.hash(password, saltRounds, function(err, hash) {
              if (err) {return next(err)}
              else {

              const user = new User({username, hash})
              user.save(function(err, doc) {
                  if (err) return next(err)
                  res.render('index',{
                    header: 'Welcome '+username,
                    action: '/',
                    buttonText: 'Log Out',
                    error: false}
                          )
                        });}

  });
}
else{
res.render('index',{
header: 'This username is already registered! '+username,
action: '/',
buttonText: 'Log Out',
error: false})
}*/



router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/login', function(req, res, next) {
  res.render('login',{
  header: 'Log in ',
  action: '/',
  buttonText: 'Log in',
  error: false});
});


router.post('/login', function(req, res, next) {
  const username = req.body.username
  const password = req.body.password

  User.findOne({username: username}, function(err, user) {
    if (err) return next(err)

    const hash = user.hash

    bcrypt.compare(password, hash, function(err, isValid) {
      if (err) return next(err)

      if (!isValid) {
        res.render('index', {
          header: 'Login a new secure user',
          action: '/login',
          buttonText: 'Login',
          error: true
        });
      }
      else {
        req.session.currentUser = user
        res.render('main')
      }
    })
  })
});


router.get('/main', function(req, res, next) {
  if(req.session.currentUser){
  res.render('main',{message:'youre logged'})
});





module.exports = router;
