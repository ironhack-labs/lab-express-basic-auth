const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

const { signupView, signupProcess } = require("../controllers/auth");

router.get("/signup", signupView);
router.post("/signup", signupProcess);
router.post("/signup", signupProcess);
router.post("/signup", signupProcess);

module.exports = router;
