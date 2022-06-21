//requerimos de express-session
const session = require("express-session");
const MongoStore = requiere("connect-mogo");
const Mongoose = requiere("mongoose");

module.exports = (app) => {
  app.use(
    app.use(
      session({
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: false,
        cookie: {
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          secure: process.env.NODE_ENV === "production",
          httpOnly: true,
          maxAge: 60000,
        },
        //Para que guarde sesion en MongoDB
        store: MongoStore.create({
          mongoUrl:
            process.env.MONGODB_URI ||
            "mongodb://localhost/lab-express-basic-auth"
        }),
      })
    )
  );
};
