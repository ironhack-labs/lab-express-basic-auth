const mongoose = require('mongoose');
const User = require('../models/User.model');

module.exports.register = (req, res, next) => {
    res.render('auth/register');
}

module.exports.doRegister = (req, res, next) => {
    const user = {name, email, password} = req.body;

    const renderWithErrors = (errors) => {
        res.render('auth/register', {
            errors: errors,
            user: user,
        })
    }

    User.findOne({email: email})
        .then((userFound) => {
            if (userFound) {
                renderWithErrors({ email: 'Email already in use!' });
            } else {
                return User.create(user).then(() => res.redirect('/login'))
            }
        })
        .catch(err => {
            if (err instanceof mongoose.Error.ValidationError) {
                renderWithErrors(err.errors);
            } else {
                next(err);
            }
    })
}   

module.exports.login = (req, res, next) => {
    res.render('auth/login');
}


module.exports.doLogin = (req, res, next) => {
    const {email, password} = req.body;

    const renderWithErrors = () => {
        res.render('auth/login', { 
        errors: { email: 'Invalid email or password'},
        user: req.body    
    })
}
  
    User.findOne({ email: email})
      .then((userFound) => {
        if (!userFound) {
         renderWithErrors();
        } else {
            return userFound.checkPassword(password)
                .then((match) => {
                    if (!match) {
                        renderWithErrors();
                    } else {
                        req.session.userId = userFound.id;
                        res.redirect('/profile');
                    }
                })
        }
      })
                .catch((err) => next(err));
  
  }

  module.exports.logout = (req, res, next) => {
      req.session.destroy()
      res.redirect('/')
  }