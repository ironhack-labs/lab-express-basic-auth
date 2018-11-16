require('dotenv').config();

// const port         = 3000;
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session    = require("express-session");
const MongoStore = require("connect-mongo")(session);
const bcrypt = require('bcrypt');
const bcryptSalt     = 10;
const router  = require('./routes/auth')
const User = require('./models/user');

const genericUser = new User({
  user : String,
  password: String,
});

mongoose
  .connect('mongodb://localhost/starter-code', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', router);

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

app.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 60000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));
      
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

//añadido por nosotros
// app.get('/success', (req, res) => {
//   if (req.session.inSession) {
//     const sessionData = { ...req.session  };
//     res.render('success', {
//       sessionData,
//     });
//   } else {
//     res.render('404');
//   }
// });

// app.get('/login', (req, res) => {
//   res.render('login');
// });

// app.post('/login', (req, res) => {
//   User.findOne({
//     user: req.body.user,
//   }).then((found) => {
//     const matches = bcrypt.compareSync(req.body.password, found.password);

//     if (matches) {
//       req.session.inSession = true;
//       req.session.user = req.body.user;

//       res.redirect('success');
//     } else {
//       req.session.inSession = false;
//       res.redirect('login');
//     }
//   });
// });


// app.post('auth/signUp', function (req, res) {
//   const saltRounds = 5;
//   genericUser.user = req.body.user
//   const salt = bcrypt.genSaltSync(saltRounds);
//   const hash = bcrypt.hashSync(req.body.password, salt);
//   genericUser.password = hash
//   genericUser.save().then(x => {
//       req.session.inSession = true
//       res.json({
//           inSessionCreated: true
//       })
//   })
// })



// router.post("/login", (req, res, next) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   if (username === "" || password === "") {
//     console.log("felicidades")
//     res.render("auth/login", {
//       errorMessage: "Indicate a username and a password to sign up"
//     });
//     return;
//   }

//   User.findOne({ "username": username })
//   .then(user => {
//       if (!user) {
//         res.render("auth/login", {
//           errorMessage: "The username doesn't exist"
//         });
//         return;
//       }
//       if (bcrypt.compareSync(password, user.password)) {
//         // Save the login in the session!
//         req.session.currentUser = user;
//         res.redirect("/");
//       } else {
//         res.render("auth/login", {
//           errorMessage: "Incorrect password"
//         });
//       }
//   })
//   .catch(error => {
//     next(error)
//   })
// });

// fin añadido por nosotros


// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';



// const index = require('./routes/index');
// app.use('/', index);

const auth = require('./routes/auth');
app.use('/auth', auth);


module.exports = app;
