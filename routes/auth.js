const router = require("express").Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');


router.get('/signup', (req, res, next) => {
  res.render('signup')
})

router.get('/login', (req, res, next) => {
    res.render('login')
})

router.post('/signup', (req, res, next) => {
    const {username, password} = req.body
    if (password.length < 4) {
        res.render('signup', { message: 'Your password needs to be 4 char min'})
        return
    }
    if (username.length === 0) {
        res.render('signup', { message: 'Please enter username'})
        return
    }
    User.findOne({username: username})
    .then(userFromDb => {
        if (userFromDb !== null) {
            res.render('signup', {message: 'Your username is already taken'})
        } else {
            const salt = bcrypt.genSaltSync();
				const hash = bcrypt.hashSync(password, salt)
				// create the user
				User.create({ username: username, password: hash })
					.then(createdUser => {
						console.log(createdUser)
						res.redirect('login')
					})
					.catch(err => next(err))
        }
    })
})

const loginCheck = () => {
    return (req, res, next) => {
      // check for a logged in user
      if (req.session.user) {
        next()
      } else {
        res.redirect('/login')
      }
    }
  }

  router.get("/profile", loginCheck(), (req, res, next) => {
    // this is how we can set a cookie
    res.cookie('ourCookie', 'hello node')
    console.log('this is our cookie: ', req.cookies)
    // to clear a cookie
    res.clearCookie('ourCookie');
    // we retrieve the logged in user from the session
    const loggedInUser = req.session.user
    res.render("profile", { user: loggedInUser });
  });

  router.get('/main', (req, res, next) => {
     res.render('main')
  })
  router.get('/private', loginCheck(), (req, res, next) => {
     res.render('private')
  })


router.post('/login', (req, res, next) => {
    const { username, password } = req.body
    //checking if we have a user in the database

    User.findOne({ username: username})
    .then(userFromDB => {
        if (userFromDB === null) {
            //user not correct, show log in.
            res.render('login', { message: 'incorrect credentials'})
            return

        }
        // username is correct
		// check the password against the hash in the database
		// compareSync() -> true or false
        if (bcrypt.compareSync(password, userFromDB.password)) {
            // it matches -> credentials are correct -> user get's logged in
			// req.session.<some key (usually 'user')>
            req.session.user = userFromDB
            res.redirect('/profile')
        }  else {
            // password is not correct -> show login again
            res.render('login', { message: 'invalid credentials'})
        }
    })
});

router.get('/logout', (req, res, next) => {
       req.session.destroy(err => {
        if(err) {
            next(err)
        } else {
            res.redirect('/')
        }
    })
})

module.exports = router;