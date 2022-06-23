const session = require('express-session');



module.exports = app =>{
//esto solo es cuando se sube a heroku!

app.set("trust proxy",1);
//utilizar la sesión
app.use(
    session({
        secret:process.env.SECRET,
        resave:true,
        saveUninitialized:false,
        cookie:{
            sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure:process.env.NODE_ENV === 'production',
        httpOnly:true,
        maxAge:60000
        }
    })
)
}