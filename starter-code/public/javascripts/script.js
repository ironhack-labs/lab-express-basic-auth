document.addEventListener(
  'DOMContentLoaded',
  () => {
    console.log('IronGenerator JS imported successfully!');
  },
  false
);

// const zxcvbn = require('zxcvbn');
const password = document.getElementById('password');
const meter = document.getElementById('password-strength-meter');

password.oninput = function () {
  const result = zxcvbn(password.value);
  meter.value = result.score;
};
