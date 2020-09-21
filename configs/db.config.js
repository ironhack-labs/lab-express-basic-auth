const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/basicAuth";

mongoose
  .connect("mongodb://localhost/express-basic-auth-dev", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${MONGODB_URI}"`)
  )
  .catch((err) => console.error(`Error connecting to "${MONGODB_URI}"`, err));
