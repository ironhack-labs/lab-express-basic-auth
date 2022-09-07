const router = require('express').Router();
const loginCheck = require('./helperFunctions')



router.get('/main',loginCheck(), (req,res,next) => {
    const user = req.session.user;
    //res.send(user)
    res.render('main', {user})
})



module.exports = router