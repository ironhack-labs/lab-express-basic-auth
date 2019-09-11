const bcrypt = require("bcrypt");

// const salt = bcrypt.genSaltSync();
// const hash = bcrypt.hashSync("hello", salt);
// console.log(salt);
// console.log(hash);

const hash = bcrypt.hashSync("hello", "$2b$10$Ut1ybuuUzq3cbo4n6Iq1xO");
console.log(hash);
console.log("$2b$10$Ut1ybuuUzq3cbo4n6Iq1xOuwJ771NuCoxlk.CohNr52mP3feNku22");
