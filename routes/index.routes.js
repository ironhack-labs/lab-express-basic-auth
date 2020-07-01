const express = require("express");
const app = require("../app");
const User = require("../models/User.model");
const router = express.Router();
router.get("/", (req, res, next) => {
  res.send('home');
});

const loginCheck = () => {
  return (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.redirect('/login');
    }
  }
}

router.get('/private', loginCheck(), (req, res) => {
    const user=req.session.user
    console.log(user)
   
  res.render('private',{user:user});
})



module.exports = router;