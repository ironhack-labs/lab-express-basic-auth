document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("lab-express-basic-auth JS imported successfully!");
  },
  false
);

document.querySelector('#password').addEventListener('keyup', e => {
  if (e.target.value.length >= 8) {
    document.querySelector('span').style.visibility = 'visible';
    document.querySelector('button').removeAttribute('disabled');
  } else {
    document.querySelector('span').style.visibility = 'hidden';
    document.querySelector('button').setAttribute('disabled', true);
  }
})