const bcrypt = require('bcryptjs');

const saltRounds = 10;

const pwdEncrypt = async (password) => {
    const salt = await bcrypt.genSalt(saltRounds);

    const encrypted = bcrypt.hashSync(password, salt);

    return encrypted;
};

const pwdCompare = async (pwd, hash) => bcrypt.compareSync(pwd, hash);

module.exports = { pwdEncrypt, pwdCompare };
