const router = require("express").Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// 1. route d'affichage SIGN UP
router.get("/signup", (req, res, next) => {
  res.render("signup", {});
});

// 2. route de traitement USER --> DB
router.post("/signup", function (req, res, next) {
  const saltRound = 13;
  const salt = bcrypt.genSaltSync(saltRound)

  new User({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, salt), //hash
  })
    // TODO: creer un user en base(avec les infos saisies)
    .save()
    .then(function (newUserFromDB) {
      res.render("login.hbs")
    })
    .catch(function (err) {
      console.log("erreur lors de la creation User", err);
    });
});

// 3. route LOGIN
router.get("/login", (req, res, next) => {
  res.render("login", {});
});
//3.1 route de traitement USER --> LOGIN
router.post('/login',(req, res, next) => {
  User.findOne({username: req.body.username,})
  .then(function(userFromDB){
    //console.log(userFromDB)
    if (userFromDB){
      if(bcrypt.compareSync(req.body.password,userFromDB.password)){
        res.render('profile')
      } 
      else{
        res.render('login',{
          errorMessage: "I DONT FIND THIS ONE"
        });
      }
    }
    else{
      res.render('login',{
        errorMessage: "I DONT FIND THIS ONE"
      });
    }

  })
  .catch(function (err) {
    console.log("erreur lors du LOGIN", err);
  });
});


// 4. route d'affichage profile
router.get("/profile", (req, res, next) => {
  res.render("profile");
});

module.exports = router;
