const mongoose = require("mongoose");
const User = require("../models/User.model");


module.exports.list = ((req, res, next) => {
    
    console.log(req.session)
    User.find()
        .then((users) => res.render("list", { users }))
        .catch(e => console.error(e))
})

module.exports.create = ((req, res, next) => {
    res.render("create")
})

module.exports.doCreate = ((req, res, next) => {
    User.create(req.body)
        .then(() => {
            console.log(req.body)
            res.redirect("/list")
        })
        .catch((e) => {
            if (e instanceof mongoose.Error.ValidationError) {
                res.render("create", { 
                    errors: e.errors,
                    user: {
                        email:req.body.email
                    }
                })
            } else if (e.code === 11000) {
                res.render("create", { 
                    errors: {email: "There is already an account registered with this email"},
                    user: {
                        email:req.body.email
                    }
                })
            }
            next(e)
        })
});

module.exports.login = ((req, res, next) => {
    res.render("login")
});

module.exports.doLogin =((req, res, next) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
           if (!user) {
               res.render("login", { 
                   errorMessage: "Email or password are invalid",
                   user: {
                       email: req.body.email,
                   }
             })
           } else {
            return user.checkPassword(req.body.password)
                .then((match) => {
                    if (match) {
                        req.session.currentUser = user;
                        res.redirect("/profile")
                    } else {
                        res.render("login", { 
                            errorMessage: "Email or password are invalid",
                            user: {
                                email: req.body.email,
                            }
                      })
                    }
                })
           }
        }) .catch(e => next(e))
});

module.exports.profile = ((req, res, next) => {
    res.render("profile")
})

module.exports.index = ((req, res, next) => {
    res.render("index")
})

module.exports.logout = ((req, res, next) => {
    req.session.destroy();
    res.redirect("/")
})