const User = require('../models/user.model');

module.exports.deleteAllUsers = (req, res, next) => {
    User.deleteMany()
        .then(() => {
            console.log('Database deleted');
            res.render('index')
        })
        .catch(err => console.log('error when deleting database:', err)
        )
}

module.exports.showSignUpForm = (req, res, next) => res.render('users/signup');

module.exports.showLoginPage = (req, res) => res.render('auth/login');

module.exports.createNewUser = (req, res, next) => {
    const { username, password } = req.body;
   
    if (username === '' || password === '') {
      res.render('users/signup', {
        errorMessage: 'Please enter both, username and password to login.',
      });
      return;
    } else {
        const newUser = new User(req.body);
        newUser.save()
            .then(user => {
                res.redirect('login')
            })
            .catch(err => {
                console.log(err)
                res.redirect('signup', { errorMessage: 'Something went wrong.' })
            })
    }
    }

module.exports.checkToLogin = (req, res, next) => {
    const { username, password } = req.body;
   
    if (username === '' || password === '') {
      res.render('auth/login', {
        errorMessage: 'Please enter both, username and password to login.',
      });
      return;
    }
   
    User.findOne({ username: req.body.username })
        .then((user) => {
            if (!user) {
                res.render('auth/login', { errorMessage: 'User not found' });
                return;
            } else if (user) {
                user.checkPassword(req.body.password)
                    .then(match => {
                        if (match) {
                            req.session.userId = user._id
                            res.redirect('/user-profile');
                        } else {
                            res.render('auth/login', { errorMessage: 'User not found' });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        res.render('auth/login', { errorMessage: 'User not found' });
                    })
              
            } 
        })
        .catch((error) => {
            console.log(error);
            res.render('auth/login', { errorMessage: 'User not found' });
        });
  }

module.exports.showUserProfile = (req, res, next) => {
    res.render('users/user-profile');
}

module.exports.showMainPage = (req, res, next) => {
    res.render('users/main-page');
}

module.exports.showPrivatePage = (req, res, next) => {
    res.render('users/private-page');
}
