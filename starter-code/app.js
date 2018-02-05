const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const expressLayouts = require('express-ejs-layouts')

const users = require('./routes/users')
const login = require('./routes/login')
const index = require('./routes/index')
const signup = require('./routes/signup')
const pic = require('./routes/pic')
const gif = require('./routes/gif')
const MongoStore = require('connect-mongo')(session)

const app = express()

// Controllers

// Mongoose configuration
mongoose.connect('mongodb://localhost/basic-auth', {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE
})

// Middlewares configuration
app.use(express.static(path.join(__dirname, '/public')))
app.use(logger('dev'))

// View engine configuration
app.use(expressLayouts)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.set('layout', 'layouts/main')

// Access POST params with body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Authentication
app.use(cookieParser())

// sesion

app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  }),
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}))

app.use(function (req, res, next) {
  app.locals.user = req.session.currentUser
  next()
})

// Routes
app.use('/', index)
app.use('/login', login)
app.use('/signup', signup)
app.use('/users', users)
app.use('/pic', pic)
app.use('/gif', gif)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404)
  const data = {
    title: '404 Not Found'
  }
  res.render('not-found', data)
})

app.use(function (err, req, res, next) {
  console.error('ERROR', req.method, req.path, err)
  if (!res.headersSent) {
    const data = {
      title: '500 Ouch'
    }
    res.status(500)
    res.render('error', data)
  }
})

module.exports = app
