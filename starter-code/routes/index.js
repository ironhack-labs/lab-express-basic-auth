const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');

const userCollection = require('../model/user.js')

const bcrypt = require('bcrypt')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.post('/registrar',(req,res,next)=>{

  const user = req.body.user;
  const pass = req.body.password;
  const saltRounds = 10;

   const salt = bcrypt.genSaltSync(saltRounds);

   const encriptPass = bcrypt.hashSync(pass,salt);

   userCollection.create({user: user, password: encriptPass})
   

})


router.get('/login',(req,res,next)=>{
res.render('login')
})


router.post('/comprobar',(req,res,next)=>{

  const user = req.body.user
  const pass = req.body.password

  

  userCollection.findOne({'user': user})
  .then((data)=>{
    
    if(bcrypt.compareSync(pass, data.password)){
      console.log("Puedes acceder")
    }

  })

})

module.exports = router;
