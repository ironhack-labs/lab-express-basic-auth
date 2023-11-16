const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lab-express-basic-auth";
mongoose.set("strictQuery", false);

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async (x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );

    // Check if the example user already exists
    const existingUser = await User.findOne({ username: "example_user" });

    if (!existingUser) {
      // Hash the password
      const hashedPassword = bcrypt.hashSync("user_password", 10);

      // Create a new user
      const newUser = {
        username: "example_user",
        email: "example@example.com",
        passwordHash: hashedPassword,
      };

      // Create the user
      await User.create(newUser);
      console.log("Example user created");
    } else {
      console.log("Example user already exists");
    }
  })
  .catch((err) => {
    console.error("Error connecting to or creating user in mongo: ", err);
  });
