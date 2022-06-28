const mongoose = require("mongoose");

const Celebrity = require("./models/User.model");

require("dotenv/config");
const mongouri = process.env.MONGODB_URI;

mongoose.connect(mongouri);