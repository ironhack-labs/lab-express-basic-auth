const express = require('express');
const router = express.Router();
const withAuth = require('../helpers/middleware')

/* GET home page */
router.get('/', (req, res, next) =>res.render('index'));


router.use((req, res, next) => {
    if (req.session.currentUser) { 
      next(); 
    } else {                          
      res.redirect("/login");         
    }                                 
  });

  router.get("/secret", (req, res, next) => {  
    res.render("auth/secret", req.session.currentUser);
  });

  

module.exports = router;
