require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
//////////////////////////////
// MY STUFF
//////////////////////////////
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
//////////////////////////////
// MY STUFF /
//////////////////////////////


mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/express-basic-auth', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
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

hbs.registerPartials(path.join(__dirname, "views", "partials"));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

//////////////////////////////
// MY STUFF
//////////////////////////////
app.use(session({
  secret: "should be diff in each app",
  saveUninitialized: true,
  resave: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

app.use(flash())

app.use( (req, res, next) => {
  res.locals.messages = req.flash()
  next()
})
//////////////////////////////
// MY STUFF /
//////////////////////////////



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';



const index = require('./routes/index');
app.use('/', index);

const authRouter = require("./routes/auth-router.js")
app.use("/", authRouter);


module.exports = app;
