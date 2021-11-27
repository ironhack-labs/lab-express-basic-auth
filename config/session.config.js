const session = require("express-session");
const MongoStore = require("connect-mongo");

const { NODE_ENV, SESSION_SECRET, MONGO_URL } = process.env;

const isProduction = NODE_ENV === "production";

function sessionInit(app) {
  app.set("trust proxy", 1);
  app.use(
    session({
      secret: SESSION_SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
        httpOnly: true,
        maxAge: 6000000,
      },
      store: MongoStore.create({
        mongoUrl: MONGO_URL,
        ttl: 60 * 60 * 24,
      }),
    })
  );
}

module.exports = { sessionInit }