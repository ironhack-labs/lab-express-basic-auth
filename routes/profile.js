const express = require('express');
const router = express.Router();

/* GET profile page */
router.get('/profile', (req, res, next) =>{ 
    const user = req.session.user
    if (user !== null) {
        console.log(user)
        return res.render('profile')
    }
    return res.redirect('/')
    
});


module.exports = router;
