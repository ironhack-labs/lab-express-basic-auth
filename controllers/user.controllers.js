const User = require ('../models/User.model');
const mongoose = require('mongoose')

module.exports.createUser = (req, res, next) => {
    const user = new User (req.body)

    user.save()
     .then(() => {
         console.log('The user save');
         res.redirect('/login')
     })
     .catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
            res.render("signup", { error: error.errors, user });
        } else if (error.code === 11000) { // error when duplicated user
            res.render("signup", {
              user,
              error: {
                username: {
                  message: 'User already exists'
                }
              }
            });
          } else {
            next(error);
          }
     })

}

module.exports.index = (req, res, next) => res.render('index')
module.exports.signUp = (req, res, next) => res.render('signup')
module.exports.login = (req, res, next) => res.render('login')
module.exports.main = (req, res, next) => res.render('main')
module.exports.private = (req, res, next) => res.render('private')

module.exports.doLogin = (req, res, next) => {

    User.findOne({username: req.body.username})
        .then (user => {
            if (user) {
                user.checkPassword(req.body.password)
                  .then(match => {
                    if (match) {
                      req.session.userId = user._id
                      res.redirect('/')
                    } else {
                      res.render('login', {
                        error: {
                          username: {
                            message: 'User o password incorrect'
                          }
                        }
                      })
                    }
                  })
              } else {
                res.render("login", {
                  error: {
                    username: {
                      message: "User o password incorrect",
                    },
                  },
                });
              }
            })
            .catch(next)
}


module.exports.logout = (req, res, next) => {
  req.session.destroy()
  res.redirect('/')
}

