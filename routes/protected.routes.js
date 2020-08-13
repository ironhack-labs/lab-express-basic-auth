const express = require('express');
const router = express.Router();

const isLoggedIn = (req,res,next) => {
    console.log(req.session)
    if(!req.session.currentUser){
        return res.send('Acces denied!')
    }
    next()
  }

router.get('/main', isLoggedIn, (req, res) => res.render('protected/main'));
router.get('/private', isLoggedIn, (req, res) => res.render('protected/private'));
router.get('/userProfile', isLoggedIn, (req, res) => res.render('user/userProfile', req.session.currentUser));

module.exports = router;