const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render("index")
})

router.get('/logout',(req,res) => {
    req.session.currentUser = null;
    res.redirect('/');
  })

module.exports = router;

