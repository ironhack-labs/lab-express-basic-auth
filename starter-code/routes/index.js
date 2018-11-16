const express = require('express');
const bodyParser   = require('body-parser');
const bcrypt = require('bcrypt');

const router  = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => res.render('signup'));

router.post('/signup', (req, res, next) => {
  const saltRounds = 5;

  const myUser = req.body.username;

  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);
  console.log(hashedPasword);
});

router.get('/login', (req, res, next) => res.render('login'));

module.exports = router;
