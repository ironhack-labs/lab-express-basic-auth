const router = require("express").Router();
const mongoose = require('mongoose');
const User = require('../models/User.model.js');
const bcryptjs = require('bcryptjs');


/* GET Signup page */
router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post('/login', (req,res)=>{

    res.render('/profile')

})



module.exports = router;