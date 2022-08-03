const expressSession = require("express-session");
const MongoStore = require("connect-mongo");
const { DB } = require("./db.config");

const sessionMaxAge = process.env.SESSION_AGE || 7; // LA SESSION DURARÁ 7 DÍAS Y LUEGO SE BORRARÁ AUTOMÁTICAMENTE

const sessionConfig = expressSession({
  secret: process.env.COOKIE_SECRET || "Super secret (change it!)",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.COOKIE_SECURE === "true" || false,
    maxAge: 24 * 3600 * 1000 * sessionMaxAge, // 7 DIAS EN MILISEGUNDOS
    httpOnly: true,
  },
  store: new MongoStore({
    mongoUrl: DB,
    ttl: 24 * 3600 * sessionMaxAge, //7 DIAS EN SEGUNDOS
  })
});

module.exports = sessionConfig;