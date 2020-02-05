const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', {title: "ENGLISH WE CAN"});
});


/* GET About page */
router.get('/about', (req, res, next) => {
  res.render('about', {title: "About Us"});
});



module.exports = router;
