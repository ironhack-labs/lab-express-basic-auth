const express = require('express');
const authRoutes = require('./authRouter');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.use(authRoutes);

module.exports = router;
