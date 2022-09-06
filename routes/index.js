const router = require("express").Router();
const userModel = require ('../models/User.model')
const bcrypt = require('bcryptjs');


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res, next) => {
  res.render("user/signup");
});

router.get("/login", (req, res, next) => {
  res.render("user/login");
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

//POST

router.post("/signup", (req, res, next) => {
  const {username, password} = req.body
  bcrypt
    .genSalt(10)
    .then((salts) => {
      return bcrypt.hash(password, salts);
    })
    .then((pass) => {
      return userModel.create({ password: pass, username });
    })
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => next(err));
});

router.post("/login", (req, res, next) => {
  const {username, password} = req.body
  let user
  userModel.findOne({username})
  .then((userDB) => {
    user = userDB
    return bcrypt.compare(password, user.password)
  })
  .then((isPassword) => {
    if (isPassword) {
      req.session.user = user;
      res.redirect('/');
    } else {
      res.render('user/login', {message: 'Ususario o contraseña incorrecta!'});
    }
  })  
    .catch((err) => next(err));
});

module.exports = router;
