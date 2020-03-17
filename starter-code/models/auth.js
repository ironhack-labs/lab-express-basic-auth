const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const authSchema = new Schema(
  {
    username: String,
    password: String
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    }
  }
);

const Movie = mongoose.model("User", authSchema);
module.exports = Movie;
