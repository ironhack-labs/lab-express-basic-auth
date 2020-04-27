const mongoose = require('mongoose')


const logsSchema = new mongoose.Schema({
  username: String,
  password: String,
})

const Logs = mongoose.model("Logs", logsSchema)

module.exports = Logs