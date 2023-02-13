const mongoose = require("mongoose");
require("dotenv")

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost/lab-express-basic-auth";

mongoose
  .set('strictQuery', false)
  .connect(MONGO_URI)
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });
