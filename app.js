require('dotenv').config()


require('./configs/mongoose.config')


require('./configs/debugger.config')


const express = require('express')
const app = express()


require('./configs/preformatter.config')(app)
require('./configs/middleware.config')(app)
require('./configs/views.configs')(app)
require('./configs/session.config')(app)
require('./configs/locals.config')(app)


require('./routes')(app)

module.exports = app
