const express = require('express');
const router = express.Router();

/* GET home page */

router.get('/', (req, res, next) => res.render('index'));

router.get('/main', (req, res) => {
      let activeUser = false;

      if (req.session.loggedInUser) {
          activeUser = true;
      }
      res.render('main.hbs',  {activeUser})
})


router.get('/private', (req, res, next) => {
    let activeUser = false;
    
    if (req.session.loggedInUser){ 
        activeUser = true;
    }
    res.render('private', {activeUser});
});

router.get('/private', (req, res, next) => res.render('private'));


module.exports = router;
