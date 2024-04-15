const User = require("../models/User.model");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");

//Periodo de vida
const MAX_AGE = 7;
module.exports.sessionConfig = expressSession({
    //la clave que identifica con la cookie
    secret: "super secret",
    //Si quieres renocar la session y la coockiee
    resave: false,
    saveUninitialized: false,
    cookie:{
        secure: false,
        httpOnly: true,
        //Aqui esta en milisegundos
        maxAge: 4 * 3600 * 1000 * MAX_AGE,
    },
    store: new MongoStore({
        mongoUrl: "mongodb://127.0.0.1:27017/lab-express-basic-auth",
        //Aqui esta en segundos
        ttl: 4 * 3600 * MAX_AGE,
    }),
});
module.exports.loggedUser = (req, res, next) =>{
    const userId = req.session.userId;

    if(userId){
        User.findById(userId)
        .then((user)=>{
          console.log(user);
          if (user) {
            req.currentUser = user;
            res.locals.currentUser = user;
            console.log(user);
            next();
          }else{
            next();
          }  
        })
        .catch((err)=>next(err))
    }else{
        next();
    }
}