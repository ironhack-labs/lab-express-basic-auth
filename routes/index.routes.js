const express = require('express');
const router = express.Router();


// router.use((req, res, next) => {
//   if (!req.session.user) {
//     return res.redirect("/auth/signup");
//   }
//   next();
// });
// = middleware so should go to the next function
const checkAuth = (req, res, next) => {
    if(!req.session.user){
        res.redirect('/')
    }
    next();
}

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));


/* GET main page */
// MUST BE authentication!
router.get('/main', (req,res,next) => {
    if(!req.session.user){
        res.redirect('/')
        return
    }
    res.render('main')
})

/* GET private page */
router.get('/private', checkAuth, (req,res,next) => {
    res.render('private')
})


module.exports = router;
