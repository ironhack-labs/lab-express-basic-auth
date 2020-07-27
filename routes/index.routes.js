const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));


//verificamos si el usuario tiene una sesion activa
// de ser así, lo redirigimos a la siguiente ruta "secret"
// caso contrario, redirigimos al usuario al login


router.use ((req,res, next) =>{
    if (req.session.currentUser) {// <== if there's user in the session (user is logged in)
        next() // ==> go to the next route 

    }else{
        res.redirect("/login")
    }

});

// renderizamos la plantilla private.hbs con el username
//deconstruimos en la variable el username el username de req.session.currentUser


router.get("/main", function (req,res,next){
    res.render("main");
});


router.get("/private", function (req,res,next){
    res.render("private");
});



module.exports = router;
