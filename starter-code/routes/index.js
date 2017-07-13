const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express'});
});

router.get('/secret', (req, res, next) => {
  res.send('secret',{"message": "dd"} );
})


module.exports = router;