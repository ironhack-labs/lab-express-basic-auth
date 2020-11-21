const express  = require('express');
const router   = express.Router();

router.use((req, res, next) => {
    if(req.session.currentUser) {
        next()
    }else {
        res.render('main')
    }
})
router.get('/', (req, res, next) => {
    res.render('user-page')
})



module.exports = router