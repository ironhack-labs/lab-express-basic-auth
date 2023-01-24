const User = require("../models/User.model");
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

module.exports.create = (req, res, next) => {
res.render("user/form")
}

module.exports.profile = (req, res, next) => {
res.render("user/profile")
}

module.exports.doCreate = (req, res, next) => {
const { username, password } = req.body;

//const hashedPassword = bcryptjs.hashSync(password, salt);

//console.log(`Password hash: ${hashedPassword}`);

bcryptjs.genSalt(saltRounds)
.then(salt => bcryptjs.hash(password, salt))
.then(hashedPassword => {
    return User.create({
        username,
        password: hashedPassword
    });
})
.then(( )=>{
    //console.log('Newly created user is: ', user);
    res.redirect("/profile")
})
.catch(error => next(error));
}



