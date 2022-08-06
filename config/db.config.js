const mongoose = require ('mongoose')

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/auth";

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }) .then((x) => {
    console.log(`connected to db at ${MONGODB_URI}`)
  }) .catch ((err) => {console.error(`error connecting DB ${MONGODB_URI}`, err)
    process.exit(0)
})

process.on("SIGINIT", function(){
    mongoose.connection.close(function(){
        console.log("Mongoose disconnected on app termination")
        process.exit(0)
    })
})

module.exports.DB = MONGODB_URI