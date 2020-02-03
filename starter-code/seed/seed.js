const withDbConnection = require("../withDbConnection");
const Users = require("../models/Users");

const dataUsers = [
  { name: "Adam Samler", occupation: "Actor", catchPhrase: "Mola la leche" },
];

withDbConnection(async () => {
  //await Celebrity.collection.drop();
  await Users.deleteMany();
  await Users.create(dataUsers);
});
