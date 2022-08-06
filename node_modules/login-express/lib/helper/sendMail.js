const nodemailer = require('nodemailer');

const sendMail = async (
  email,
  defaultLink,
  defaultMessage,
  defaultSubjectLine,
  emailFromUser,
  emailFromPass,
  emailHeading,
  emailSubjectLine,
  emailHost,
  emailPort,
  emailSecure,
  emailMessage
) => {

  if (emailMessage) {
    emailMessage = `${emailMessage}<br>${defaultLink}`;
  }

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: emailSecure, // true for 465, false for other ports
    auth: {
      user: emailFromUser,
      pass: emailFromPass,
    },
    // for local host development
    tls: {
      rejectUnauthorized: false,
    },
  });

  const setFromText = emailHeading
    ? `${emailHeading} ${emailFromUser}`
    : emailFromUser;

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: setFromText, // sender address
    to: email, // list of receivers
    subject: emailSubjectLine || defaultSubjectLine, // subject line
    html: emailMessage || defaultMessage, // html body
  });

  // Uncomment for testing purposes
  // console.log('Message sent: %s', info.messageId);
  // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};

return (module.exports = sendMail);
