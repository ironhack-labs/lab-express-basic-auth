const session = require('express-session');

const express = require('express');
const router  = express.Router();
const app = express();

const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

const bcrypt = require("bcrypt");
const bcryptSalt     = 5;

const User = require("../models/User")

mongoose
  .connect('mongodb://localhost/starter-code', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

router.use(session({
  secret: 'basic-auth-secret',
  cookie: {
    maxAge: 60000,
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60, // 1 day
  }),
}));


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {
	let username = req.body.user;
	let password = req.body.password;

	if (username === "" || password === "") {
		res.render("signup", {
			errorMessage: "Indicate a username and a password to sign up"
		});
		return;
	}

	User.findOne({ "user": username })
	.then(user => {
		if (user !== null) {
				res.render("signup", {
					errorMessage: "The username already exists!"
				});
				return;
			}

			const salt     = bcrypt.genSaltSync(bcryptSalt);
			const hashPass = bcrypt.hashSync(password, salt);

			const newUser = User();

			newUser.user = username;
			newUser.password = hashPass;

			newUser.save()
				.then(user => {
					res.render("index", {message: "User created"});
				}).catch(error => {next(error);})
	})
	.catch(error => {next(error);})
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post("/login", (req, res, next) => {
  const username = req.body.user;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "user": username })
  .then(user => {
      if (!user) {
        res.render("login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.render("index", {
					message: "Login successful"
				});
      } else {
        res.render("login", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    next(error)
  })
});

router.get('/main', (req, res) => {
  res.render('main');
});

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
		res.redirect('/login')
  }
});

router.get('/private', (req, res) => {
  res.render('private');
});

module.exports = router;
