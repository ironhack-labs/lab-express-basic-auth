require('dotenv/config')

require('./db')

const express = require('express')

const hbs = require('hbs')

const app = express()

require('./config')(app)
require('./config/session.config')(app)

app.locals.title = 'Autenticación básica'

const index = require('./routes/index')
app.use('/', index)

const authRoutes = require('./routes/auth.routes')
app.use('/auth', authRoutes)

const protectedRoutes = require('./routes/protected.routes')
app.use('/', protectedRoutes)

require('./error-handling')(app)

module.exports = app
