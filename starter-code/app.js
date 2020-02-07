require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

mongoose
  .set("useCreateIndex", true)
  .connect("mongodb://localhost/express-auth", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(db => {
    console.log(`Connected to mongo successful!`);
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");
app.use(express.static(path.join(__dirname, "public")));

// Express Session setup
app.use(
  session({
    secret: "lab-express-session",
    cookie: { maxAge: 60 * 1000 },
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      resave: true,
      saveUninitialized: false,
      ttl: 72 * 60 * 60
    })
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.currentUser;
  next();
});

app.locals.title = "Express - Authentication App";

const index = require("./routes/index");
app.use("/", index);

module.exports = app;
