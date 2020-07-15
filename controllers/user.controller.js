const User = require ('../models/User.model');
const mongoose = require('mongoose');

module.exports.signUp = (req, res, next) => res.render('signup')

module.exports.createUser = (req, res, next) => {
    const user = new User (req.body)

    user.save()
     .then(() => {
         console.log('User saved');
         res.redirect('/login')
     })
     .catch(err => {
        res.render('signup', {error: err.errors, user})
     })
}

module.exports.login = (req, res, next) => res.render('login')

module.exports.doLogin = (req, res, next) => {
	User.findOne({ username: req.body.username })
	  .then(user => {
		if (user) {
		  user.checkPassword(req.body.password)
			.then(match => {
			  if (match) {
				req.session.userId = user._id
  
				res.redirect('/')
			  } else {
				res.render('users/login', {
				  error: {
					username: {
					  message: 'user not found'
					}
				  }
				})
			  }
			})
		} else {
		  res.render("users/login", {
			error: {
			  username: {
				message: "user not found",
			  },
			},
		  });
		}
	  })
	  .catch(next)
  }

module.exports.logout = (req, res, next) => {
	req.session.destroy()
  
	res.redirect('login')
  }