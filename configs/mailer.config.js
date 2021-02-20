const nodemailer = require("nodemailer")
const {generateTemplate} = require("./mailtemplate")

const transporter = nodemailer.createTransport({
    service:"Gmail",
    auth: {
        user:process.env.NM_USER,
        pass:process.env.NM_PASSWORD
    }
});


module.exports.sendActivationEmail = (email, token) => {
   transporter.sendMail({
     from: `"Emosi2 compra2" <${process.env.NM_USER}>`,
     to: email,
     subject: `activate your account`,
     text: `¡Check your inbox!`,
     html:generateTemplate(token)
   }); 
};


