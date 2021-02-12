const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "process.env.NM_USER",
        pass: "process.env.NM_PWD"
    }
});

module.exports.sendActivationEmail = (email, token) => {
    transporter.sendMail({
        from: `"WireIn Test" <${process.env.NM_USER}>`,
        to: email,
        subject: "Thanks for be part of the WireWorld!",
        html: `<h1>AQUI VA EL CODIGO HTML DE NUESTRO MAIL</h1>
        <p>Click here to activate your account </p>`,

    })
};


//module.exports.sendActivationAccountMessage = (email, subject) => {

//};