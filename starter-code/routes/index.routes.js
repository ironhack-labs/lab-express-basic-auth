const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.use('/', require('./public.routes'));

//chequeando si el usuario ya ha hecho logion, de ser cierto, avanza a las rutas privadas, sino a login
router.use((req, res, next) => req.session.currentUser ? next() : res.redirect("/login"))

router.use('/', require('./private.routes'));


module.exports = router;

