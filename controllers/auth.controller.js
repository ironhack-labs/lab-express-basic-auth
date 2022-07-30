const mongoose = require('mongoose');
const User = require('../models/User.model');

//SIGN UP 
module.exports.signUp = (req, res, next) => {
    res.render('auth/sign-up');
};

//DO SIGN UP
module.exports.doSignUp = (req, res, next) => {
    const user = req.body;

    User.findOne({$or: [{ email: user.email }, { username: user.username}]})
    .then((userFound) => {
      if (userFound) {
        if (userFound.email === user.email && userFound.username === user.username) {
            res.render("auth/sign-up", {
                user,
                errors: {
                    emailExist: "This e-mail already exist",
                    usernameExist: "This user name already exist"
                }          
            });
        } 

        if(userFound.email === user.email){
            res.render("auth/sign-up", {
                user,
                errors: {
                    emailExist: "This e-mail already exist",
                }          
            });
        }

        if(userFound.username === user.username){
            res.render("auth/sign-up", {
                user,
                errors: {
                    usernameExist: "This user name already exist"
                }      
            });
        }            
        return;   
      } else {
        User.create(user)
        .then((user) => {
          res.render('users/profile', { user }); // Cuando tenga la ruta de profile hago un redirect
        });
        return;
      }
    })
    .catch((err) => {
      console.log("errors", err);
      res.render("auth/sign-up", {
        user,
        errors: err.errors,
      });
      next(err);
    });
}