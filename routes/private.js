const router = require('express').Router();
const loginCheck = require('./helperFunctions')



router.get('/private',loginCheck(), (req,res,next) => {
    const user = req.session.user;
    res.render('private', {user})
})



module.exports = router