const User = require("../models/User.model");
const mongoose = require("mongoose");

module.exports.register = (req, res, next) => {
    res.render("users/register");
};

module.exports.doRegister = (req, res, next) => {
    const { email } = req.body;

    User.findOne({ email }).then((dbUser) => {
        if (dbUser) {
            res.render("users/register", {
                user: {
                    email,
                },
                errors: {
                    email: "Este email ya esta en uso!",
                },
            });
        } else {

            User.create(req.body)
                .then(() => {


                    res.redirect("/login");
                })
                .catch((err) => {
                    console.error("Error al crear usuario:", err);

                    if (err instanceof mongoose.Error.ValidationError) {
                        res.render("users/register", {
                            user: {
                                email,
                            },
                            errors: err.errors, // {  EMAIL: 'lo que sea', PASSWOR: ''}
                        });
                    } else {
                        next(err);
                    }
                });
        }
    });
};

module.exports.login = (req, res, next) => {
    res.render("users/login", { errors: false });
};

module.exports.profile = (req, res, next) => {
    res.render("users/profile");
}

module.exports.player = (req, res, next) => {
    res.render("users/listPlayer");
}

module.exports.doLogin = (req, res, next) => {
    const { email, password } = req.body;

    const renderWithErrors = (msg) => {
        res.render('users/login', {
            email,
            errors: {
                msg: msg || 'Email or password are incorrect',
            },
        });
    };

    if (!email || !password) {
        renderWithErrors();
    } else {
        User.findOne({ email })
            .then((dbUser) => {
                if (!dbUser) {
                    renderWithErrors();
                } else {
                    dbUser
                        .checkPassword(password)
                        .then((match) => {
                            if (!match) {
                                renderWithErrors();
                            } else {
                                req.session.currentUser = dbUser;
                                res.redirect('/profile');

                            }
                        })
                        .catch((err) => next(err));
                }
            })
            .catch((err) => next(err));
    }
};

module.exports.logout = (req, res, next) => {
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.redirect('/login');
};