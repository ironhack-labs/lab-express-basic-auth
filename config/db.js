const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return console.log("Base de datos conectada.");
    
  } catch (error) {
    console.log(error);
    return process.exit(1);
  }
};

module.exports = connectDB;
