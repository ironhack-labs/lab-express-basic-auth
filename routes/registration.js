
const router = require("express").Router();

const User = require("../models/User.model");

const bcrypt = require('bcryptjs');
const saltRounds = 10;
const mongoose = require('mongoose');

//////////// S I G N U P ///////////

/* GET home page */
router.get("/register", (req, res, next) => {
    res.render("users/signup")
});


router.post("/register", (req, res, next) => {
    console.log("User input:", req.body);
    //storing the userinput 
    const { username, email, password } = req.body;

    // all fields have to be filled stays untouched
    if (!username || !email || !password) {
        res.render('users/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' })
        return;
    }

    //make sure passwords are strong
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
        res.status(500)
            .render('users/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
        return;
    }

    // creating the according data in db, but using the encrypted version:
    //generate salt
    const salt = bcrypt.genSaltSync(saltRounds);
    //create a hashed version of the password:
    const hash1 = bcrypt.hashSync(password, salt);

    User.create({ username: username, email: email, password: hash1 })
        // .then(() => {
        //     res.send("user created")
        // })

        .then(userFromDB => {
            console.log('Newly created user is: ', userFromDB);
            res.redirect('/auth/userProfile');
        })
        .catch(error => {
            if (error instanceof mongoose.Error.ValidationError) {
                res.status(500).render('users/signup', {
                    errorMessage: error.message
                });
            } else if (error.code === 11000) {
                res.status(500).render('users/signup', {
                    errorMessage: 'Username and email need to be unique. Either username or email is already used.'
                });
            }
            else {
                next(error);
            }
        });
})

//user profile route
router.get('/userProfile', (req, res) => {
    res.render('users/userProfile', {
        userInSession: req.session.currentUser
    });
});


//////////// L O G I N ///////////
// .get() route ==> to display the login form to users
router.get('/login', (req, res) => {
    res.render('users/login');
});

// .post() login route ==> to process form data
router.post('/login', (req, res, next) => {
    console.log('SESSION ====> ', req.session);
    const { email, password } = req.body;

    //user input not complete
    if (email === '' || password === '') {
        res.render('users/login', {
            errorMessage: 'Please enter both, email and password to login.'
        });
        return;
    }
    User.findOne({ email })
        .then(user => {
            if (!user) {
                res.render('users/login', { errorMessage: 'Email is not registered. Try with other email.' });
                return;
            } else if (bcryptjs.compareSync(password, user.password)) {
                //******* SAVE THE USER IN THE SESSION ********//
                req.session.currentUser = user;
                res.redirect('/userProfile');
            } else {
                res.render('users/login', { errorMessage: 'Incorrect password' });
            }
        })
        .catch(error => next(error));
});




//////////// L O G O U T ///////////
router.post('/logout', (req, res) => {
    req.session.destroy();
});



module.exports = router;
