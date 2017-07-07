var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Bienvenido' });
});

router.get('/main', function(req, res, next) {
  if (req.session.currentUser) {
    console.log(req.session.currentUser);
    res.render('main', {
      title: 'Secret page',
      session:req.session.currentUser
    });
  }else{
    res.render('index', {
      title: 'Express',
      errorMessage: "Para acceder debes iniciar sesion primero!"
     });
  }
});


router.get('/private', function(req, res, next) {
  if (req.session.currentUser) {
    console.log(req.session.currentUser);
    res.render('private', {
      title: 'Secret page',
      session:req.session.currentUser
    });
  }else{
    res.render('index', {
      title: 'Express',
      errorMessage: "Para acceder debes iniciar sesion primero!"
     });
  }
});
module.exports = router;
