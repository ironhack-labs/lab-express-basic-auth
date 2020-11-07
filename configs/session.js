// configs/session.config.js

// require session
const session = require('express-session');

// since we are going to USE this middleware in the app.js,
// let's export it and have it receive a parameter
module.exports = app => {
  // <== app is just a placeholder here
  // but will become a real "app" in the app.js
  // when this file gets imported/required there

  // use session
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 60000 } // 60 * 1000 ms === 1 min
    })
  );
};

// app.js
// ... all imports stay unchanged

const app = express();
//     |
//     |-----------------------------|
// use session here:                 V
require('./configs/session.config')(app);
//                       ^
//                       |
// the "app" that gets passed here
// is the previously defined Express app (const app = express();)

// ... the rest of this file stays unchanged
