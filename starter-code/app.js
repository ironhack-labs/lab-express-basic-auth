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

const flash  =require("connect-flash");




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
      

hbs.registerPartials(path.join(__dirname,"views","partials"));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use(session({
  //resave and saveUninitialize are just thats differnt for every app
  resave:true,
  saveUninitialized:true,
  //"secret should be a string thats differnt for everu app"
  secret:"eXUW6iJ6=2h}yBC36P^;MmJ+fpYiU8A[Mg2KNRAj?C",
}));




//enables flash messages in our routes with "req.flash"
app.use(flash());
//app.use()define MIDDELWARE functions (they runs before ALL your routes)
app.use((req,res,next)=>{
  //send flash messagesto the hbs file as ""messages
res.locals.messages=req.flash();

//you need this or your app womt work(page will load forever)
next();
});

// default value for title local
app.locals.title = 'Express-node-auth';



const index = require('./routes/index');
app.use('/', index);

const authRouter = require("./routes/auth-router.js");
app.use("/",authRouter);

module.exports = app;
