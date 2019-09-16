const mongoose = require("mongoose");
const Schema = mongoose.Schema;


mongoose
  .connect('mongodb://localhost/usuarios', { useNewUrlParser: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const schemaName = new Schema(
  {
    username: String,
    password: String
  },
  {
    timestamps: true
  }
);

const Model = mongoose.model("Users", schemaName);
module.exports = Model;