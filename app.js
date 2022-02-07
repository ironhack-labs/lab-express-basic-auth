require('dotenv/config');

require('./db');

const express = require('express')
const app = express()

require('./config')(app)
require("./config/session.config")(app)

const projectName = 'lab-express-basic-auth'
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase()

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`

const index = require('./routes/index.routes')
app.use('/', index)

const user = require('./routes/user.routes')
app.use('/', user)

const auth = require('./routes/auth.routes')
app.use('/', auth)

const private = require('./routes/private.routes')
app.use('/', private)

require('./error-handling')(app)

module.exports = app