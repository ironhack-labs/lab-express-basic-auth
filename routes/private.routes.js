
const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('/private');
});
router.get('/private', (req, res) => {
  res.render('private');
});
router.get('/private2', (req, res) => {
  res.render('/main');
});

module.exports = router;