const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

// middleware checks if user is logged in
// router.use((req, res, next) => {
//     if (req.session.currentUser) { 
//       next(); 
//     } else {                         
//       res.redirect("/login");       
//     }                                
//   });                               

const loginCheck = () => {
    return (req, res, next) => {
        // is the user logged in?
        if (req.session.user) {
            next();
        } else {
                res.render('auth/login', { pleaseLogin: 'You must login to see this page.' });
                    }
    }
}

router.get('/profile', loginCheck(), (req, res) => {
    res.render('profile', req.session.user);
})

router.get('/main', loginCheck(), (req, res) => {
    res.render('main', req.session.user);
})

router.get('/private', loginCheck(), (req, res) => {
    res.render('private', req.session.user);
})

module.exports = router;