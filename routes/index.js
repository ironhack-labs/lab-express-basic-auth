const { reset } = require("nodemon");
const User = require("../models/User.model");
const router = require("express").Router();
const bcrypt = require('bcryptjs')


const loginCheck = function(){
  return (req, res, next) => {
    // check if the user is logged in
    if (req.session.user !== undefined) {
      console.log('Check')
      // the user is logged in 
      // they can visit the page that they requested
      next()
    } else {
      // the user is not logged in
      // we redirect
      res.redirect('/login')
    }
  }
}

const logoutCheck = function(){
  return (req, res, next) => {
    if (req.session.user === undefined) {
      next()
    } else {
      res.redirect('/profile')
    }
  }
}


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", {session: req.session.user});
  console.log(req.session.user)
});

router.get("/login", logoutCheck(), (req, res, next) => {
  res.render("login");
});

router.get("/profile", loginCheck(), (req, res, next) => {
  res.render("profile");
});

router.get("/main", (req, res, next) => {
  res.render("main");
});

router.get("/private", loginCheck(), (req, res, next) => {
  res.render("private");
});

router.get("/logout", loginCheck(), (req, res, next) => {
  req.session.destroy()
	res.redirect('/')
});

router.post("/login", (req, res, next) => {
const {username, password} = req.body

User.findOne({username: username})
.then((userFromDb) => {
    console.log(userFromDb)
    console.log(userFromDb.password)
    if (userFromDb === null) {
      res.render('login', { message: 'Wrong credentials' })
			return
    }
    if (bcrypt.compareSync(password, userFromDb.password)) {
      console.log('logged in')
      req.session.user = userFromDb
      res.redirect('/profile')
      } 
      
    else {
			res.render('login', { message: 'Wrong credentials' })
			return
			}
})
.catch(err => next(err)) 

});


module.exports = router;

