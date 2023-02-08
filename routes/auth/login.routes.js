const router = require('express').Router();

/* GET home page */
router.get('/login', async (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', async (req, res, next) => {});

module.exports = router;
