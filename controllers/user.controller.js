//require model
const User = require("../models/User.model")

//bcryptjs configuration
const bcryptjs = require('bcryptjs')
const UserModel = require("../models/User.model")
const saltRounds = 10


//Show user signUp
module.exports.register = (req,res,next) => {
    res.render('authentication/auth_form')
}

//Create user
module.exports.doRegister = (req, res, next) => {
    
    const { username, email, password } = req.body
    bcryptjs.genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
            .then((hashedPassword) => {
                res.redirect('/')
                return User.create({
                    username, 
                    email, 
                    passwordHash: hashedPassword 
                })
            .then(userFromDB => console.log(userFromDB))
            })
        .catch(error => {
            next(error)
        });
}


