
const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const UserModel = require('../models/User.model');
const saltRounds = 10;
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

// router.get('/signup', (req, res) => res.render('auth/signup'))
//增加middleware來保護路徑
router.get('/signup', isLoggedOut, (req, res) => res.render('auth/signup'));
 

router.post('/signup', (req, res, next) => {
    //  console.log('The form data:', req.body)
    const { username, password } = req.body;

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
        res
            .status(500)
            .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
        return;
    }

    if (!username || !password) {
        res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, and password.' });
        return;
    }


    bcryptjs.genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            return UserModel.create({
                username,
                passwordHash: hashedPassword
            })
        })
        .then(userFromDB => {
            console.log('Newly created user is:', userFromDB);
            res.redirect('/userCreated')
        })
        .catch(error => {
            if (error instanceof mongoose.Error.ValidationError) {
                res.status(500).render('auth/signup', { errorMessage: error.message });
            } else if (error.code === 11000) {
                res.status(500).render('auth/signup', {
                    errorMessage: 'Username needs to be unique.'
                });
            } else {
                next(error);
            }
        });
})


router.get('/userCreated', (req, res) => {
    res.render('users/user-created', { userInSession: req.session.currentUser });
});


router.get('/login', (req, res) => {
    res.render('auth/login')
})

router.post('/login', (req, res, next) => {
    console.log('SESSION =====> ', req.session);
    //因為前端此變數 <input type="password" name="password"  />
    const { username, password } = req.body
    if (username === '' || password === '') {
        res.render('auth/login', {
            errorMessage: 'Please enter both, username and password to login.'
        })
        return
    }

    //因為models裡的module.exports = model('User', userSchema);
    //是UserModel 而不是User 在最上面我自己定義了UserModel
    UserModel.findOne({ username })
        .then(user => {
            if (!user) {
                res.render('auth/login', { errorMessage: 'User is not registered. Try with other user.' });
                return;
            } else if (bcryptjs.compareSync(password, user.passwordHash)) {
                req.session.currentUser = user;
                res.redirect('/userProfile');
            } else {
                res.render('auth/login', { errorMessage: 'Incorrect password.' });
            }
        })
        .catch(error => next(error));

});


// router.get('/userProfile', (req, res) => {
//     res.render('users/user-profile', { userInSession: req.session.currentUser });
// });

//增加middleware來保護路徑
router.get('/userProfile', isLoggedIn, (req, res) => {
    res.render('users/user-profile', { userInSession: req.session.currentUser });
  });



router.post('/logout', (req, res, next) => {
    req.session.destroy(err => {
        if (err) next(err);
        res.redirect('/')
    })
})


module.exports = router;