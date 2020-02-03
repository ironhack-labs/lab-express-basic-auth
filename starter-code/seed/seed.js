const withDbConnection = require("../withDbConnection");
const Users = require("../models/User");

const dataUsers = [
  { username: "Ruben Vaquero", password: "1234"},
  { username: "German Román", password: "1234"}
];

withDbConnection(async () => {
  await Users.deleteMany();
  await Users.create(dataUsers);
});
