require('dotenv/config')

require('./db')

const express = require('express')
const app = express()

const hbs = require('hbs')

require('./config')(app)
require('./config/session-config')(app)

const indexRoutes = require('./routes/index.routes')
app.use('/', indexRoutes)

const authRoutes = require('./routes/auth.routes')
app.use('/', authRoutes)

const userRoutes = require('./routes/user.routes')
app.use('/', userRoutes)

require('./error-handling')(app)

module.exports = app

