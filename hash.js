const bcrypt = require("bcrypt");
const password = "123456";
const salt = bcrypt.genSaltSync();
const hash = bcrypt.hashSync(password, salt);
// console.log({salt});
// console.log({hash});

function compare(password, hash) {
    const salt = hash.slice(0, 29);
    return hash === bcrypt.hashSync(password, salt);
}

console.log(compare('123456', hash));