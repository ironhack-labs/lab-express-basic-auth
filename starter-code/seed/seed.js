const withDbConnection = require("../withDbConnection");
const Users = require("../models/User");

const dataUsers = [
  {
    name: "Rubén",
    lastname: "Vaquero",
    country: "Spain",
    username: "rvaquero@english.com",
    password: "1234",
    accept: true
  },
  {
    name: "Román",
    lastname: "Méndez",
    country: "Spain",
    username: "rmendez@english.com",
    password: "1234",
    accept: true
  }
];

withDbConnection(async () => {
  await Users.deleteMany();
  await Users.create(dataUsers);
});
