const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { route } = require(".");
const User = require("../models/User");

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.get('/login', (req, res, next) => {
	res.render('login')
});


router.post("/signup", (req, res, next) => {
  const { username, password } =
  req.body

  if (password.length < 4) {
		res.render('signup', { message: 'Your password needs to be min 4 chars' })
		return
	}
	if (username.length === 0) {
		res.render('signup', { message: 'Your username cannot be empty' })
		return
	}

  User.findOne({ username : username })
  .then(userFromDB => {

			if (userFromDB !== null) {
				res.render('signup')
			} else {
        const salt = bcrypt.genSaltSync()
				const hash = bcrypt.hashSync(password, salt)
    User.create({ username, password : hash })
    .then(createdUser => { console.log(createdUser)
    res.redirect('/login')
  })
    .catch(err => next(err))
  }    
  })
})

router.post("/login", (req, res, next) => {

  const {username, password } = req.body

  User.findOne({ username: username })
  .then(userFromDB => {console.log("this is the user: ", userFromDB)
if (userFromDB===null) {
    res.render("login", {message: "wrong"})
    return
  }

if (bcrypt.compareSync(password, userFromDB.password)){
  console.log("authenticated")
  req.session.user = userFromDB
  console.log(req.session)
  res.redirect("/profile")
}


})
})

router.get("/logout", (req,res,next)=>{req.session.destroy()
res.render("index")
})


module.exports = router;
