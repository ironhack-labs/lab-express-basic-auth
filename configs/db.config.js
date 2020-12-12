require('dotenv').config();
const mongoose = require('mongoose');

const dbOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, dbOptions);
    console.log("Connected to db");
  } catch(err) {
    console.log(err);
  }
};

module.exports = connectDb;

  