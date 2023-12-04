const User = require("../models/User.model");
const mongoose = require("mongoose");


module.exports.register = (req, res, next) => {
    res.render("users/register");
}   

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
    res.render("users/login", { errors: false });};