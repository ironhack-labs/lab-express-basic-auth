const express = require('express');
const router  = express.Router();
const User = require('../model/user');
const bcrypt = require('bcrypt');

const genericUser = new User();


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


router.post('/createdUser', (req, res) => {

  if(req.body.user === "" || req.body.password === ""){

    res.redirect('error');
    return
  }

  User.findOne({
      user: req.body.user
  })
  .then(found => {
    res.redirect('error');
    return
  })
  
  const saltRounds = 5;

  genericUser.user = req.body.user;

  console.log(req.body.user);
  console.log(req.body.password);

  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);

  genericUser.password = hashedPassword;
  console.log(hashedPassword);

  genericUser.save().then(() => {
  
    res.render('createdUser');
    
  });
});



module.exports = router;
