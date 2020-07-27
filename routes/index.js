const express = require('express');
const router = express.Router();


/* GET home page */
router.get('/', (req, res, next) => res.render('index'));


//creo el middleware 
router.use((req, res, next) => {
    if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
      next(); // ==> go to the next route 
    } else {
      res.redirect("/login");
    }
  });
  
//creo una ruta para que me redireccione ???

router.get('/main',(req, res,next)=> res.render('auth/secretPage')),

router.get('/private', (req, res,next)=> res.render('auth/secretPageGif')),










module.exports = router;
