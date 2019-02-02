const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);


const encriptPassword = password => bcrypt.hashSync(password, salt);
const checkPassword = (password, userPassword) => bcrypt.compareSync(password, userPassword)


module.exports = {
    encriptPassword,
    checkPassword
}