const withDbConnection = require("../withDbConnection");
const ssss = require("../models/users");

const dataCel = [
  { name: "Adam Samler", occupation: "Actor", catchPhrase: "Mola la leche" },
];

withDbConnection(async () => {
  //await Celebrity.collection.drop();
  await ssss.deleteMany();
  await ssss.create(dataCel);
});
