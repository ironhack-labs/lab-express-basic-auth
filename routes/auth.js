const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');
//const { isValidObjectId } = require('mongoose');
const SALT = 10;

////////////////SIGNUP////////////
router.get('/signup', (req, res, next) => {
  res.render('auth/signup.hbs');
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  bcryptjs
    .genSalt(SALT)
    .then((salt) => {
      //console.log(salt);
      return bcryptjs.hash(password, salt);
    })
    .then((hashedPassword) => {
      //console.log(hashedPassword);
      return User.create({ username: username, passwordHash: hashedPassword });
    })
    // .then((createdUser) => {
    //   console.log(createdUser);
    // })
    .catch((err) => {
      next(err);
    });

  res.redirect('/profile');
});

///////async,await version//////////
// router.get('/signup', (req, res, next) => {
//   res.render('auth/signup.hbs');
// });

// router.post('/signup', async (req, res, next) => {
//   try {
//     const user = req.body;

//     if (!user.username || !user.password) {
//       res.render('auth/signup.hbs', {
//         errorMessage:
//           'All fileds are mandatory, please provide your username and password.',
//       });
//       return;
//     }
//     const foundUser = await User.findOne({
//       username: user.username,
//     });
//     if (foundUser) {
//       res.render('auth/signup.hbs', {
//         errorMessage: 'Username taken. Try another one.',
//       });
//       return;
//     }

//     const hashedPassword = bcryptjs.hashSync(user.password, SALT);
//     user.password = hashedPassword;

//     const createdUser = await User.create(user);
//     res.redirect('/login');
//   } catch (error) {
//     next(error);
//   }
// });

////////////////LOGIN////////////
router.get('/login', (req, res, next) => {
  res.render('auth/login.hbs');
});

router.post('/login', (req, res, next) => {
  //console.log(req.session);
  const { username, password } = req.body;

  //findOne need an object, req.body.username provides only the username
  User.findOne({ username: username })
    .then((user) => {
      //console.log(user);
      //console.log(user.passwordHash, password);
      if (!user) {
        res.render('auth/login.hbs', {
          errorMessage: 'Username does not exist. Please try again.',
        });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        //{user} render the user information to the profile page
        res.render('profile.hbs', { userInSession: user });
      } else {
        res.render('auth/login.hbs', {
          errorMessage: 'Incorrect password.',
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

///////async,await version//////////
// router.get('/login', (req, res, next) => {
//   res.render('auth/login.hbs');
// });

// router.post('/login', async (req, res, next) => {
//   try {
//     const foundUser = await User.findOne({ username: req.body.username });

//     if (foundUser.username === '' || foundUser.password === '') {
//       res.render('/login', {
//         errorMessage: 'Please enter both username and password to login.',
//       });
//       return;
//     }

//     if (!foundUser) {
//       res.render('/login', {
//         errorMessage: 'Unable to log in. Please try again.',
//       });
//       return;
//     }

//     const isValidPassword = bcryptjs.compareSync(
//       req.body.password,
//       foundUser.password
//     );

//     if (isValidPassword) {
//       req.session.currentUser = {
//         _id: foundUser._id,
//       };

//       res.redirect('/profile');
//     } else {
//       res.render('auth/login.hbs', {
//         errorMessage: 'Bad credentials. Please try again.',
//       });
//       return;
//     }
//   } catch (error) {
//     next(error);
//   }
// });

////////////////LOGOUT////////////
router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect('/');
  });
});

module.exports = router;
