require('dotenv/config')

require('./db')

const express = require('express')

const hbs = require('hbs')

const app = express()

require('./config')(app)
require('./config/session.config')(app)

const projectName = 'lab-express-basic-auth'


const authRoutes = require("./routes/auth.routes")
app.use("/", authRoutes)

const userRoutes = require("./routes/user.routes")
app.use("/", userRoutes)




const index = require('./routes/index')
app.use('/', index)

require('./error-handling')(app)

module.exports = app

