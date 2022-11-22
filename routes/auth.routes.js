const { Router } = require('express');
const router = new Router();

router.get('/signup', (req, res) => res.render('auth/signup'));
 
 

module.exports = router;