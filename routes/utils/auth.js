const User = require('../../models/User.model');
const bcrypt = require('bcryptjs');

class Authenticator {    
    async validateInfo (user, next) {
        const validationErrors = {};

        try {
            const findUser = await User.findOne( { email: user.email })

            if (findUser) {
                validationErrors.emailError = 'Email already registered. Please proceed to login.';
            } else {
                for (const prop in user) {
                    if (!user[prop].trim().length) {
                        validationErrors[prop + 'Error'] = 'This field must be informed.'
                    }
                }
            }

            return validationErrors;
        } 
        
        catch (error) {
            next(error);
        }
    }

    async encrypt (password) {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);

        return bcrypt.hashSync(password, salt);
    }

    async checkPassword(password, hash) {
        return bcrypt.compareSync(password, hash);
    }
}

const authenticator = new Authenticator();

module.exports = authenticator;