const express = require('express');
const router = express.Router();

const routeGuard = require('../config/route-guard.config');

/* GET home page */
router.get('/', (req, res) => {
  if (req.session.visitCount) {
    req.session.visitCount += 1;
  } else {
    req.session.visitCount = 1;
  }
  res.render('index', {
    title: 'App created with Ironhack generator 🚀',
    visitCount: req.session.visitCount,
    sess: JSON.stringify(req.session)
  });
});

router.get('/secret', routeGuard, (req, res) => res.render('users/secret'));

module.exports = router;