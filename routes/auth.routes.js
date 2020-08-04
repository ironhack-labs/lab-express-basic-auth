const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');

const UserModel = require('../models/User.model');

router.get('/signup',(req,res)=>{
    res.render('auth/signup.hbs');
});

router.get('/signin',(req,res)=>{
    res.render('auth/signin.hbs');
});

router.get('/logout',(req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/');
    })
})

router.post('/signup',(req,res)=>{
    const {username, password} = req.body;

  //Sever side Validations:
  if (!username || !password) {
    res.status(500).render('auth/signup.hbs',{errorMessage: 'Please enter all details'});
    return; //Stop the code of these post and return to the page
  }

  const passReg = new RegExp(/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/);
  if (!passReg.test(password)) {
    res.status(500).render('auth/signup.hbs',{errorMessage: 'Password must have 6 character and a number and a letter'});
    return; //Stop the code of these post and return to the page
  }
  bcryptjs.genSalt(10)
    .then((salt)=>{
        bcryptjs.hash(password, salt)
            .then((hashPass)=>{
                UserModel.create({username, passwordHash: hashPass})
                    .then(()=>{
                        res.redirect('/');
                    })
                    .catch((err)=>{
                        console.log(err);
                        res.render('error');
                    });
            })
    });

});

router.post('/signin',(req,res,next)=>{
    const {username, password} = req.body;

    //Sever side Validations:
    if (!username || !password) {
      res.status(500).render('auth/signup.hbs',{errorMessage: 'Please enter all details'});
      return; //Stop the code of these post and return to the page
    }
  
    const passReg = new RegExp(/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/);
    if (!passReg.test(password)) {
      res.status(500).render('auth/signup.hbs',{errorMessage: 'Password must have 6 character and a number and a letter'});
      return; //Stop the code of these post and return to the page
    }

    UserModel.findOne({username: username})
        .then((userData)=>{
            const doesItMatch = bcryptjs.compareSync(password, userData.passwordHash);
            if (doesItMatch) {
                req.session.loggedInUser = userData;
                res.redirect('/')
            }
            else { 
                res.status(500).render('auth/signin.hbs',{errorMessage: 'Incorrect password, please type again'});
                return; //Stop the code of these post and return to the page
            }
        })
        .catch(()=>{
            res.status(500).render('auth/signin.hbs',{errorMessage: 'Please insert a existing username or signUp'});
            return; //Stop the code of these post and return to the page
            
          });

});

  module.exports = router;