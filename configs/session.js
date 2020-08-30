const session=require("express-session");
const MongoStore=require("connect-mongo")(session);
//const MongoStore=require("connect-mongo");
const mongoose = require("mongoose")



module.exports=app=>{
  app.use(
    session({
      secret:process.env.SECRET,
      saveUninitialized:true,
      resave:false,
      cookie:{maxAge:60000},
      store:new MongoStore({
        mongooseConnection:mongoose.connection,
        tti:60*60*24
      })
    })
  )
}

