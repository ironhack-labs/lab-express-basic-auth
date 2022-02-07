require('dotenv/config')

require('./db')

const express = require('express')

const hbs = require('hbs')

const app = express()

require('./config')(app)
require('./config/session.config')(app)


app.locals.appTitle = `IronVerifier`

const indexRouter = require('./routes/index.routes')
app.use('/', indexRouter);

const authRouter = require('./routes/auth.routes')
app.use('/', authRouter)

const usersRoutes = require('./routes/user.routes')
app.use('/', usersRoutes)

require('./error-handling')(app)

module.exports = app

