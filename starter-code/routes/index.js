const express = require('express');
const router  = express.Router();


// import controller
const { signupView, signupProcess } = require("../controllers/auth");


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

// Auth routes

router.get("/signup", signupView);
router.post("/signup", signupProcess);

module.exports = router;
