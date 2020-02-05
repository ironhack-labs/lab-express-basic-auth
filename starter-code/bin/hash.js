const bcrypt = require("bcrypt");

const compare = (message, myHash) => {
  const mySalt = myHash.slice(0, 29);
  const newHash = bcrypt.hashSync(message, mySalt);
  return newHash === myHash;
};
