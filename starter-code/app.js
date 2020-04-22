require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const saltRounds = 10;
const router = new express.Router();
const User = require("./models/User");

mongoose
  .connect("mongodb://localhost/basic-auth", { useNewUrlParser: true })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err);
  });

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: "basic-auth-secret",
    cookie: { maxAge: 60000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60, // 1 day
    }),
  })
);

// Express View engine setup

app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true,
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// default value for title local
app.locals.title = "Express - Generated with IronGenerator";

const index = require("./routes/index");
app.use("/", index);

app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/signin", (req, res, next) => {
  res.render("signin");
});

app.post("/", (req, res) => {
  User.findOne({ username: username }).then((user) => {
    if (!user) {
      bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        User.create({ username: req.body.username, password: hash });
        req.session.currentUser = user;
        res.redirect("/secret");
      });
      res.redirect("/");
    } else {
      res.render("index", {
        errorMessage: "An account with that email already exists.",
      });
    }
  });
});

app.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        res.render("signin", {
          errorMessage: "The username doesn't exist.",
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/main");
      } else {
        res.render("signin", {
          errorMessage: "Incorrect password",
        });
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/signin");
  });
});

app.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.render("signin");
  }
});

app.get("/main", (req, res, next) => {
  res.render("main");
});

app.get("/other", (req, res, next) => {
  res.render("other");
});

// bcrypt.compare(req.body.password, hash).then(function (result) {
//   console.log(result);
// });

module.exports = app;
