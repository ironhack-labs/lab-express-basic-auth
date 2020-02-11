const express = require('express');
const router  = express.Router();
const protectsRoutes = require("./../middlewares/protectsRoutes");


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;

router.get('/dashboard', (req, res, next) => {
  res.render('dashboard');
})


router.get("/main", protectsRoutes, (req, res, next) => {
  res.render('main');
})

router.get("/privatepage", protectsRoutes, (req, res, next) => {
    res.render('privatepage');
});