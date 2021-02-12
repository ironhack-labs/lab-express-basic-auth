const express = require('express');
const router = express.Router();
const UserSchema= require('../models/User.model')
const bcryptjs= require('bcryptjs')

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));


//GET to acces main
router.get('/main', (req, res, next)=>{
    req.session.currentUser = user; 
    UserSchema.findOne({ user })
      .then(userFound => {
        if (!userFound) {
          res.render('main', { errorMessage: 'This username is not registered.'});
          return;
        } else if (bcryptjs.compareSync(password, userFound.passwordHash)) {
            //req.session.currentUser = userFound; //este es necessario con el de arriba?
            res.redirect('/main');
        } else {
          res.render('main', { errorMessage: 'Incorrect password.' });
        }
      })
      .catch(error => next(error));
})


//GET to acces private
router.get('/private', (req, res, next)=>{
    req.session.currentUser = user; 
    UserSchema.findOne({ user })
      .then(userFound => {
        if (!userFound) {
          res.render('private', { errorMessage: 'This username is not registered.'});
          return;
        } else if (bcryptjs.compareSync(password, userFound.passwordHash)) {
            //req.session.currentUser = userFound; //este es necessario con el de arriba?
            res.redirect('/private');
        } else {
          res.render('private', { errorMessage: 'Incorrect password.' });
        }
      })
      .catch(error => next(error));
})




module.exports = router;
