require('dotenv/config')

require('./db')

const express = require('express')

const hbs = require('hbs')

const app = express()

require('./config')(app)
require('./config/session.config')(app)

app.locals.appTitle = `Auth-App`

const indexRouter = require('./routes/index.routes')
app.use('/', indexRouter)

const authRouter = require('./routes/auth.routes')
app.use('/', authRouter)

const usersRouter = require('./routes/users.routes')
app.use('/', usersRouter)

require('./error-handling')(app)

module.exports = app


