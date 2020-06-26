module.exports = app => {

    // Base URLS
    app.use('/', require('./auth.js'))
    app.use('/', require('./base.js'))
}