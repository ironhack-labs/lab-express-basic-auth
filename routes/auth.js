const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs')
const User = require('../models/User.model');

router.get('/login', (req,res) => res.render('auth/login'))

router.post('/login', (req,res,next ) => {
    const { username, password } = req.body;
    User.findOne({ username })
    .then(user => {
      if (user === null) {
        res.render('auth/login', { err: 'err' })
      }
      
      if (bcryptjs.compareSync(password, user.password)) {
       
        req.session.user = user;
        res.redirect('/private');
      } else {
        res.render('auth/login', { err: 'err' })
      }
    })
});



router.get('/signup', (req, res) => 
    res.render('auth/signup')
);

router.post('/signup', (req,res,next) => {
    const {username, password} = req.body
    User.findOne({username:username})
    .then(db => {
      if(db) {
          res.render('auth/signup', {err:'There is a user in this name!'})
    
      } else {

        bcryptjs.genSalt()
        .then(salt => bcryptjs.hash(password,salt))
        .then(hashedPass => 
        User.create({username:username, password:hashedPass})
         .then(user => {
            req.session.user = user
            res.redirect('/private')} ) 
         .catch(err => next(err))
    )


      }


    
    })
    .catch(err => next(err))   
    
   
         
})

const loginCheck = () => {
    return (req, res, next) => {
    
      if (req.session.user) {
        next();
      } else {
        
        res.redirect('auth/login');
      }
    }
  }

router.get('/private',loginCheck(), (req, res,next) => res.render('users/private'));
router.get('/private',loginCheck(), (req, res,next) => res.render('users/main'));

router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      next(err);
    } else {
      res.redirect('/login')
    }
  })
});


module.exports = router;