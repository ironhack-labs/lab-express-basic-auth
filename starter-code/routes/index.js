const express = require('express');
const router  = express.Router();
//const {} = require("../controller/authColtroller")


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
