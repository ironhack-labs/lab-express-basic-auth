const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const genericUser = new User();

router.use((req, res, next) => {
	if (req.session.inSession) {
		next();
	} else {
		res.redirect("/login");
	}
});

/* GET home page */
router.get('/', (req, res, next) => {
    req.session.inSession = false;
    console.log(req.session.inSession)
    res.render('index');
});
/* GET login page */
router.get('/login', (req, res, next) => {
    res.render('login');
});

router.get('/main', (req, res) => {
  if (req.session.inSession) {
    const sessionData = { ...req.session};
    console.log(sessionData);
    res.render('main', {sessionData});
  } else {
    res.render('error',{e});
  }
});

router.get('/private', (req, res) => {
  if (req.session.inSession) {
    res.render('private');
  } else {
    res.render('error',{e});
  }
});

// Check if users are in mongo with correct pwd
router.post('/login', (req, res, next) => {
    console.log( req.session);
    User.findOne({
        user: req.body.user
    }).then((found) => {
        const matches = bcrypt.compareSync(req.body.password, found.password)
        if (matches) {
            req.session.inSession = true;
            req.session.user = req.body.user;
            res.redirect('/main')
        } else {
            req.session.inSession = false;
            res.redirect('/login')
        }
    })
})




// Generate new users with form data
router.post('/createUser', (req, res, next) => {
    console.log(req.body.user)
    console.log(req.body.password)
    const saltRounds = 5;
    if (req.body.user === '' || req.body.password === '') {
        let e = 'Write one user'
        res.render('error', {
            e
    });

    } else {
        genericUser.user = req.body.user;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);
        genericUser.password = hashedPassword
        //Save the new user created in the form with the schema User
        genericUser.save().then(x => {
            req.session.inSession = true;
            console.log(`User ${x.user} has been saved on database mongo`)
            res.redirect('/login');
        })
    }

})

module.exports = router;