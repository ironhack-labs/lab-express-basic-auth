module.exports = app => {

    // Base URLS
    app.use('/', require('./base.routes.js'))
    app.use("/", require("./protect.routes.js"))
}