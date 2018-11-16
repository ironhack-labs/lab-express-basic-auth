const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const session = require("express-session");

const MongoStore = require("connect-mongo")(session);

const User = require ('../models/User');
const mongoose = require ('mongoose');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.post('/', (req, res, next) => {
  let name= req.body.user;
  let password = req.body.password
  if (name === "" || password === "") {
    res.render("index", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
  const saltRound= 5;
  const salt= bcrypt.genSaltSync(saltRound);
  const hashPassword = bcrypt.hashSync(password, salt);
  User.create({name: name, password: hashPassword})
      .catch((err) => {
        console.log('An error happened:', err);
      })
      .then((user) => {
        console.log('The user has been saved', user.name);
        res.redirect('/login');
      });

});


router.get('/login', (req, res, next) => {
  res.render('login');
});


router.use(session({
	secret: "basic-auth-secret",
	cookie: {
		maxAge: 60000
	},
	store: new MongoStore({
		mongooseConnection: mongoose.connection,
		ttl: 24 * 60 * 60 // 1 day
	})
}));

router.post('/login', (req, res) => {
  let name= req.body.user;
  let password = req.body.password
  if (name === "" || password === "") {
    res.render("login", {
      errorMessage: "Indicate a username and a password to login"
    });
    return;
  }
	User.findOne({
		name: req.body.user
	}).then(found => {
		const matches = bcrypt.compareSync( req.body.password, found.password)

		if (matches) {
			req.session.inSession = true
			req.session.user = req.body.user

			res.redirect('main')
		} else {
			req.session.inSession = false
			res.redirect('login')
		}
  })
  .catch(()=>{
    res.render("auth/login", {
      errorMessage: "Invalid username"
    });
    return;
  })
})

router.get('/private',(req,res)=>{
	
  checkSession(req.session, res,'private');

})

router.get('/main',(req,res)=>{
	
  checkSession(req.session, res,'main');

})

router.get('/logout',(req,res)=>{
  req.session.destroy(()=>{
    res.redirect('login');
  })

})
let checkSession = (reqSession,res, page) => {
  if (reqSession.inSession){
    let sessionData = {...reqSession}
    res.render(page,{sessionData});
  }
  else{
    res.render(`login`, {
          errorMessage: "You must be logged to access this page"
        });
  }
}


module.exports = router;

