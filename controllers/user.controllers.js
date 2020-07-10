const User = require ('../models/User.model');

module.exports.createUser = (req, res, next) => {
    const user = new User (req.body)

    user.save()
     .then(() => {
         console.log('The user save');
         res.redirect('/login')
     })
     .catch(e => {
        res.render('signup', {error: e.errors, user})
     })

}

module.exports.signUp = (req, res, next) => res.render('signup')

module.exports.login = (req, res, next) => res.render('login')