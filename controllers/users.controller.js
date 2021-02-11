const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const salt = 10;
const mongoose = require('mongoose')

module.exports.edit = (req, res, next) => {
    res.render('users/register')
};

module.exports.doEdit = (req, res, next) => {

    function renderWithErrors(errors) {
        console.log(errors)
        res.status(400).render('users/register', {
            errors: errors,
            user: req.body
        })
    }
    console.log(req.body)

    User.findOne({ userName: req.body.userName })
        .then((user) => {

            if (user) {
                renderWithErrors({
                    userName: 'User Already exists'
                })
                //console.log (`${user} already exits`)

            } else {
        
                User.create(req.body)
                    .then((user) => {
                        req.session.currentUserId = user.id
                        res.redirect('/')}
                    )
                    .catch((e) => {
                        if (e instanceof mongoose.Error.ValidationError) {

                            renderWithErrors(e.errors)
                        }
                        else {
                            next(e)
                        }
                    });

            }
        })
        .catch((e) => next(e));


};

module.exports.login = (req, res, next) => res.render('users/login');

module.exports.doLogin = (req, res, next) => {
    function renderWithErrors() {
        console.log("error login")
        res.render('users/login', {
          user: req.body,
          errorMessage: 'Email or password is not correct'
        })
      }
   

    User.findOne({ userName: req.body.userName })
        .then((user) => {
            if (!user) {
                renderWithErrors();

            } else {
                console.log('SESSION =====> ', req.session);

                user.checkPassword(req.body.password)
                .then(match => {
                    console.log("req.session : ", req.session)
                  if (match) {
                    req.session.currentUserId = user.id
                         res.redirect('/profile')
                  } else {
                  

                        renderWithErrors()
                
                    
              }
               })
           //     if (bcrypt.compareSync(req.body.password, user.password)) {
           //         console.log("req.session : ", req.session)
           //
           //         req.session.currentUserId = user.id
           //         res.redirect('/profile');
           //     }
            }

        })
        .catch((e)=> next(e))   
};

module.exports.profile = (req,res,next) => {
    console.log(" res:locals: ", res.locals)
    res.render('users/logon');
}

// logout de la sesión
module.exports.logout = (req,res,next) => {
     req.session.destroy();
     res.redirect('/');
}

module.exports.private= (req,res,next) => {
    res.render('users/private')
}
module.exports.main= (req,res,next) => {
    res.render('users/main')
}
