const router = require("express").Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');



router.get("/signup", (req, res, next) => {
    res.render("signup");
});

router.get("/login", (req, res, next) => {
    res.render("login");
});



router.post('/signup', (req, res, next) => {
    // //// REMEMBER TO REMOVE!
    console.log(req.body);
    
    const { username, password } = req.body;
    
    // input checks
    if (username.length === 0) {
        res.render('signup', { message: 'Username cannot be empty' });
        return;
    }
    if (password.length < 4) {
        res.render('signup', { message: 'Your password needs to be longer than 4 charachters' });
        return;
    }
    
    // check existence
    User.findOne({ username: username })
    .then(userFromDB => {
        // if already in my database
        if (userFromDB !== null) {
            // try again
            res.render('signup', { message: 'Username is already taken' });
        } else {
            // create the hashed password
            const salt = bcrypt.genSaltSync();
            const hash = bcrypt.hashSync(password, salt);
            console.log('-------- hash:', hash);
            // create user document in the DB 
            User.create({ username: username, password: hash })
            .then(createdUser => {
                console.log('-------- new user:',createdUser);
                res.redirect('/');
            })
            .catch(err => {
                next(err);
            })
        }
    }) 
});


router.post("/login", (req, res, next) => {
    const { username, password } = req.body;
	// find this user in the DB
	User.findOne({ username: username })
		.then(userFromDB => {
            // if you can't
			if (userFromDB === null) {
                // start over
				res.render('login', { message: 'incorrect username or password. Try again' })
                return
            }
			
            // check the pw (returns truefalse)
			if (bcrypt.compareSync(password, userFromDB.password)) {
				
				req.session.user = userFromDB;
				res.redirect('/profile');
			} else {
				res.render('login', { message: 'incorrect credentials' })
			}
		})
});


module.exports = router;