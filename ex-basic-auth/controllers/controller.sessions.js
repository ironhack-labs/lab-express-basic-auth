const User = require("../models/user.model");
const createError = require("http-errors");
const mongoose = require("mongoose");
const session = require("express-session");

module.exports.create = (req, res, next) => {
    res.render("sessions/create");
};

module.exports.doCreate = (req, res, next) => {
    
    if (!req.body.username || !req.body.password) {
       console.log('empty');
        res.render("sessions/create", {errors: {username: "username must not be empty", password: "password must not be empty"}});
    } else {
        User.findOne({ username: req.body.username }) 
        .then(user => {
            if (user) {
                user.checkPassword(req.body.password)
                .then(match =>{
                    if (match) {
                        req.session.currentUser = user;
                        res.redirect('/');
                    }else{
                        res.render('sessions/create', {errors:{password:'wrong passrowd'}});
                    }
                }) 
                .catch(error =>{
                    next(error);
                });
                
            } else {
                res.render("/sessions/create", {error: 'email not found'});
            }
        })
        .catch(error => {
            if (error instanceof mongoose.Error.CastError) {
                next(createError(404, `not a valid username`));
            } else {
                next(error);
            }
        });
    }
};

module.exports.doDelete = (req, res, next) =>{
    req.session.destroy(()=>{
        res.redirect('/sessions/create');
    });
};
