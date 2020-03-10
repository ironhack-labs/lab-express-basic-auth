require('dotenv').config();

const session    = require("express-session");
const MongoStore = require("connect-mongo")(session);
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const bcrypt     = require("bcrypt");


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

//MIDDLEWARE SETUP FOR LOGIN 

app.use(session({
  //SECRET - Used to sign the session ID cookie (required)
  secret: "basic-auth-secret",
  //cookie - Object for the session ID cookie. In this case, we only set the maxAge attribute, which configures the expiration date of the cookie (in milliseconds).
  cookie: { maxAge: 60000 },
  //store - Sets the session store instance. In this case, we create a new instance of connect-mongo, so we can store the session information in our Mongo database.
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

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



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';



const index = require('./routes/index');
app.use('/', index);


// THIS BELOW ENCRYPTS PASSWORD


const saltRounds = 10;

const plainPassword1 = "HelloWorld";
const plainPassword2 = "helloworld";

const salt  = bcrypt.genSaltSync(saltRounds);
const hash1 = bcrypt.hashSync(plainPassword1, salt);
const hash2 = bcrypt.hashSync(plainPassword2, salt);

console.log("Hash 1 -", hash1);
console.log("Hash 2 -", hash2);

///

// IDK WHAT THIS DOES BUT I THINK I NEED THIS -- I know it changes the routes???

const router = require('./routes/auth');
app.use('/', router);

///

// Routes for secret pages
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/site-routes'));




module.exports = app;
