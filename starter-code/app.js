require('dotenv').config();

const bodyParser   = require('body-parser');
// MDH: not installed! const cookieParser = require('cookie-parser');
const express      = require('express');
// MDH: not installed! const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
// MDH
const bcrypt       = require('bcrypt');
const session      = require('express-session');
const createError  = require('http-errors');

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
// MDH no longer required by session! app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
// MDH: app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

const index = require('./routes/index'); // MDH: returns a Router
app.use('/', index); // MDH: anybody can go here

// add session (as in the documentation)
app.use(session({'secret':'keyboard cat',cookie:{}}));

// sign up page
app.get('/signup',(req,res)=>{res.render('signup');});
// log in page
app.get('/login',(req,res)=>{res.render('login',{name:req.query.name});});

// process the sign up form

const User=require('./models/user.js')(mongoose); // the model we'll be using

app.post('/signup',(req,res,next)=>{
  // the name and password are in req.body
  if(req.body.name.trim().length==0){next(new Error("No name specified!"));return;}
  if(req.body.password.trim().length==0){next(new Error("No password specified!"));return;}
  let hash=bcrypt.hashSync(req.body.password,10);
  if(!hash){next(new Error("Something went wrong. Please try again!"));return;}
  // we can try to create the user, which will fail if a user with that name already exists
  User.create({name:req.body.name,password:hash})
    .then((user)=>{
        console.log("User created",user);
        // as a service, pass the name along
        res.redirect('/login?name='+user.name); // make the user login!!
      })
    .catch((err)=>next(new Error("Failed to register you somehow. Please try again!"))); // next(err) is better than directly rendering, and the custom error handler below will be called!
});
// a log in request
app.post('/login',(req,res,next)=>{
  // that user might already exists
  if(req.body.name.trim().length==0){next(new Error("No name specified!"));return;}
  if(req.body.password.trim().length==0){next(new Error("No password specified!"));return;}
  // that user might already exist
  console.log("Looking for user '"+req.body.name+"'.");
  User.findOne({'name':req.body.name})
    .then((user)=>{
      console.log("User",user);
      // if same password, good to go
      if(bcrypt.compareSync(req.body.password,user.password)){
        req.session.currentUser=user;
        res.redirect('/welcome');
      }else
        next(new Error("Invalid credentials!"));
    })
    .catch((err)=>next(new Error("Failed to log you in somehow. Please try again!"))); // next(err) is better than directly rendering, and the custom error handler below will be called!
});

// log in page (as a service allow passing in a user name)
app.get('/login',(req,res)=>{res.render('login',{name:req.query.name});});

// PRIVATE ROUTES
function protect(req,res,next){
  console.log("Protecting!");
  // call next with an error if no current user set by a log in
  if(!req.session.currentUser)next(new Error("Log in first!"));else next();
}

app.get('/welcome',protect,(req,res,next)=>{
  // if we get here it's a registered user
  res.render('welcome',{username:req.session.currentUser.name});
});

app.get('/main',protect,(req,res,next)=>{res.render('main');});
app.get('/private',protect,(req,res,next)=>{res.render('private');});

app.get('/logout',protect,(req,res)=>{
  let name=req.session.currentUser.name;
  req.session.destroy(); // replacing: delete req.session.currentUser;
  res.render('logout',{name:name});
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*',(req, res)=>{res.render('not-found');});

// install site-wide error callback (you can still call the default handler through next)
app.use("/",(err,req,res,next)=>{
  res.render('error',{message:err.message});
});

app.listen(3001,()=>{
  console.log("Running the express basic auth app on port 3001.");
});

module.exports = app;
