const siteKey = '6Le2U5IUAAAAAF7H_frmiU58oQANzjDKE4Phxybx';
const secretKey = '6Le2U5IUAAAAAMsDQXjVk2_Fa9Nw14VKVJe7SUzf';

var Recaptcha = require('express-recaptcha').Recaptcha;
//import Recaptcha from 'express-recaptcha'
// var recaptcha = new Recaptcha(siteKey, secretKey);
//or with options
var options = { theme: 'dark' };
var recaptcha = new Recaptcha(siteKey, secretKey, options);

module.exports = recaptcha;
