const express = require('express');
const router = express.Router();

/* GET home page */

//cambiamos index por home para que renderize la view home
router.get('/', function (req, res, next) {
    res.render('home')});

//creamos 2 vistas, main y secret que solo podrá ver el usuario cuando este logeado
router.use((req, res, next) => {
    //comprueba si hay un currentUser activo
    if (req.session.currentUser) {
        next();
    } else {
        res.redirect("/login");
    }
});

router.get("/main", function (req, res, next) {
    res.render("main");
  });

router.get("/private", function (req, res, next) {
    res.render("private");
  });


module.exports = router;

