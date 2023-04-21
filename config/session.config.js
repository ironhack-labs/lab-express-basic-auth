// const session = require("express-session");
// const MongoStore = require("connect-mongo");

// module.exports = (app) => {
//   // https://stackoverflow.com/questions/23413401/what-does-trust-proxy-actually-do-in-express-js-and-do-i-need-to-use-it
//   // https://expressjs.com/en/guide/behind-proxies.html
//   app.set("trust proxy", 1);
//   app.use(
//     session({
//       secret: process.env.SESSION_SECRET, // String value used to sign session cookies
//       resave: true, // Forces the session to be saved back to the session store, even if the session was never modified during the request.
//       saveUninitialized: false, // Forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified. Choosing false is useful for implementing login sessions, reducing server storage usage
//       cookie: {
//         sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // https://web.dev/samesite-cookies-explained/
//         secure: process.env.NODE_ENV === "production",
//         httpOnly: true,
//         maxAge: 60000, // 1 min
//       },
//       // Save the session in the Database (sessions collection)
//       store: MongoStore.create({
//         mongoUrl: process.env.MONGODB_URI || "mongodb://localhost/session",
//       }),
//     })
//   );
// };
