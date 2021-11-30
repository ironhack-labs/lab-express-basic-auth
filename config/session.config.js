const session = require ("express-session")
const MongoStore = require ("connect-mongo")

const  {NODE_DEV, SESSION_SECRET, MONGODB_URI} = process.env;

const isProduction = NODE_ENV === "production";

function sessionInit(app) {
  app.set("trust proxy", 1);
  app.use(
    session({
      // secret is the "password" for session to read your hashed cookie
      secret: SESSION_SECRET,
      // re save the cookie any time there is a change in it
      resave: true,
      // dont save the cookie till there is something attatched to it
      saveUninitialized: false,
      cookie: {
        // config the policies for cookies coming or not from the same site as the server
        sameSite: isProduction ? "none" : "lax",
        // only allow cookies from https when running un production
        secure: isProduction,
        // make cookies unable to be read by the client with js
        httpOnly: true,
        // how long the cookie should last
        maxAge: 6000000,
      },
      // save the cookie in mongo db
      store: MongoStore.create({
        mongoUrl: MONGODB_URL,
        // time to live, how long we should save this cookie
        ttl: 60 * 60 * 24,
      }),
    })
  );
}

module.exports = { sessionInit };
