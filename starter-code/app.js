require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const multer = require('multer');

mongoose
  .connect(process.env.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
  })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
app.use(express.static('uploads'));

app.use(session({
    secret: 'basic-auth-secret',
    cookie: { maxAge: 60000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60,
    }),
  })
);

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// //Private mode after login, otherwise redirects to /user/main
app.use('/user/private', protect);

function protect(req, res, next) {
  if (req.session.currentUser) next();
  else res.redirect('/user/main');
}

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
app.use('/user', require('./routes/user'));

//Error file
app.use((err, req, res, next)=>{
  res.render("error.hbs", {message: err});
})

module.exports = app;


app.listen(process.env.PORT, () => {
  console.log('Express is listening on', process.env.PORT);
});


//This I do not need, since I do not listen to it directly but I have it directed from the bin and .env
// app.listen(3000, () => {
//   console.log('Express is listening on', 3000);
// });