const mongoose = require("mongoose")

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/lab-express-basic-auth"

mongoose
  .set('strictQuery', false)
  .connect(MONGO_URI)
  .then((x) => {
    const databaseName = x.connections[0].name
    console.log(`Connected to Mongo! Database name: "${databaseName}"`)
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err)
  })
