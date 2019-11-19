var express = require('express');
const router = express.Router();

// GET '/logout'
router.get('/', (req, res, next) => {
  req.session.destroy( () => {
    res.redirect('/');
  })
});

module.exports = router;