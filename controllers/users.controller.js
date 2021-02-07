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
                req.session.currentUserId = user.id;
                User.create(req.body)
                    .then(() => res.redirect('/'))
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

    function renderWithErrors(errors) {
        console.log(errors)
        res.status(400).render('users/login', {
            errors: errors,
            user: req.body
        })
    }

    User.findOne({ userName: req.body.userName })
        .then((user) => {
            if (!user) {
                renderWithErrors({
                    errorMessage: "User doesn't exit"
                })

            } else {
                console.log('SESSION =====> ', req.session);

                req.session.currentUser = user.id
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    console.log(`User ${user.userName} ${req.session.currentUser}}logon`)
                    res.render('users/logon',user);
                }
            }

        })
};
// logout de la sesión
module.exports.logout = (req,res,next) => {
     req.session.destroy();
     res.render('/');
}

