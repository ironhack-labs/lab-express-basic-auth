const User = require('../models/user.model');

module.exports.login = (_, res) => {
    res.render('users/login')
  }

module.exports.doLogin = (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then(user => {
      if (user) {
        user.checkPassword(req.body.password)
          .then(match => {
            if (match) {
              req.session.userId = user._id

              res.redirect('/welcome')
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


module.exports.signup = (_, res) => {
  res.render('users/signup', { user: new User() })
}

module.exports.welcome = (req, res, next) => {
  res.render('users/welcome')
}

module.exports.createUser = (req, res, next) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  })

  user
    .save()
    .then((user) => {
      res.redirect('/')
    })
    .catch((error) => {
      res.render('users/signup', { error: error.errors, user })
    })
}

module.exports.logout = (req, res, next) => {
  req.session.destroy()

  res.redirect('/')
}