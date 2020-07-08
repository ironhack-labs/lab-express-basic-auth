const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => res.render('signup'));
router.post('/new-user', (req, res, next) => {
  console.log('post', req.body);
});

module.exports = router;
