const User = require("../models/User.model");
const mongoose = require("mongoose");


module.exports.register = (req, res, next) => {
    res.render("users/signup");
}

module.exports.doRegister = (req, res, next) => {
    const userProposal = req.body;

    function renderWithError(errors) {
        res.status(400).render("users/signup", {
            errors: errors,
            user: req.body,
        });
    }

    User.findOne({
            email: userProposal.email,
        })
        .then((user) => {
            if (user) {
                renderWithError({
                    email: "A user with this email already exists",
                });
            } else {
                User.create(userProposal)
                    .then(() => res.redirect("/"))
                    .catch((e) => {
                        if (e instanceof mongoose.Error.ValidationError) {
                            renderWithError(e.errors);
                        } else {
                            next(e);
                        }
                    });
            }
        })
        .catch((e) => next(e));
}