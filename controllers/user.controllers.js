const User = require("../models/User.model");
const mongoose = require("mongoose");

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
    const {email, password} = req.body;
    
    if (!email || !password){
        res.render("new", {errorMessage: "All fields are mandatory", email});
    } else {
        const newUser = req.body;
        User.create(newUser)
            .then(()=>{
                res.redirect("/")
            }) .catch((error)=> {
                if (error instanceof mongoose.Error.ValidationError) {
                    res.status(500).render("new", {errorMessage: error.message, email});
                } else if (error.code === 11000){
                    console.error(error)
                    res.status(500).render("new", {errorMessage: 'Username and email need to be unique. Either username or email is already used.', email})
                }
                else {
                    next(error);
                }
            })
    }
};

module.exports.login = (req, res, next) =>{
    res.render("login")
}

module.exports.doLogin = (req, res, next) =>{
    const {email, password} = req.body;
    
    User.findOne({email: email})
        .then((user)=>{
            if(!user){
                res.render("login" ,{errorMessage: "Invalid email or password", email})
            } else{
                return user.checkPassword(password)
                    .then((match)=>{
                        if(match){
                            
                            req.session.currentUser = user
                    
                            res.redirect("/profile")
                        } else{
                            res.render("login" ,{errorMessage: "Invalid email or password", email})
                        }
                    });
            };
        }) .catch((error)=> {
            if (error instanceof mongoose.Error.ValidationError) {
                res.status(500).render("login", {errorMessage: error.message, email});
            }
            else {
                next(error);
            }
        })
    
}

module.exports.viewProfile = (req, res, next) =>{
    console.log(req.session)
    res.render("profile", {user: req.session.currentUser})
}

module.exports.doLogOut = (req, res, next) =>{
    req.session.destroy();
    res.redirect("/")
}