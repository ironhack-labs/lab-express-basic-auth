require("dotenv").config();

const port = 3000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const genericUser = new User();
const router = require("./routes/index");
const bcryptSalt = 10;
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

mongoose
  .connect(
    "mongodb://localhost/starter-code",
    { useNewUrlParser: true }
  )
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
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
app.use("/", router);
// Express View engine setup

app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// default value for title local
app.locals.title = "Express - Generated with IronGenerator";

router.get("/", (req, res, next) => {
  res.render("login");
});
router.post("/login", (req, res, next) => {
  const user = req.body.user;
  const password = req.body.password;

  if (user === "" || password === "") {
    res.render("error", {
    });
    return;
  } 

  User.findOne({ user: user })
    .then(user => {
      if (!user) {
        res.render("not-found")
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("/", {
          errorMessage: "Incorrect password"
        });
      }
    })
    .catch(error => {
      next(error);
    });
});

router.post("/index", (req, res, next) => {
  const user = req.body.user;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hasPass = bcrypt.hashSync(password, salt);

  const newUser = User({
    user,
    password: hasPass
  });

  newUser
    .save()
    .then(user => {
      res.redirect("/");
    })
    .catch(error => {
      console.log(error);
    });
});

app.use(
  session({
    secret: "basic-auth-secret",
    cookie: { maxAge: 60000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60
    })
  })
);

const index = require("./routes/index");
app.use("/", index);

module.exports = app;
