const session=require('express-session')

module.exports= app => {
    app.use(session({
        secret:'qwerty',
        resave:false,
        saveUninitialized:true,
        cookie:{maxAge: 60000}
    }))
}