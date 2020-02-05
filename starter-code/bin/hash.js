const bcrypt = require("bcrypt");

const plainText = "hello world!";

console.time("encrypt");
const salt = bcrypt.genSaltSync(10);
console.log("salt: ", salt);
const hash = bcrypt.hashSync(plainText, salt);
console.log("hash: ", hash);
console.timeEnd("encrypt");

const compare = (message, myHash) => {
  const mySalt = myHash.slice(0, 29);
  const newHash = bcrypt.hashSync(message, mySalt);
  console.log("hash from DB: ", myHash);
  console.log("generated hash: ", newHash);
  return newHash === myHash;
};

console.log(compare("hello world", hash));
