const session = require("express-session");

 const MongoStore = require("connect-mongo")(session);

 const mongoose = require("mongoose");

 module.exports = (app) => {
   app.use(
     session({
       secret: process.env.SESSION_SECRET,
       resave: true,
       saveUninitialized: false,
       cookie: {
         maxAge: 60000 // 60 * 1000 ms ===> 1 min
       },
       store: new MongoStore({
         mongooseConnection: mongoose.connection,
         // ttl ==> time to live
         ttl: 24 * 60 * 60 // 1 day
       })
     })
   );
 };