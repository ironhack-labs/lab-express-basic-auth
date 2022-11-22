const { Router } = require('express');
const router = new Router();

router.get('/signup', (req, res) => res.render('auth/signup'));
 
router.post('/signup', (req, res, next) => {
    console.log('The form data: ', req.body);
  });
   
 

module.exports = router;