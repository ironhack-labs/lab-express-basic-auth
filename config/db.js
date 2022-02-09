// ℹ️ package responsible to make the connection with mongodb
// https://www.npmjs.com/package/mongoose
const mongoose = require("mongoose");


const connectDB = async () => {

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    return  console.log("Conectado a la base de datos")
    
  } catch (error) {
    
    console.log(error)
    return process.exit(1)
  }
}

module.exports = connectDB