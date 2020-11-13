module.exports = app => {

   
    app.use('/', require('./auth.routes.js'))

    app.use('/', require('./base.routes.js'))
}