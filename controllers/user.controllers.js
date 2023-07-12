const User = require('../models/User.model')

module.exports.signup = (req, res, next) => {
    res.render('signUpForm')

}

module.exports.doSignUp = (req, res, next) => {

    const renderWithErrors = (errors) => {
        res.render('signUpForm', {
          user: {
            name: req.body.username
          },
          errors
        });
      };
    
    User.findOne({ username: req.body.username })
    .then (user => {
        if(!user){
            return User.create(req.body)
            .then(user =>{
                res.render('index', { user });
        });
    } else {
        renderWithErrors({ username: 'Username already registered' });
    }
})
    .catch(error => {
        renderWithErrors(error);
      });
  };