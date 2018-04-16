require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session = require("express-session");
const MongoStore = require("connect-mongo")(session)


mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/lab-express-basic-auth', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 60*60*24*2 }, // 2 days to expire cookie
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24*60*60*2 // 1 day
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



const homeRouter = require('./routes/homeRouter');
app.use('/', homeRouter);

const authRouter = require("./routes/authRouter");
app.use("/auth", authRouter);



module.exports = app;
