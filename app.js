require('dotenv/config')
require('./db')

const express = require('express')
const hbs = require('hbs')

const app = express()
require('./config')(app)
require("./config/session.config")(app)

app.locals.title = 'First Auth'

const index = require('./routes/index')
app.use('/', index);

const authRoutes = require("./routes/auth.routes")
app.use("/", authRoutes)

const userRoutes = require("./routes/user.routes")
app.use("/", userRoutes)


require('./error-handling')(app);

module.exports = app

