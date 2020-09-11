const app = require('../app.js')

module.exports = app => {

    // Base URLS
    app.use('/', require('./base.routes.js'))
    //app.use('/', require('./auth.js'))
}   

