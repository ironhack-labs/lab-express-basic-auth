const User = require("../models/User.model");

module.exports.list = (req, res, next) => {
    User.find()
        .then(users =>{
            res.render("index", {users})
        })
  };

module.exports.createUser = (req, res, next) => {
    res.render("new");    
};

module.exports.doCreateUser = (req, res, next) => {
    const newUser = req.body;
    User.create(newUser)
        .then(()=>{
            res.redirect("/")
        })  
};