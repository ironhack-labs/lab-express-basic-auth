var express = require('express');
var router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);


  
//   router.post("/signup", (req,res)=>{
//     const user = new user({
//         userName: req.body.userName,
//         password: req.body.password,
//       });
//       user.save((err,result)=>{
//         if(!err){
//           return res.redirect("/");
//         }
//       });
//     });


// Routes
router.get('/signup', function(req, res, next) {
    res.render('index', { title: 'signup' });
  });

  module.exports = router;
  