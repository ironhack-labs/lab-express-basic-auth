const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => res.render('home'));

 router.get("/secret", function (req, res, next) {
  res.render("secret");
}); 

module.exports = router;
