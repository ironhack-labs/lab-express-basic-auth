const userModel = require("./models/user");

exports.findUser = function(query) {
  return userModel.findOne(query);
};

exports.createUser = function(username, password) {
  return userModel.create({ username, password });
};
