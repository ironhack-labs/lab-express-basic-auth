const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SignUpSchema = new Schema ({
  username: {type: String},
  password: {type: String},
});

const SignUp = mongoose.model('SignUp', SignUpSchema);

module.exports = SignUp;