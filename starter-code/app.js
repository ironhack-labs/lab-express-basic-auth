require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const Users        = require("./models/User");
const bcrypt       = require("bcrypt");
const session      = require("express-session");
const MongoStore   = require("connect-mongo")(session);

const { check, validationResult } = require('express-validator');

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

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
hbs.registerPartials(__dirname + "/views/partials");
app.use(bodyParser.urlencoded({ extended: true }));


// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

app.use(
  session({
    secret: "basic-auth-secret",
    cookie: { maxAge: 60000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    })
  })
);

app.get("/signup", (req, res) => {
  res.render("signup")
})


app.post("/signup",[
  check('username').isLength({ min: 1 }),
  check('password').isLength({ min: 1 })
], (req, res) => {
  const saltRounds = 10;
  const plainPassword1 = req.body.password;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(plainPassword1, salt);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  Users.findOne({name: req.body.username})
      .then(userFound => {
          if (userFound !== null){
              res.json({ authorised: false, reason: "User already exists"});
          } else {
              const document = {
                  name: req.body.username,
                  password: hash
              }
              Users.create(document)
              .then(userCreated => {
                  /* 
                  * Indicates to the client that the was successful
                  * res.status(500); 
                  */ 
                  res.json({created: true, userCreated});
              })
              .catch(() => {
                  /* 
                  * Indicates to the client there was an error 
                  * that has nothing to do with the sended request
                  * res.status(500); 
                  */
                  res.json({created: false });
              })
          }
      });    
})

app.get("/login", (req, res) => {
  res.render("login")
})

app.get("/private", (req, res) => {
  res.render("private")
})

app.post("/login", [
  check('username').isLength({ min: 1 }),
  check('password').isLength({ min: 1 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  function onError(reason){
      res.json({authorised: false, reason})
  }
  Users.findOne({name: req.body.username})
      .then(userFound => {
          if(userFound === null){
              onError("Invalid User Name")
          } else {
            console.log("given password=" + req.body.password);
            console.log("found password=" + userFound.password);
            if (bcrypt.compareSync(req.body.password, userFound.password)){
              req.session.currentUser = userFound._id;
              res.redirect("/private");
            } else {
              onError("Invalid Username or Password")
            }
         }       
      })
      .catch(error => {
        console.log(error);
        onError("Try Again");
      });
});

app.get("/main", (req, res) => {
  if (req.session.currentUser) {
      res.render("main");
    } else {
      res.redirect("/login");
    }
})


const index = require('./routes/index');
app.use('/', index);


module.exports = app;
