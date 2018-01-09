const express      = require("express");
const path         = require("path");
const logger       = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser   = require("body-parser");
const mongoose     = require("mongoose");
const app          = express();
const bcrypt = require('bcrypt');
const bcryptSalt     = 10;
const session    = require("express-session");
const MongoStore = require("connect-mongo")(session);

const User = require("./models/users");
// Routes

// Controllers

// Mongoose configuration
mongoose.connect("mongodb://localhost/basic-auth");

// Middlewares configuration
app.use(logger("dev"));

// View engine configuration
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Access POST params with body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Authentication
app.use(cookieParser());

app.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 60000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

// Routes

app.get("/", (req, res, next) => {
  res.render("home");
});

app.get("/signup", (req, res, next) => {
  res.render("signup");
});

app.post("/signup", (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username === "" || password === "") {
    res.render("index", {
      message: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, 
  "username",
  (err, user) => {
    if (user !== null) {
      res.render("index", {
        message: "The username already exists"
      });
      return;
    }

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);
    
    var newUser = User({
      username,
      password: hashPass
    });
    
    newUser.save((err) => {
      res.render("index", {message: "Success!!"});
    });
  });
})

app.get("/login", (req, res, next) => {
  res.render("login");
});

app.post("/login", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username === "" || password === "") {
    res.render("login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, (err, user) => {
      if (err || !user) {
        res.render("login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
  });
});

app.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});

app.get("/main", (req, res, next) => {
  res.render("main");
});

app.get("/private", (req, res, next) => {
  res.render("private");
});

app.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
