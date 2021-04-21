
const { Router } = require('express');
const router = new Router();

router.get('/signups', (req, res) => res.render('auth/signups'));

router.post('/signups', (req, res, next) => {
    console.log('The form data: ', req.body);
  });

module.exports = router;
